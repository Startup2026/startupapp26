import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import JobListingsPage from "./pages/student/JobListingsPage";
import JobDetailsPage from "./pages/student/JobDetailsPage";
import ApplicationsPage from "./pages/student/ApplicationsPage";
import StartupDiscoveryPage from "./pages/student/StartupDiscoveryPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StartupFeedPage from "./pages/student/StartupFeedPage";
import StartupDashboard from "./pages/startup/StartupDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Student routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/jobs" element={<JobListingsPage />} />
          <Route path="/student/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/student/startups" element={<StartupDiscoveryPage />} />
          <Route path="/student/applications" element={<ApplicationsPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/feed" element={<StartupFeedPage />} />
          
          {/* Startup routes */}
          <Route path="/startup/dashboard" element={<StartupDashboard />} />
          <Route path="/startup/jobs" element={<StartupDashboard />} />
          <Route path="/startup/jobs/create" element={<StartupDashboard />} />
          <Route path="/startup/applicants" element={<StartupDashboard />} />
          <Route path="/startup/updates" element={<StartupDashboard />} />
          <Route path="/startup/profile" element={<StartupDashboard />} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/startups" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/moderation" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
