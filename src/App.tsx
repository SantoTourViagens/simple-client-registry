
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ClientesForm from "./pages/forms/ClientesForm";
import ViagensForm from "./pages/forms/ViagensForm";
import ViagensEntrada from "./pages/ViagensEntrada";
import PassageirosForm from "./pages/forms/PassageirosForm";
import AdiantamentosForm from "./pages/forms/AdiantamentosForm";
import RelatorioPagina from "./pages/RelatorioPagina";
import PedidoAcesso from "./pages/PedidoAcesso";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";

// Report pages
import RelatoriosIndex from "./pages/reports/RelatoriosIndex";
import ClientesRelatorio from "./pages/reports/ClientesRelatorio";
import ViagensRelatorio from "./pages/reports/ViagensRelatorio";
import PassageirosRelatorio from "./pages/reports/PassageirosRelatorio";
import AdiantamentosRelatorio from "./pages/reports/AdiantamentosRelatorio";
import FinanceiroRelatorio from "./pages/reports/FinanceiroRelatorio";

// Create a new instance of QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// No início do arquivo, adicione a importação
import EditarViagemForm from "./pages/forms/EditarViagemForm";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/form/clientes" element={<ClientesForm />} />
          <Route path="/form/viagens" element={<ViagensEntrada />} />
          <Route path="/form/viagens/cadastrar" element={<ViagensForm />} />
          <Route path="/form/viagens/editar/:id" element={<ViagensForm />} />
          <Route path="/form/viagens/excluir" element={<ViagensForm />} />
          <Route path="/form/passageiros" element={<PassageirosForm />} />
          <Route path="/form/adiantamentos" element={<AdiantamentosForm />} />
          
          {/* Reports routes */}
          <Route path="/relatorios" element={<RelatoriosIndex />} />
          <Route path="/relatorios/clientes" element={<ClientesRelatorio />} />
          <Route path="/relatorios/viagens" element={<ViagensRelatorio />} />
          <Route path="/relatorios/passageiros" element={<PassageirosRelatorio />} />
          <Route path="/relatorios/adiantamentos" element={<AdiantamentosRelatorio />} />
          <Route path="/relatorios/financeiro" element={<FinanceiroRelatorio />} />
          
          <Route path="/acesso" element={<PedidoAcesso />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/form/viagens/editar/:id" element={<EditarViagemForm />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
