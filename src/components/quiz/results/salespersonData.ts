// Salesperson data with calendar links, contact info, and photos
export interface SalespersonInfo {
  name: string;
  calendarLink: string;
  whatsapp: string;
  email: string;
  photo: string | null;
  role: string;
}

export const SALESPERSON_DATA: Record<string, SalespersonInfo> = {
  Victor: {
    name: "Victor Augusto",
    calendarLink: "https://calendar.app.google/8yXqdEmwv8vPU5q4A",
    whatsapp: "5519971013822",
    email: "victor.augusto@templum.com.br",
    photo: "/src/assets/victor-photo.png",
    role: "Especialista em ISO 9001",
  },
  Diego: {
    name: "Diego",
    calendarLink: "https://calendar.google.com/calendar/diego-placeholder",
    whatsapp: "",
    email: "",
    photo: null,
    role: "Especialista em ISO 9001",
  },
  Vinicius: {
    name: "Vinicius",
    calendarLink: "https://calendar.google.com/calendar/vinicius-placeholder",
    whatsapp: "",
    email: "",
    photo: null,
    role: "Especialista em ISO 9001",
  },
};

// Map Pipedrive owner names to our salesperson keys
export function getSalespersonKey(ownerName: string | null): string | null {
  if (!ownerName) return null;
  
  const lowerName = ownerName.toLowerCase();
  
  if (lowerName.includes("victor")) return "Victor";
  if (lowerName.includes("diego")) return "Diego";
  if (lowerName.includes("vinicius") || lowerName.includes("vinícius")) return "Vinicius";
  
  return null;
}
