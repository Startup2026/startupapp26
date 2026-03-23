import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsDashboard } from "@/components/startup/AnalyticsDashboard";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  UserCheck,
  Loader2,
  FileText,
  BarChart3
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditStartupProfileModal } from "@/components/startup/EditStartupProfileModal";
import { CreatePostModal } from "@/components/startup/CreatePostModal";
import { startupProfileService, StartupProfile } from "@/services/startupProfileService";
import { jobService, Job } from "@/services/jobService";
import { applicationService, Application } from "@/services/applicationService";
import { interviewService } from "@/services/interviewService";
import { feedService, Post as FeedPost } from "@/services/feedService";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL, apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { UpgradeModal } from "@/components/UpgradeModal";
import { formatDistanceToNow } from "date-fns";
import { resolveMediaUrl } from "@/lib/media";
import { DashboardToggle } from "@/components/startup/DashboardToggle";

interface DashboardRecommendationPost {
  _id: string;
  title?: string;
  description?: string;
  startupid?: {
    startupName?: string;
  };
}

interface DashboardTrendingJob {
  _id: string;
  role: string;
  startup?: {
    startupName?: string;
  };
  location?: string;
  jobType?: string;
}

export default function StartupDashboard() {
  const { 
    hasAccess, 
    isUpgradeModalOpen, 
    closeUpgradeModal, 
    triggeredFeature, 
    loading: planLoading
  } = usePlanAccess();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [myPosts, setMyPosts] = useState<FeedPost[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<DashboardRecommendationPost[]>([]);
  const [trendingJobs, setTrendingJobs] = useState<DashboardTrendingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      if (planLoading) return;
      try {
        const recommendationUserId = user?._id
        const [
          profileResult,
          jobsResult,
          applicationsResult,
          interviewsResult,
          myPostsResult,
          recommendedPostsResult,
          trendingJobsResult,
        ] = await Promise.all([
          startupProfileService.getMyProfile(),
          jobService.getAllJobs(),
          applicationService.getAllApplications(),
          interviewService.getAllInterviews(),
          feedService.getMyPosts("latest"),
          apiFetch(
            recommendationUserId
              ? `/recommendations/posts/${recommendationUserId}?limit=3&page=1`
              : "/recommendations/cold-start/posts?limit=3&page=1"
          ),
          apiFetch(`/recommendations/trending/jobs?limit=3&page=1${recommendationUserId ? `&userId=${recommendationUserId}` : ""}`),
        ]);

        let currentProfile: StartupProfile | null = null;
        if (profileResult.success && profileResult.data) {
          setProfile(profileResult.data);
          currentProfile = profileResult.data;
        } else {
          console.error("Failed to fetch profile:", profileResult.error);
        }

        if (jobsResult?.success) {
          setJobs(Array.isArray(jobsResult.data) ? jobsResult.data : []);
        } else {
          setJobs([]);
          console.error("Failed to fetch jobs:", jobsResult?.error);
        }

        if (applicationsResult?.success) {
          setApplications(Array.isArray(applicationsResult.data) ? applicationsResult.data : []);
        } else {
          setApplications([]);
          console.error("Failed to fetch applications:", applicationsResult?.error);
        }

        if (interviewsResult?.success) {
          setInterviews(Array.isArray(interviewsResult.data) ? interviewsResult.data : []);
        } else {
          setInterviews([]);
          console.error("Failed to fetch interviews:", interviewsResult?.error);
        }

        if (myPostsResult.success && myPostsResult.data) {
          setMyPosts(myPostsResult.data);
        } else {
          setMyPosts([]);
          console.error("Failed to fetch posts:", myPostsResult.error);
        }

        if (recommendedPostsResult.success && Array.isArray(recommendedPostsResult.data)) {
          setRecommendedPosts(recommendedPostsResult.data.slice(0, 3));
        } else {
          setRecommendedPosts([]);
        }

        if (trendingJobsResult.success && Array.isArray(trendingJobsResult.data)) {
          setTrendingJobs(trendingJobsResult.data.slice(0, 3));
        } else {
          setTrendingJobs([]);
        }

        // Profile already exists at this point; layout handles onboarding redirects when needed.
        if (currentProfile) {
          // ...existing code...
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profileModalOpen, planLoading, hasAccess, navigate]);

  const getInitials = (name?: string | null) => {
    if (!name || typeof name !== "string") {
      return "NA";
    }

    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getEntityId = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return value._id?.toString?.() || "";
    }
    return "";
  };

  const startupProfileId = getEntityId(profile?._id);
  const startupJobs = jobs.filter((job) => getEntityId((job as any).startupId) === startupProfileId);
  const startupJobIds = new Set(startupJobs.map((job) => getEntityId(job._id)));
  const startupApplications = applications.filter((app) => {
    const jobId = getEntityId((app as any).jobId);
    return startupJobIds.has(jobId);
  });
  const startupInterviews = interviews.filter((inv: any) => {
    const interviewJobId = getEntityId(inv?.applicationId?.jobId);
    return startupJobIds.has(interviewJobId);
  });

  // Calculate stats
  const activeJobsCount = startupJobs.length;
  const totalApplicantsCount = startupApplications.length;
  const profileViewsCount = profile?.views || 0; 
  const interviewsCount = startupInterviews.length; 

  const stats = [
    {
      label: "Active Jobs",
      value: activeJobsCount.toString(),
      icon: Briefcase,
      trend: "Real-time", // Removed dummy trend
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Total Applicants",
      value: totalApplicantsCount.toString(),
      icon: Users,
      trend: "Real-time", // Removed dummy trend
      color: "bg-success/10 text-success",
    },
    {
      label: "Profile Views",
      value: profileViewsCount.toString(),
      icon: Eye,
      trend: "Coming Soon",
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Interviews Scheduled",
      value: startupInterviews.length.toString(),
      icon: Calendar,
      trend: "Real-time",
      color: "bg-primary/10 text-primary",
    },
  ];

  // Derive recent activity from applications
  const recentApps = [...startupApplications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Pipeline stats
  const shortlistedCount = startupApplications.filter(a => a.status === 'SHORTLISTED').length;
  const rejectedCount = startupApplications.filter(a => a.status === 'REJECTED').length;
  const hiredCount = startupApplications.filter(a => a.status === 'HIRED').length;
  // Assuming 'APPLIED' is the default new status
  const appliedCount = startupApplications.length; 

  if (loading) {
      return (
          <StartupLayout>
              <div className="flex bg-background h-[calc(100vh-4rem)] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
          </StartupLayout>
      )
  }

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center font-bold text-accent text-2xl cursor-pointer hover:bg-accent/20 transition-colors"
              onClick={() => setProfileModalOpen(true)}
            >
             {profile?.profilepic ? (
                <img src={resolveMediaUrl(BASE_URL, profile.profilepic)} alt={profile.startupName} className="h-full w-full object-cover rounded-2xl" />
              ) : (
                profile ? getInitials(profile.startupName) : "..."
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {profile ? profile.startupName : "Complete Profile"}
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's your hiring overview.
              </p>
            </div>
             {profile && (
              <DashboardToggle
                initialDashboard={profile.dashboardType || 'hiring'}
                hasRecruiterPlan={profile.hasRecruiterPlan || false}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPostModalOpen(true)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Post Update
            </Button>
            <Button
              variant="outline"
              onClick={() => setProfileModalOpen(true)}
              className="gap-2"
            >
              <Building className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="analytics">Hiring Summary</TabsTrigger>
          </TabsList>


          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      {stat.trend}
                    </div>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Recent Applications
                </CardTitle>
                <Link to="/startup/jobs">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentApps.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No applications yet.</p>
                ) : (
                    recentApps.map((app) => (
                    <div
                        key={app._id}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                    >
                        <Avatar className="h-12 w-12">
                        {/* Use student profile pic if available, else fallback */}
                        <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                            {app.studentId ? getInitials(app.studentId.firstname) : "NA"}
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                        <p className="font-semibold">
                          {app.studentId 
                            ? `${app.studentId.firstname || ''} ${app.studentId.lastname || ''}`.trim() || 'Student'
                            : "Unknown Student"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {typeof app.jobId === 'object' ? app.jobId.role : 'Job Application'}
                        </p>
                        </div>
                        <Badge
                        variant={
                            app.status === "APPLIED"
                            ? "accent"
                            : app.status === "SHORTLISTED"
                                ? "success"
                                : "muted"
                        }
                        >
                        {app.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground hidden md:block">
                        {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            // Fallback logic: Application Resume -> Student Profile Resume
                            // Also handle if studentId is not populated or null
                            const student = app.studentId as any; 
                            const rawUrl = app.resumeUrl || student?.resumeUrl;
                            
                            if (rawUrl) {
                              const fullUrl = resolveMediaUrl(BASE_URL, rawUrl);
                                window.open(fullUrl, '_blank'); 
                            } else {
                                toast({
                                    title: "Unavailable",
                                    description: "No resume found for this application.",
                                    variant: "destructive"
                                })
                            }
                          }}
                          title="View Resume"
                        >
                            <FileText className="h-4 w-4" />
                        </Button>
                    </div>
                    ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Jobs */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-accent" />
                  Active Jobs
                </CardTitle>
                <Link to="/startup/jobs">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Manage <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {startupJobs.length === 0 ? (
                     <p className="text-muted-foreground text-center py-4">No active jobs posted.</p>
                ) : (
                  startupJobs.slice(0, 3).map((job) => (
                    <Link
                        key={job._id}
                        to={`/startup/jobs/${job._id}/applications`}
                        className="block p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{job.role}</h4>
                        <Badge variant="success">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                           {startupApplications.filter((a) => getEntityId((a as any).jobId) === getEntityId(job._id)).length} applicants
                        </span>
                        <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                        </div>
                    </Link>
                    ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Recommended Feed
              </CardTitle>
              <Link to="/startup/feed">
                <Button variant="ghost" size="sm" className="gap-1">
                  View feed <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recommended posts right now.</p>
              ) : (
                recommendedPosts.map((post) => (
                  <div key={post._id} className="rounded-lg border border-border p-3">
                    <p className="font-medium line-clamp-1">{post.title || "Startup Update"}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {post.description || "New update from the startup community."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {post.startupid?.startupName || "Startup"}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                Trending Jobs
              </CardTitle>
              <Link to="/startup/trending">
                <Button variant="ghost" size="sm" className="gap-1">
                  View trending <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No trending jobs available right now.</p>
              ) : (
                trendingJobs.map((job) => (
                  <div key={job._id} className="rounded-lg border border-border p-3">
                    <p className="font-medium line-clamp-1">{job.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {job.startup?.startupName || "Startup"} • {job.location || "Remote"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{job.jobType || "Role"}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Interviews & Pipeline Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Interviews - Placeholder until interviews module is real */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                 {startupInterviews.length === 0 ? (
                   <p className="text-muted-foreground text-center py-8">
                       No interviews scheduled.
                   </p>
               ) : (
                   startupInterviews.slice(0, 3).map((inv: any) => (
                       <div key={inv._id} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                           <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                                {new Date(inv.interviewDate).getDate()}
                           </div>
                           <div className="flex-1">
                               <p className="font-semibold text-sm">
                                   {inv.applicationId?.studentId?.firstName || "Candidate"} - {inv.applicationId?.jobId?.role || "Role"}
                               </p>
                               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                   <Clock className="h-3 w-3" />
                                   {inv.interviewTime} ({inv.mode})
                               </div>
                           </div>
                           <Badge variant="outline">{inv.status}</Badge>
                       </div>
                   ))
               )}
            </CardContent>
          </Card>

          {/* Pipeline Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-accent" />
                Hiring Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Users className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <span className="font-medium">Applied</span>
                  </div>
                  <span className="text-2xl font-bold">{appliedCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-medium">Shortlisted</span>
                  </div>
                  <span className="text-2xl font-bold text-accent">{shortlistedCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-warning" />
                    </div>
                    <span className="font-medium">Interview</span>
                  </div>
                  <span className="text-2xl font-bold text-warning">{interviewsCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-success" />
                    </div>
                    <span className="font-medium">Selected</span>
                  </div>
                  <span className="text-2xl font-bold text-success">{hiredCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          </TabsContent>

          <TabsContent value="posts" className="space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  My Posts
                </CardTitle>
                <Button variant="outline" onClick={() => setPostModalOpen(true)}>
                  Create New Post
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {myPosts.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No posts yet</h3>
                    <p>Share your updates with the community!</p>
                  </div>
                ) : (
                  myPosts.map((post) => (
                    <div key={post._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col bg-card">
                      {/* Media preview (video first, then image) */}
                      {post.media?.video ? (
                        <div className="w-full h-40 sm:h-36 lg:h-40 bg-muted relative">
                          <video
                            src={`${BASE_URL}${post.media.video}`}
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                            playsInline
                          >
                            Your browser does not support video playback.
                          </video>
                        </div>
                      ) : post.media?.photo ? (
                        <div className="w-full h-40 sm:h-36 lg:h-40 bg-muted relative group">
                          <img
                            src={`${BASE_URL}${post.media.photo}`}
                            alt={post.title || "Post image"}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Unavailable';
                            }}
                          />
                        </div>
                      ) : null}
                      
                      <div className="p-3 sm:p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-1.5">
                          <Badge variant="outline" className="text-xs">
                             {/* Since 'type' might be buried in the post model or inferred, just show Update */}
                             Update
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                        </div>

                        <h3 className="font-bold text-base sm:text-lg mb-1.5 line-clamp-1">{post.title || "Untitled"}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {post.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
                          <div className="flex items-center gap-2.5 sm:gap-3">
                             <span className="flex items-center gap-1">
                               <Eye className="h-3 w-3" /> {post.analytics?.views_count || 0}
                             </span>
                             <span className="flex items-center gap-1">
                               <Users className="h-3 w-3" /> {post.analytics?.likes_count || 0}
                             </span>
                             <span className="flex items-center gap-1">
                               <FileText className="h-3 w-3" /> {post.analytics?.comments_count || 0}
                             </span>
                          </div>
                          {/* Could add Edit/Delete here later */}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            {hasAccess("analytics") ? (
              <AnalyticsDashboard />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 border rounded-xl bg-muted/30">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Analytics Restricted</h3>
                 <p className="text-muted-foreground mb-6 max-w-md text-center">
                   Analytics unlocks on the Sprint, Builder, and Partner plans.
                 </p>
                <Link to="/startup/select-plan">
                  <Button>Upgrade Plan</Button>
                </Link>
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        featureName={triggeredFeature || "Analysis"}
      />

      {/* Profile Modal */}
      <EditStartupProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
      
      {/* Create Post Modal */}
      <CreatePostModal
        open={postModalOpen}
        onOpenChange={setPostModalOpen}
      />
    </StartupLayout>
  );
}

