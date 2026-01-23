import { useEffect, useState } from "react";

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

const UTM_STORAGE_KEY = "quiz_utm_params";

export const useUTM = (): UTMParams => {
  const [utmParams, setUtmParams] = useState<UTMParams>(() => {
    // Try to get from sessionStorage first
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore parse errors
      }
    }
    return {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
    };
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const newUtmSource = urlParams.get("utm_source") || "";
    const newUtmMedium = urlParams.get("utm_medium") || "";
    const newUtmCampaign = urlParams.get("utm_campaign") || "";
    const newUtmContent = urlParams.get("utm_content") || "";
    const newUtmTerm = urlParams.get("utm_term") || "";

    // Only update if we have at least one UTM parameter in the URL
    if (newUtmSource || newUtmMedium || newUtmCampaign || newUtmContent || newUtmTerm) {
      const newParams: UTMParams = {
        utm_source: newUtmSource,
        utm_medium: newUtmMedium,
        utm_campaign: newUtmCampaign,
        utm_content: newUtmContent,
        utm_term: newUtmTerm,
      };
      
      setUtmParams(newParams);
      // Store in sessionStorage to persist across navigation
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(newParams));
    }
  }, []);

  return utmParams;
};
