// v2 - with lost_reason and "Sem negócio" status
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
    if (!apiToken) throw new Error("PIPEDRIVE_API_TOKEN not configured");

    const { emails, password } = await req.json();
    if (password !== "tp3321@") {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
      });
    }

    if (!Array.isArray(emails) || !emails.length) {
      return new Response(JSON.stringify({ success: true, results: {} }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }

    // Fetch pipeline stages mapping
    const pipelinesRes = await fetch(`https://api.pipedrive.com/v1/stages?api_token=${apiToken}`);
    const pipelinesData = await pipelinesRes.json();
    const stageMap: Record<number, string> = {};
    if (pipelinesData.success && pipelinesData.data) {
      for (const stage of pipelinesData.data) {
        stageMap[stage.id] = stage.name;
      }
    }

    const results: Record<string, { status: string; owner: string; stage: string; lost_reason: string } | null> = {};

    // Process each email
    for (const email of emails.slice(0, 10)) {
      try {
        const cleanEmail = String(email).trim().toLowerCase();

        // Try to find person by email using multiple search strategies
        let personId: number | null = null;
        let dealFromSearch: any = null;

        // Strategy 1: Search persons by email field
        try {
          const searchRes = await fetch(
            `https://api.pipedrive.com/v1/persons/search?term=${encodeURIComponent(cleanEmail)}&fields=email&api_token=${apiToken}`
          );
          const searchData = await searchRes.json();
          if (searchData.success && searchData.data?.items?.length) {
            personId = searchData.data.items[0].item.id;
          }
        } catch (e) {
          console.error(`[${cleanEmail}] persons/search error:`, e);
        }

        // Strategy 2: General item search for person
        if (!personId) {
          try {
            const searchRes = await fetch(
              `https://api.pipedrive.com/v1/itemSearch?term=${encodeURIComponent(cleanEmail)}&item_types=person&api_token=${apiToken}`
            );
            const searchData = await searchRes.json();
            if (searchData.success && searchData.data?.items?.length) {
              personId = searchData.data.items[0].item.id;
            }
          } catch (e) {
            console.error(`[${cleanEmail}] itemSearch person error:`, e);
          }
        }

        // Strategy 3: Search deals directly by email term
        if (!personId) {
          try {
            const searchRes = await fetch(
              `https://api.pipedrive.com/v1/itemSearch?term=${encodeURIComponent(cleanEmail)}&item_types=deal&api_token=${apiToken}`
            );
            const searchData = await searchRes.json();
            if (searchData.success && searchData.data?.items?.length) {
              dealFromSearch = searchData.data.items[0].item;
            }
          } catch (e) {
            console.error(`[${cleanEmail}] itemSearch deal error:`, e);
          }
        }

        // If we found a deal directly from search, use it
        if (!personId && dealFromSearch) {
          const dealId = dealFromSearch.id;
          const dealRes = await fetch(
            `https://api.pipedrive.com/v1/deals/${dealId}?api_token=${apiToken}`
          );
          const dealData = await dealRes.json();
          if (dealData.success && dealData.data) {
            const deal = dealData.data;
            const statusMap: Record<string, string> = {
              open: "Aberto", won: "Ganho", lost: "Perdido", deleted: "Excluído",
            };
            let ownerName = "";
            if (deal.user_id) {
              ownerName = typeof deal.user_id === "object" ? deal.user_id.name || "" : "";
              if (!ownerName) {
                const ownerId = typeof deal.user_id === "object" ? deal.user_id.id : deal.user_id;
                try {
                  const userRes = await fetch(`https://api.pipedrive.com/v1/users/${ownerId}?api_token=${apiToken}`);
                  const userData = await userRes.json();
                  if (userData.success) ownerName = userData.data.name || "";
                } catch {}
              }
            }
            const stageName = deal.stage_id ? stageMap[deal.stage_id] || `Etapa ${deal.stage_id}` : "";
            const lostReason = deal.lost_reason || "";
            results[cleanEmail] = {
              status: statusMap[deal.status] || deal.status || "",
              owner: ownerName,
              stage: stageName,
              lost_reason: lostReason,
            };
            continue;
          }
        }

        // Person found but possibly no deals
        if (personId) {
          // Get deals for this person (include all statuses)
          const dealsRes = await fetch(
            `https://api.pipedrive.com/v1/persons/${personId}/deals?api_token=${apiToken}&status=all_not_deleted`
          );
          const dealsData = await dealsRes.json();

          if (!dealsData.success || !dealsData.data?.length) {
            // Person exists in Pipedrive but has no deals
            results[cleanEmail] = {
              status: "Sem negócio",
              owner: "",
              stage: "",
              lost_reason: "",
            };
            continue;
          }

          // Get most recent deal
          const deals = dealsData.data.sort((a: any, b: any) =>
            new Date(b.add_time).getTime() - new Date(a.add_time).getTime()
          );
          const deal = deals[0];

          const statusMap: Record<string, string> = {
            open: "Aberto",
            won: "Ganho",
            lost: "Perdido",
            deleted: "Excluído",
          };

          // Owner name
          let ownerName = "";
          if (deal.user_id) {
            ownerName = typeof deal.user_id === "object" ? deal.user_id.name || "" : "";
            if (!ownerName && deal.user_id) {
              const ownerId = typeof deal.user_id === "object" ? deal.user_id.id : deal.user_id;
              try {
                const userRes = await fetch(`https://api.pipedrive.com/v1/users/${ownerId}?api_token=${apiToken}`);
                const userData = await userRes.json();
                if (userData.success) ownerName = userData.data.name || "";
              } catch {}
            }
          }

          const stageName = deal.stage_id ? stageMap[deal.stage_id] || `Etapa ${deal.stage_id}` : "";
          const lostReason = deal.lost_reason || "";

          results[cleanEmail] = {
            status: statusMap[deal.status] || deal.status || "",
            owner: ownerName,
            stage: stageName,
            lost_reason: lostReason,
          };
        } else {
          // Not found in Pipedrive at all
          results[cleanEmail] = null;
        }
      } catch (err) {
        console.error(`Error processing ${email}:`, err);
        results[String(email).trim().toLowerCase()] = null;
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});
