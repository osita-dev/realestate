import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Find from "./pages/Find";
import Requirements from "./pages/Requirements";
import Results from "./pages/Results";
import Compare from "./pages/Compare";
import PropertyDetail from "./pages/PropertyDetail";
import Search from "./pages/Search";
import Saved from "./pages/Saved";
import Build from "./pages/Build";
import BuildSpec from "./pages/BuildSpec";
import AgentLogin from "./pages/AgentLogin";
import Dashboard from "./pages/Dashboard";
import AddListing from "./pages/AddListing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/find" element={<Find />} />
          <Route path="/find/requirements" element={<Requirements />} />
          <Route path="/find/results" element={<Results />} />
          <Route path="/find/compare" element={<Compare />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/build" element={<Build />} />
          <Route path="/build/spec" element={<BuildSpec />} />
          <Route path="/agent-login" element={<AgentLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/add" element={<AddListing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;