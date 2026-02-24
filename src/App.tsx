import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Obrigado from "./pages/Obrigado";
import VendorQuiz from "./pages/VendorQuiz";
import GenerateLink from "./pages/GenerateLink";
import NotFound from "./pages/NotFound";
import Leads from "./pages/Leads";
import Analytics from "./pages/Analytics";
import { captureUTMsFromURL } from "@/hooks/use-utm";

// Capturar UTMs imediatamente na inicialização do app (antes de qualquer render)
captureUTMsFromURL();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/obrigado-diagnostico" element={<Obrigado />} />
          <Route path="/d/:dealId" element={<VendorQuiz />} />
          <Route path="/link" element={<GenerateLink />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
