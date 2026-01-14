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
          org_id: null,
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

    // Create a lead in Pipedrive
    const leadTitle = `Diagnóstico ISO 9001 - ${leadData.name} (${leadData.company})`;
    const leadNote = `
📊 **Diagnóstico de Maturidade ISO 9001**

👤 **Contato:** ${leadData.name}
🏢 **Empresa:** ${leadData.company}
📧 **Email:** ${leadData.email}
📱 **Telefone:** ${leadData.phone}

📈 **Score:** ${leadData.score}/100
🏷️ **Nível:** ${leadData.diagnosis_level}
    `.trim();

    const leadResponse = await fetch(
      `https://api.pipedrive.com/v1/leads?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: leadTitle,
          person_id: personId,
          organization_id: orgId,
        }),
      }
    );

    const leadResult = await leadResponse.json();
    console.log("Lead creation result:", leadResult);

    if (!leadResult.success) {
      throw new Error(`Failed to create lead: ${JSON.stringify(leadResult)}`);
    }

    // Add a note to the lead
    const noteResponse = await fetch(
      `https://api.pipedrive.com/v1/notes?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: leadNote,
          lead_id: leadResult.data.id,
        }),
      }
    );

    const noteResult = await noteResponse.json();
    console.log("Note creation result:", noteResult);

    return new Response(
      JSON.stringify({
        success: true,
        lead_id: leadResult.data.id,
        person_id: personId,
        org_id: orgId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating Pipedrive lead:", errorMessage);
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
