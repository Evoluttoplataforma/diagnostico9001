import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  name: string;
  email: string;
  phone: string;
  company: string;
  score: number;
  diagnosis_level: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("PIPEDRIVE_API_TOKEN");
    if (!apiToken) {
      throw new Error("PIPEDRIVE_API_TOKEN not configured");
    }

    const leadData: LeadData = await req.json();
    console.log("Received lead data:", leadData);

    // Get pipelines to find "Inbound"
    const pipelinesResponse = await fetch(
      `https://api.pipedrive.com/v1/pipelines?api_token=${apiToken}`
    );
    const pipelinesResult = await pipelinesResponse.json();
    console.log("Pipelines:", pipelinesResult);

    let pipelineId = null;
    let firstStageId = null;

    if (pipelinesResult.success && pipelinesResult.data) {
      const inboundPipeline = pipelinesResult.data.find(
        (p: { name: string }) => p.name.toLowerCase().includes("inbound")
      );
      if (inboundPipeline) {
        pipelineId = inboundPipeline.id;
        console.log("Found Inbound pipeline:", pipelineId);

        // Get stages for this pipeline
        const stagesResponse = await fetch(
          `https://api.pipedrive.com/v1/stages?pipeline_id=${pipelineId}&api_token=${apiToken}`
        );
        const stagesResult = await stagesResponse.json();
        if (stagesResult.success && stagesResult.data && stagesResult.data.length > 0) {
          firstStageId = stagesResult.data[0].id;
          console.log("First stage ID:", firstStageId);
        }
      }
    }

    // First, create a person in Pipedrive
    const personResponse = await fetch(
      `https://api.pipedrive.com/v1/persons?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: leadData.name,
          email: [{ value: leadData.email, primary: true }],
          phone: [{ value: leadData.phone, primary: true }],
        }),
      }
    );

    const personResult = await personResponse.json();
    console.log("Person creation result:", personResult);

    if (!personResult.success) {
      throw new Error(`Failed to create person: ${JSON.stringify(personResult)}`);
    }

    const personId = personResult.data.id;

    // Create an organization
    const orgResponse = await fetch(
      `https://api.pipedrive.com/v1/organizations?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: leadData.company,
        }),
      }
    );

    const orgResult = await orgResponse.json();
    console.log("Organization creation result:", orgResult);

    let orgId = null;
    if (orgResult.success) {
      orgId = orgResult.data.id;

      // Update person with organization
      await fetch(
        `https://api.pipedrive.com/v1/persons/${personId}?api_token=${apiToken}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            org_id: orgId,
          }),
        }
      );
    }

    // Get deal labels to find "DIAGNÓSTICO"
    const dealFieldsResponse = await fetch(
      `https://api.pipedrive.com/v1/dealFields?api_token=${apiToken}`
    );
    const dealFieldsResult = await dealFieldsResponse.json();
    
    let labelId = null;
    if (dealFieldsResult.success && dealFieldsResult.data) {
      const labelField = dealFieldsResult.data.find(
        (f: { key: string }) => f.key === "label"
      );
      if (labelField && labelField.options) {
        const diagnosticoLabel = labelField.options.find(
          (opt: { label: string }) => opt.label.toUpperCase().includes("DIAGNÓSTICO") || opt.label.toUpperCase().includes("DIAGNOSTICO")
        );
        if (diagnosticoLabel) {
          labelId = diagnosticoLabel.id;
          console.log("Found DIAGNÓSTICO label:", labelId);
        }
      }
    }

    // Create a deal in Pipedrive (in Inbound pipeline with DIAGNÓSTICO label)
    const dealTitle = `Diagnóstico ISO 9001 - ${leadData.name} (${leadData.company})`;
    
    const dealBody: Record<string, unknown> = {
      title: dealTitle,
      person_id: personId,
      org_id: orgId,
    };

    if (pipelineId) {
      dealBody.pipeline_id = pipelineId;
    }
    if (firstStageId) {
      dealBody.stage_id = firstStageId;
    }
    if (labelId) {
      dealBody.label = labelId;
    }

    const dealResponse = await fetch(
      `https://api.pipedrive.com/v1/deals?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dealBody),
      }
    );

    const dealResult = await dealResponse.json();
    console.log("Deal creation result:", dealResult);

    if (!dealResult.success) {
      throw new Error(`Failed to create deal: ${JSON.stringify(dealResult)}`);
    }

    // Add a note to the deal with diagnosis details
    const dealNote = `
📊 **Diagnóstico de Maturidade ISO 9001**

👤 **Contato:** ${leadData.name}
🏢 **Empresa:** ${leadData.company}
📧 **Email:** ${leadData.email}
📱 **Telefone:** ${leadData.phone}

📈 **Score:** ${leadData.score}/100
🏷️ **Nível:** ${leadData.diagnosis_level}
    `.trim();

    const noteResponse = await fetch(
      `https://api.pipedrive.com/v1/notes?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: dealNote,
          deal_id: dealResult.data.id,
        }),
      }
    );

    const noteResult = await noteResponse.json();
    console.log("Note creation result:", noteResult);

    return new Response(
      JSON.stringify({
        success: true,
        deal_id: dealResult.data.id,
        person_id: personId,
        org_id: orgId,
        pipeline_id: pipelineId,
        label_id: labelId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating Pipedrive deal:", errorMessage);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
