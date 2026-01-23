import { useEffect, useState } from "react";

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

const UTM_STORAGE_KEY = "quiz_utm_params";

// Função para capturar UTMs da URL e salvar no storage
export const captureUTMsFromURL = (): UTMParams | null => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const utm_source = urlParams.get("utm_source") || "";
  const utm_medium = urlParams.get("utm_medium") || "";
  const utm_campaign = urlParams.get("utm_campaign") || "";
  const utm_content = urlParams.get("utm_content") || "";
  const utm_term = urlParams.get("utm_term") || "";

  // Se houver pelo menos um UTM na URL, salvar e retornar
  if (utm_source || utm_medium || utm_campaign || utm_content || utm_term) {
    const params: UTMParams = { utm_source, utm_medium, utm_campaign, utm_content, utm_term };
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
    console.log("[UTM] Captured from URL and saved:", params);
    return params;
  }
  return null;
};

// Função para obter UTMs do storage
export const getStoredUTMs = (): UTMParams => {
  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      console.log("[UTM] Retrieved from storage:", parsed);
      return parsed;
    } catch {
      console.log("[UTM] Failed to parse stored UTMs");
    }
  }
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  };
};

export const useUTM = (): UTMParams => {
  const [utmParams, setUtmParams] = useState<UTMParams>(getStoredUTMs);

  useEffect(() => {
    // Tentar capturar da URL (sobrescreve se houver novos)
    const fromURL = captureUTMsFromURL();
    if (fromURL) {
      setUtmParams(fromURL);
    } else {
      // Caso contrário, garantir que temos os valores do storage
      const stored = getStoredUTMs();
      setUtmParams(stored);
    }
  }, []);

  return utmParams;
};
