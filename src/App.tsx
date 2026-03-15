import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { getAuthToken, getStoredUser } from "@/lib/api";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
// ...existing code...
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
import StudentPostDetailPage from "./pages/student/StudentPostDetailPage";
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
import StartupVerificationPage from "./pages/startup/StartupVerificationPage";
// ...existing code...
import SocialMediaAnalysisPage from "./pages/startup/SocialMediaAnalysisPage";
import PostDetailPage from "./pages/startup/PostDetailPage";
import StartupNotificationsPage from "./pages/startup/StartupNotificationsPage";
import TrendingJobsPage from "./pages/student/TrendingJobsPost";
import SavedItemsPage from "./pages/student/SavePage";
import StartupFeedDashboardPage from "./pages/startup/StartupFeedPage";
import StartupTrendingPage from "./pages/startup/StartupTrendingPage";
import StartupSavedPage from "./pages/startup/StartupSavedPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import IncubatorDashboard from "./pages/admin/IncubatorDashboard";
import IncubatorSocialAnalysisPage from "./pages/admin/IncubatorSocialAnalysisPage";
import IncubatorFeedPage from "./pages/admin/IncubatorFeedPage";
import IncubatorTrendingPage from "./pages/admin/IncubatorTrendingPage";
import IncubatorSavedPage from "./pages/admin/IncubatorSavedPage";
import IncubatorPostDetailPage from "./pages/admin/IncubatorPostDetailPage";
import MyPostsAnalyticsPage from "./pages/startup/MyPostsAnalyticsPage";
import CreateIncubatorProfilePage from "./pages/admin/CreateIncubatorProfilePage";
import IncubatorNotificationsPage from "./pages/admin/IncubatorNotificationsPage";
import IncubatorProfilePage from "./pages/admin/IncubatorProfilePage";


const queryClient = new QueryClient();

const getHomeRouteForRole = (role?: string) => {
  if (role === "student") return "/student/dashboard";
  if (role === "startup") return "/startup/dashboard";
  if (role === "incubator_admin") return "/incubator/dashboard";
  if (role === "admin" || role === "platform_admin") return "/admin/dashboard";
  return "/login";
};

const RequireAuth = ({
  children,
  allowedRoles,
  loginPath = "/login",
}: {
  children: JSX.Element;
  allowedRoles?: string[];
  loginPath?: string;
}) => {
  const token = getAuthToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to={loginPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }

  return children;
};

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
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            {/* Removed deleted verification routes */}
            
            {/* Student routes */}
            <Route path="/student/create-profile" element={<RequireAuth allowedRoles={["student"]}><CreateStudentProfilePage /></RequireAuth>} />
            <Route path="/student/dashboard" element={<RequireAuth allowedRoles={["student"]}><StudentDashboard /></RequireAuth>} />
            <Route path="/student/jobs" element={<RequireAuth allowedRoles={["student"]}><JobListingsPage /></RequireAuth>} />
            <Route path="/student/jobs/:id" element={<RequireAuth allowedRoles={["student"]}><JobDetailsPage /></RequireAuth>} />
            <Route path="/student/startups" element={<RequireAuth allowedRoles={["student"]}><StartupDiscoveryPage /></RequireAuth>} />
            <Route path="/student/startups/:id" element={<RequireAuth allowedRoles={["student"]}><StartupProfilePage /></RequireAuth>} />
            <Route path="/student/applications" element={<RequireAuth allowedRoles={["student"]}><ApplicationsPage /></RequireAuth>} />
            <Route path="/student/notifications" element={<RequireAuth allowedRoles={["student"]}><NotificationsPage /></RequireAuth>} />
            <Route path="/student/profile" element={<RequireAuth allowedRoles={["student"]}><StudentProfilePage /></RequireAuth>} />
            <Route path="/student/settings" element={<RequireAuth allowedRoles={["student"]}><StudentSettingsPage /></RequireAuth>} />
            <Route path="/student/feed" element={<RequireAuth allowedRoles={["student"]}><StartupFeedPage /></RequireAuth>} />
            <Route path="/student/TrendingJobs" element={<RequireAuth allowedRoles={["student"]}><TrendingJobsPage /></RequireAuth>} />
            <Route path="/student/saved" element={<RequireAuth allowedRoles={["student"]}><SavedItemsPage /></RequireAuth>} />
            <Route path="/student/posts/:postId" element={<RequireAuth allowedRoles={["student"]}><StudentPostDetailPage /></RequireAuth>} />
            {/* Startup routes */}
          
            <Route path="/startup/verification" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><StartupVerificationPage /></RequireAuth>} />
            <Route path="/startup/create-profile" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><CreateStartupProfilePage /></RequireAuth>} />
            <Route path="/startup/select-plan" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><SelectPlanPage /></RequireAuth>} />
            <Route path="/startup/dashboard" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><StartupDashboard /></RequireAuth>} />
            <Route path="/startup/jobs" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><StartupJobsPage /></RequireAuth>} />
            <Route path="/startup/jobs/:jobId/applications" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><JobApplicationsPage /></RequireAuth>} />
            <Route path="/startup/analysis" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><JobAnalysisPage /></RequireAuth>} />
            <Route path="/startup/advanced-analysis" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><AdvancedAnalysisPage /></RequireAuth>} />
            <Route path="/startup/social-media-analysis" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><SocialMediaAnalysisPage /></RequireAuth>} />
            <Route path="/startup/posts/analytics" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><MyPostsAnalyticsPage /></RequireAuth>} />
            <Route path="/startup/posts/:postId" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><PostDetailPage /></RequireAuth>} />
            <Route path="/startup/interviews" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><InterviewCalendarPage /></RequireAuth>} />
            <Route path="/startup/profile" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><StartupProfile /></RequireAuth>} />
            <Route path="/startup/shortlisted" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><Shortlisted /></RequireAuth>} />
            <Route path="/startup/selected" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><Selected /></RequireAuth>} />
            <Route path="/startup/trending" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><StartupTrendingPage /></RequireAuth>} />
            <Route path="/startup/feed" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><StartupFeedDashboardPage /></RequireAuth>} />
            <Route path="/startup/saved" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><StartupSavedPage /></RequireAuth>} />
            <Route path="/startup/notifications" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><StartupNotificationsPage /></RequireAuth>} />
            <Route path="/startup/settings" element={<RequireAuth allowedRoles={["startup", "startup_admin"]}><StartupSettingsPage /></RequireAuth>} />
            {/* Redirect old verify-pending to the proper email verification message page */}
            <Route path="/verify-pending" element={<VerifyEmailPage />} />
            <Route path="/verify-email-pending" element={<VerifyEmailPage />} />
            {/* Removed deleted verification route */}
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<RequireAuth allowedRoles={["admin", "platform_admin"]} loginPath="/admin/login"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/startups" element={<RequireAuth allowedRoles={["admin", "platform_admin"]} loginPath="/admin/login"><AdminStartupsPage /></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth allowedRoles={["admin", "platform_admin"]} loginPath="/admin/login"><AdminUsersPage /></RequireAuth>} />
            <Route path="/admin/moderation" element={<RequireAuth allowedRoles={["admin", "platform_admin"]} loginPath="/admin/login"><AdminModerationPage /></RequireAuth>} />
            <Route path="/admin/analytics" element={<RequireAuth allowedRoles={["admin", "platform_admin"]} loginPath="/admin/login"><AdminAnalyticsPage /></RequireAuth>} />
            <Route path="/incubator/dashboard" element={<RequireAuth allowedRoles={["incubator_admin"]}><IncubatorDashboard /></RequireAuth>} />
            <Route path="/incubator/trending" element={<RequireAuth allowedRoles={["incubator_admin"]}><IncubatorTrendingPage /></RequireAuth>} />
            <Route path="/incubator/feed" element={<RequireAuth allowedRoles={["incubator_admin"]}><IncubatorFeedPage /></RequireAuth>} />
            <Route path="/incubator/saved" element={<RequireAuth allowedRoles={["incubator_admin"]}><IncubatorSavedPage /></RequireAuth>} />
            <Route path="/incubator/posts/:postId" element={<RequireAuth allowedRoles={["incubator_admin"]}><IncubatorPostDetailPage /></RequireAuth>} />
            <Route path="/incubator/profile" element={<RequireAuth allowedRoles={["incubator_admin"]}><IncubatorProfilePage /></RequireAuth>} />
            <Route path="/incubator/social-analysis" element={<RequireAuth allowedRoles={["incubator_admin"]}><IncubatorSocialAnalysisPage /></RequireAuth>} />
            <Route path="/incubator/create-profile" element={<RequireAuth allowedRoles={["incubator_admin"]}><CreateIncubatorProfilePage /></RequireAuth>} />
            <Route path="/incubator/notifications" element={<RequireAuth allowedRoles={["incubator_admin"]}><IncubatorNotificationsPage /></RequireAuth>} />
            {/* Removed deleted verification routes */}
            
            <Route path="*" element={<NotFound />} />
          </Routes> 
          </BrowserRouter>
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  </QueryClientProvider>
);export default App;
