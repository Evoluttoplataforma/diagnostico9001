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

    console.log("Fetching deal:", deal_id);

    // Get deal details
    const dealResponse = await fetch(
      `https://api.pipedrive.com/v1/deals/${deal_id}?api_token=${apiToken}`
    );
    const dealResult = await dealResponse.json();

    if (!dealResult.success) {
      throw new Error(`Deal not found: ${deal_id}`);
    }

    const deal = dealResult.data;
    console.log("Deal found:", deal.title);

    // Get person details if available
    let personData = null;
    if (deal.person_id) {
      const personId = typeof deal.person_id === 'object' ? deal.person_id.value : deal.person_id;
      const personResponse = await fetch(
        `https://api.pipedrive.com/v1/persons/${personId}?api_token=${apiToken}`
      );
      const personResult = await personResponse.json();
      if (personResult.success) {
        personData = personResult.data;
      }
    }

    // Get organization details if available
    let orgData = null;
    if (deal.org_id) {
      const orgId = typeof deal.org_id === 'object' ? deal.org_id.value : deal.org_id;
      const orgResponse = await fetch(
        `https://api.pipedrive.com/v1/organizations/${orgId}?api_token=${apiToken}`
      );
      const orgResult = await orgResponse.json();
      if (orgResult.success) {
        orgData = orgResult.data;
      }
    }

    // Extract email and phone from person
    const email = personData?.email?.[0]?.value || "";
    const phone = personData?.phone?.[0]?.value || "";
    const name = personData?.name || "";
    const jobTitle = personData?.job_title || "";
    const company = orgData?.name || deal.org_name || "";

    // Get company size from organization custom field
    const orgCompanySizeFieldKey = "07a8ced33cfb9c1c11441fb7957adedaa7212676";
    const companySize = orgData?.[orgCompanySizeFieldKey] || "";

    // Get deal owner info
    let ownerName = null;
    if (deal.user_id) {
      const ownerId = typeof deal.user_id === 'object' ? deal.user_id.id : deal.user_id;
      const ownerNameFromDeal = typeof deal.user_id === 'object' ? deal.user_id.name : null;
      
      if (ownerNameFromDeal) {
        ownerName = ownerNameFromDeal;
      } else {
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

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          deal_id: deal.id,
          deal_title: deal.title,
          name,
          email,
          phone,
          job_title: jobTitle,
          company,
          company_size: companySize,
          owner_name: ownerName,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching Pipedrive deal:", errorMessage);
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
