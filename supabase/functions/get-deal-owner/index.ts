import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { deal_id } = await req.json();
    
    if (!deal_id) {
      throw new Error("deal_id is required");
    }

    console.log("Fetching owner for deal:", deal_id);

    // Get deal details
    const dealResponse = await fetch(
      `https://api.pipedrive.com/v1/deals/${deal_id}?api_token=${apiToken}`
    );
    const dealResult = await dealResponse.json();

    if (!dealResult.success) {
      throw new Error(`Failed to fetch deal: ${JSON.stringify(dealResult)}`);
    }

    // Get deal owner info
    let ownerName: string | null = null;
    let ownerId: number | null = null;

    if (dealResult.data.user_id) {
      ownerId = dealResult.data.user_id.id || dealResult.data.user_id;
      ownerName = dealResult.data.user_id.name || null;

      // If we only have an ID, fetch user details
      if (ownerId && !ownerName) {
        try {
          const userResponse = await fetch(
            `https://api.pipedrive.com/v1/users/${ownerId}?api_token=${apiToken}`
          );
          const userResult = await userResponse.json();
          if (userResult.success && userResult.data) {
            ownerName = userResult.data.name;
          }
        } catch (err) {
          console.error("Failed to fetch user details:", err);
        }
      }
    }

    console.log("Deal owner:", { ownerId, ownerName });

    return new Response(
      JSON.stringify({
        success: true,
        deal_id: deal_id,
        owner_id: ownerId,
        owner_name: ownerName,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching deal owner:", errorMessage);
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
