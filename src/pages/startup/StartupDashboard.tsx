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
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditStartupProfileModal } from "@/components/startup/EditStartupProfileModal";
import { startupProfileService, StartupProfile } from "@/services/startupProfileService";
import { jobService, Job } from "@/services/jobService";
import { applicationService, Application } from "@/services/applicationService";
import { interviewService } from "@/services/interviewService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function StartupDashboard() {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Profile
        const profileResult = await startupProfileService.getMyProfile();
        let currentProfile: StartupProfile | null = null;
        
        if (profileResult.success && profileResult.data) {
          setProfile(profileResult.data);
          currentProfile = profileResult.data;
        } else {
          console.error("Failed to fetch profile:", profileResult.error);
        }

        if (currentProfile) {
          // 2. Fetch Jobs
          const jobsResult = await jobService.getAllJobs();
          let myJobs: Job[] = [];
          if (jobsResult.success && jobsResult.data) {
            // Filter jobs for this startup
            myJobs = jobsResult.data.filter(job => {
                if (typeof job.startupId === 'object' && job.startupId !== null) {
                    return job.startupId._id === currentProfile?._id;
                }
                return job.startupId === currentProfile?._id;
            });
            setJobs(myJobs);
          }

          // 3. Fetch Applications
          const appsResult = await applicationService.getAllApplications();
          if (appsResult.success && appsResult.data) {
             // Filter applications for my jobs
             const myApps = appsResult.data.filter(app => {
                 // Check if the application belongs to one of my jobs
                 // Note: app.jobId might be populated, so we check app.jobId._id or app.jobId
                 const appJobId = typeof app.jobId === 'object' ? app.jobId._id : app.jobId;
                 return myJobs.some(job => job._id === appJobId);
             });
             setApplications(myApps);
          }

          // 4. Fetch Interviews
          const invResult = await interviewService.getAllInterviews();
          if (invResult.success && invResult.data) {
             setInterviews(invResult.data);
          }
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileModalOpen]); 

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

  // Calculate stats
  const activeJobsCount = jobs.length;
  const totalApplicantsCount = applications.length;
  const profileViewsCount = profile?.views || 0; 
  const interviewsCount = interviews.length; 

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
      value: interviews.length.toString(),
      icon: Calendar,
      trend: "Real-time",
      color: "bg-primary/10 text-primary",
    },
  ];

  // Derive recent activity from applications
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Pipeline stats
  const shortlistedCount = applications.filter(a => a.status === 'SHORTLISTED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;
  const hiredCount = applications.filter(a => a.status === 'HIRED' || a.status === 'SELECTED').length;
  // Assuming 'APPLIED' is the default new status
  const appliedCount = applications.length; 

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
                <img src={profile.profilepic} alt={profile.startupName} className="h-full w-full object-cover rounded-2xl" />
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
          </div>
          <div className="flex items-center gap-2">
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
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
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
                            {app.studentId ? getInitials(app.studentId.firstName || app.studentId.firstname) : "NA"}
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                        <p className="font-semibold">
                          {app.studentId 
                            ? `${app.studentId.firstName || app.studentId.firstname || ''} ${app.studentId.lastName || app.studentId.lastname || ''}`.trim() || 'Student'
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
                                const fullUrl = rawUrl.startsWith('http') ? rawUrl : `http://localhost:3000${rawUrl}`;
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
                {jobs.length === 0 ? (
                     <p className="text-muted-foreground text-center py-4">No active jobs posted.</p>
                ) : (
                    jobs.slice(0, 3).map((job) => (
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
                             {/* Calculate applicant count for this specific job */}
                             {applications.filter(a => (typeof a.jobId === 'object' ? a.jobId._id : a.jobId) === job._id).length} applicants
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
               {interviews.length === 0 ? (
                   <p className="text-muted-foreground text-center py-8">
                       No interviews scheduled.
                   </p>
               ) : (
                   interviews.slice(0, 3).map((inv: any) => (
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

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Modal */}
      <EditStartupProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </StartupLayout>
  );
}

