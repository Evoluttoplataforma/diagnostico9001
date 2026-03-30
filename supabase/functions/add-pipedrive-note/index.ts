import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("PIPEDRIVE_API_TOKEN");
    if (!apiToken) {
      throw new Error("PIPEDRIVE_API_TOKEN not configured");
    }

    const { deal_id, content, apply_priority_label } = await req.json();

    if (!deal_id || !content) {
      return new Response(
        JSON.stringify({ success: false, error: "deal_id and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add the note
    const response = await fetch(
      `https://api.pipedrive.com/v1/notes?api_token=${apiToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, deal_id }),
      }
    );

    const result = await response.json();
    console.log("Note added to deal:", deal_id, "success:", result.success);

    // If requested, apply the "Prioridade" label to the deal
    if (apply_priority_label) {
      try {
        // Get deal fields to find the Prioridade label
        const dealFieldsResponse = await fetch(
          `https://api.pipedrive.com/v1/dealFields?api_token=${apiToken}`
        );
        const dealFieldsResult = await dealFieldsResponse.json();

        let priorityLabelId = null;
        if (dealFieldsResult.success && dealFieldsResult.data) {
          const labelField = dealFieldsResult.data.find(
            (f: { key: string }) => f.key === "label"
          );
          if (labelField && labelField.options) {
            const priorityLabel = labelField.options.find(
              (opt: { label: string }) => opt.label.toUpperCase() === "PRIORIDADE"
            );
            if (priorityLabel) {
              priorityLabelId = priorityLabel.id;
            }
          }
        }

        if (priorityLabelId) {
          const updateResponse = await fetch(
            `https://api.pipedrive.com/v1/deals/${deal_id}?api_token=${apiToken}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ label: priorityLabelId }),
            }
          );
          const updateResult = await updateResponse.json();
          console.log("Priority label applied to deal:", deal_id, "success:", updateResult.success);
        } else {
          console.warn("PRIORIDADE label not found in Pipedrive");
        }
      } catch (labelError) {
        console.error("Error applying priority label:", labelError);
        // Don't fail the whole request just because label update failed
      }
    }

    return new Response(
      JSON.stringify({ success: result.success }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding note:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
