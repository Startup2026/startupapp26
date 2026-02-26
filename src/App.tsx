import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import VerifyPendingPage from "./pages/VerifyPendingPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import JobListingsPage from "./pages/student/JobListingsPage";
import JobDetailsPage from "./pages/student/JobDetailsPage";
import ApplicationsPage from "./pages/student/ApplicationsPage";
import NotificationsPage from "./pages/student/NotificationsPage";
import StartupDiscoveryPage from "./pages/student/StartupDiscoveryPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StudentSettingsPage from "./pages/student/StudentSettingsPage";
import CreateStudentProfilePage from "./pages/student/CreateStudentProfilePage";
import StartupFeedPage from "./pages/student/StartupFeedPage";
import StartupProfilePage from "./pages/student/StartupProfilePage";
import StartupDashboard from "./pages/startup/StartupDashboard";
import CreateStartupProfilePage from "./pages/startup/CreateStartupProfilePage";
import SelectPlanPage from "./pages/startup/SelectPlanPage";
import AdminStartupsPage from "./pages/admin/AdminStartupsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminModerationPage from "./pages/admin/AdminModerationPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import StartupJobsPage from "./pages/startup/StartupJobsPage";
import JobApplicationsPage from "./pages/startup/JobApplicationsPage";
import StartupProfile from "./pages/startup/StartupProfile";
import Shortlisted from "./pages/startup/Shortlisted";
import Selected from "./pages/startup/Selected";
import InterviewCalendarPage from "./pages/startup/InterviewCalendarPage";
import JobAnalysisPage from "./pages/startup/JobAnalysisPage";
import AdvancedAnalysisPage from "./pages/startup/AdvancedAnalysisPage";
import StartupSettingsPage from "./pages/startup/StartupSettingsPage";
import SocialMediaAnalysisPage from "./pages/startup/SocialMediaAnalysisPage";
import PostDetailPage from "./pages/startup/PostDetailPage";
import StartupNotificationsPage from "./pages/startup/StartupNotificationsPage";
import TrendingJobsPage from "./pages/student/TrendingJobsPost";
import SavedItemsPage from "./pages/student/SavePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StartupVerificationPage from "./pages/StartupVerificationPage";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SocketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/verify-pending" element={<VerifyPendingPage />} />
            
            {/* Student routes */}
            <Route path="/student/create-profile" element={<CreateStudentProfilePage />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/jobs" element={<JobListingsPage />} />
            <Route path="/student/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/student/startups" element={<StartupDiscoveryPage />} />
            <Route path="/student/startups/:id" element={<StartupProfilePage />} />
            <Route path="/student/applications" element={<ApplicationsPage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/settings" element={<StudentSettingsPage />} />
            <Route path="/student/feed" element={<StartupFeedPage />} />
            <Route path="/student/TrendingJobs" element={<TrendingJobsPage />} />
            <Route path="/student/saved" element={<SavedItemsPage />} />
            {/* Startup routes */}
            <Route path="/startup/create-profile" element={<CreateStartupProfilePage />} />
            <Route path="/startup/select-plan" element={<SelectPlanPage />} />
            <Route path="/startup/dashboard" element={<StartupDashboard />} />
            <Route path="/startup/jobs" element={<StartupJobsPage />} />
            <Route path="/startup/jobs/:jobId/applications" element={<JobApplicationsPage />} />
            <Route path="/startup/analysis" element={<JobAnalysisPage />} />
            <Route path="/startup/advanced-analysis" element={<AdvancedAnalysisPage />} />
            <Route path="/startup/social-media-analysis" element={<SocialMediaAnalysisPage />} />
            <Route path="/startup/posts/:postId" element={<PostDetailPage />} />
            <Route path="/startup/interviews" element={<InterviewCalendarPage />} />
            <Route path="/startup/profile" element={<StartupProfile />} />
            <Route path="/startup/shortlisted" element={<Shortlisted />} />
            <Route path="/startup/selected" element={<Selected />} />
            <Route path="/startup/notifications" element={<StartupNotificationsPage />} />
            <Route path="/startup/settings" element={<StartupSettingsPage />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/startups" element={<AdminStartupsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/moderation" element={<AdminModerationPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

            {/* startup verification route */}
            <Route path="/startup/verification" element={<StartupVerificationPage />} />
            <Route path="/startup/verification-pending" element={<VerifyPendingPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  </QueryClientProvider>
);export default App;
