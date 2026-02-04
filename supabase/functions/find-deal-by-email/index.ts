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

    const { email } = await req.json();
    
    if (!email || typeof email !== "string") {
      throw new Error("Email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error("Invalid email format");
    }

    const cleanEmail = email.trim().toLowerCase();
    console.log("Searching for deals with email:", cleanEmail);

    // Search for person by email
    const searchResponse = await fetch(
      `https://api.pipedrive.com/v1/persons/search?term=${encodeURIComponent(cleanEmail)}&fields=email&api_token=${apiToken}`
    );
    const searchResult = await searchResponse.json();

    if (!searchResult.success || !searchResult.data?.items?.length) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nenhum lead encontrado com este email no Pipedrive.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get the person ID from search results
    const personId = searchResult.data.items[0].item.id;
    const personName = searchResult.data.items[0].item.name;
    console.log("Found person:", personId, personName);

    // Get deals associated with this person
    const dealsResponse = await fetch(
      `https://api.pipedrive.com/v1/persons/${personId}/deals?api_token=${apiToken}`
    );
    const dealsResult = await dealsResponse.json();

    if (!dealsResult.success || !dealsResult.data?.length) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Lead encontrado, mas não possui deals associados no Pipedrive.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Return the most recent deal (or all deals)
    const deals = dealsResult.data.map((deal: {
      id: number;
      title: string;
      status: string;
      org_name?: string;
      add_time: string;
    }) => ({
      id: deal.id,
      title: deal.title,
      status: deal.status,
      org_name: deal.org_name || "",
      add_time: deal.add_time,
    }));

    // Sort by add_time descending (most recent first)
    deals.sort((a: { add_time: string }, b: { add_time: string }) => 
      new Date(b.add_time).getTime() - new Date(a.add_time).getTime()
    );

    return new Response(
      JSON.stringify({
        success: true,
        person_name: personName,
        deals: deals,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error finding deal:", errorMessage);
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
