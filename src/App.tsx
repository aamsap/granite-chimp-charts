import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HowToUse from "./pages/HowToUse";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import ChimpChart from "./pages/ChimpChart";
import DashboardView from "./pages/DashboardView";
import VisualizationDemo from "./pages/VisualizationDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
                <Route path="/chimp-chart" element={<ChimpChart />} />
                <Route path="/dashboard/:id" element={<DashboardView />} />
          <Route path="/demo" element={<VisualizationDemo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;