import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  MapPin,
  DollarSign,
  ChevronRight,
  Loader2,
  XCircle,
  Settings,
  LogOut,
  Flag,
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiFetch, getStoredUser, API_BASE_URL } from "@/lib/api";
import { studentProfileService } from "@/services/studentProfileService";
import { calculateProfileCompletion } from "@/lib/utils";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { resolveMediaUrl } from "@/lib/media";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StartupUpdate {
  _id: string;
  startupId: string; 
  companyName: string;
  title: string;
  content: string;
  date: string;
}

interface TrendingJob {
  _id: string;
  role: string;
  location: string;
  jobType: string;
  stipend: boolean;
  salary: string | null;
  startup: {
    _id: string;
    startupName: string;
  };
}

interface JobReport {
  _id: string;
  reason: string;
  status: "open" | "kept" | "removed";
  createdAt: string;
  jobId?: {
    _id?: string;
    role?: string;
    startupId?: {
      startupName?: string;
    };
  };
}

export default function StudentDashboard() {
  const [startups, setStartups] = useState<any[]>([]);
  const [updates, setUpdates] = useState<StartupUpdate[]>([]);
  const [trendingJobs, setTrendingJobs] = useState<TrendingJob[]>([]);
  const [myReportedJobs, setMyReportedJobs] = useState<JobReport[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    pending: 0,
    rejected: 0
  });
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedJobForReport, setSelectedJobForReport] = useState<TrendingJob | null>(null);
  const [reportReason, setReportReason] = useState("Spam");
  const [reportDetails, setReportDetails] = useState("");
  const user = getStoredUser();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { logout } = useAuth();
  const { toast } = useToast();
  const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateStats = (apps: any[]) => {
    setStats({
      total: apps.length,
      shortlisted: apps.filter((a: any) => {
        const isVisible = a.statusVisible || a.isNotified || a.status === "APPLIED";
        return isVisible && ["SHORTLISTED", "INTERVIEW_SCHEDULED", "SELECTED", "HIRED"].includes(a.status);
      }).length,
      pending: apps.filter((a: any) => {
        // If status is not visible, it counts as pending/applied
        const isVisible = a.statusVisible || a.isNotified || a.status === "APPLIED";
        return !isVisible || a.status === "APPLIED" || !a.status;
      }).length,
      rejected: apps.filter((a: any) => {
        const isVisible = a.statusVisible || a.isNotified || a.status === "APPLIED";
        return isVisible && a.status === "REJECTED";
      }).length
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (data: { applicationId: string, status: string, jobRole?: string, company?: string, isNotified?: boolean, statusVisible?: boolean }) => {
      // Only show update if notified or visible
      if (!data.isNotified && !data.statusVisible && data.status !== "APPLIED") {
        return; 
      }

      setApplications(prev => {
        const updated = prev.map(app => (app._id === data.applicationId ? { ...app, status: data.status, isNotified: data.isNotified, statusVisible: data.statusVisible } : app));
        // We only have the first 3 in state, but status updates could affect stats
        // So we might need to refresh stats or have all apps in a hidden state
        updateStats(updated); // Update stats directly with new data locally to reflect immediately if visible
        return updated;
      });

      // Show toast
      toast({
        title: "Status Update",
        description: `Your application for ${data.jobRole || 'a role'} at ${data.company || 'a company'} is now ${data.status.toLowerCase()}.`,
      });
      
      // OPTIONAL: Re-fetch dashboard data to ensure stats are 100% accurate if many things changed
      fetchDashboardData();
    };

    socket.on("applicationStatusUpdated", handleStatusUpdate);
    return () => { socket.off("applicationStatusUpdated", handleStatusUpdate); };
  }, [socket, toast]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [startupRes, trendingRes, profileRes, applicationsRes, reportsRes] = await Promise.all([
        apiFetch("/startupProfiles"),
        apiFetch(user?._id ? `/recommendations/trending/jobs?userId=${user._id}&limit=3&page=1` : `/recommendations/cold-start?type=trending-jobs&limit=3`),
        studentProfileService.getMyProfile(),
        user?._id ? apiFetch(`/applications/student/${user._id}`) : Promise.resolve({ success: false }),
        apiFetch("/reports/jobs/me")
      ]);
      
      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
        setCompletion(calculateProfileCompletion(profileRes.data));
      }

      if (applicationsRes.success && Array.isArray(applicationsRes.data)) {
        const apps = applicationsRes.data;
        setApplications(apps.slice(0, 3));
        updateStats(apps);
      }

      if (startupRes.success && Array.isArray(startupRes.data)) {
        const allProfiles = startupRes.data;
        setStartups(allProfiles.slice(0, 3));

        const extractedUpdates: StartupUpdate[] = [];
        allProfiles.forEach((profile: any) => {
          if (profile.updates && profile.updates.length > 0) {
            profile.updates.forEach((upd: any) => {
              extractedUpdates.push({
                _id: upd._id,
                startupId: profile._id, 
                companyName: profile.startupName,
                title: upd.title,
                content: upd.content,
                date: upd.date || profile.updatedAt
              });
            });
          }
        });

        setUpdates(extractedUpdates.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ).slice(0, 5));
      }

      if (trendingRes.success && Array.isArray(trendingRes.data)) {
        setTrendingJobs(trendingRes.data.slice(0, 3));
      }

      if (reportsRes.success && Array.isArray(reportsRes.data)) {
        setMyReportedJobs(reportsRes.data.slice(0, 5));
      }

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?._id]);

  const openReportDialog = (job: TrendingJob, event: any) => {
    event.stopPropagation();
    setSelectedJobForReport(job);
    setReportReason("Spam");
    setReportDetails("");
    setReportDialogOpen(true);
  };

  const handleReportSubmit = async () => {
    if (!selectedJobForReport?._id) return;

    setSubmittingReport(true);
    try {
      const response = await apiFetch(`/reports/jobs/${selectedJobForReport._id}`, {
        method: "POST",
        body: JSON.stringify({ reason: reportReason, details: reportDetails.trim() }),
      });

      if (!response.success) {
        toast({
          title: "Unable to submit report",
          description: response.error || "Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Report submitted",
        description: "The moderation team will review this job.",
      });
      setReportDialogOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to report job:", error);
      toast({
        title: "Unable to submit report",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReport(false);
    }
  };

  const reportStatusVariant = (status: JobReport["status"]) => {
    if (status === "removed") return "success" as const;
    if (status === "kept") return "secondary" as const;
    return "warning" as const;
  };

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 84600) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile?.firstName || user?.username || 'Student'}! 👋</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening in the startup world today.
            </p>
          </div>
          <Link to="/student/jobs">
            <Button variant="hero" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Profile completion card - linked to user profileCompleted state */}
        <Card variant="gradient" className="border-accent/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="font-semibold">Complete your profile</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  A complete profile increases your chances of getting hired by 3x
                </p>
                <Progress value={completion} className="h-2" />
                <span className="text-sm text-muted-foreground mt-2 block">
                  {completion}% complete
                </span>
              </div>
              <Link to="/student/profile">
                <Button variant="accent" className="gap-2">
                  Complete Profile
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated" className="cursor-pointer" onClick={() => navigate('/student/applications')}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Jobs Applied</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="cursor-pointer" onClick={() => navigate('/student/applications')}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{stats.shortlisted}</p>
                <p className="text-sm text-muted-foreground">Shortlisted</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="cursor-pointer" onClick={() => navigate('/student/applications')}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="cursor-pointer" onClick={() => navigate('/student/applications')}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Startups Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Recent Applications</h2>
              <Link to="/student/applications" className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent" /></div>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <Card 
                    key={app._id} 
                    variant="interactive"
                    onClick={() => navigate('/student/applications')}
                    className="cursor-pointer"
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent shrink-0">
                        {app.jobId?.startupId?.profilepic ? (
                          <img src={resolveMediaUrl(BASE_URL, app.jobId.startupId.profilepic)} className="rounded-lg w-full h-full object-cover" />
                        ) : (
                          <Building2 className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{app.jobId?.role || "Position"}</h3>
                        <p className="text-xs text-muted-foreground truncate">{app.jobId?.startupId?.startupName || "Startup"}</p>
                      </div>
                      <Badge 
                        variant={
                          app.status === "SHORTLISTED" || app.status === "SELECTED" ? "success" : 
                          app.status === "REJECTED" ? "destructive" : 
                          app.status === "INTERVIEW_SCHEDULED" ? "warning" :
                          "secondary"
                        }
                        className="text-[10px] capitalize"
                      >
                        {(app.status || "APPLIED").toLowerCase().replace('_', ' ')}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card variant="outline" className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground text-sm mb-4">You haven't applied to any jobs yet.</p>
                    <Link to="/student/jobs">
                      <Button variant="outline" size="sm">Start Applying</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <h2 className="text-xl font-semibold">Featured Startups</h2>
              <Link to="/student/startups" className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                <div className="flex justify-center col-span-3 p-8"><Loader2 className="animate-spin text-accent" /></div>
              ) : startups.map((startup) => (
                <Card 
                  key={startup._id} 
                  variant="interactive"
                  onClick={() => navigate(`/student/startups/${startup._id}`)} // Navigate to individual startup profile
                  className="cursor-pointer"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent uppercase">
                        {startup.profilepic ? <img src={resolveMediaUrl(BASE_URL, startup.profilepic)} className="rounded-xl w-full h-full object-cover" /> : startup.startupName.substring(0,2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{startup.startupName}</h3>
                        <Badge variant="accent" className="text-[10px]">{startup.industry}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {startup.tagline || startup.aboutus}
                    </p>
                    <div className="flex items-center text-sm text-accent font-medium">
                      <MapPin className="h-4 w-4 mr-1" />
                      {startup.location?.city || "Remote"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Updates & Quick Actions */}
          <div className="space-y-6">
            {/* Startup Updates Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Startup Updates</h2>
              <Card>
                <CardContent className="p-4 space-y-4">
                  {loading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                  ) : updates.length > 0 ? (
                    updates.map((update) => (
                      <div 
                        key={update._id} 
                        onClick={() => navigate(`/student/startups/${update.startupId}`)} // Clicking update takes you to the company profile
                        className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{update.companyName}</p>
                          <p className="text-xs font-bold text-accent">{update.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{update.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(update.date)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground text-sm p-4">No recent updates.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 hover:bg-accent/5"
                    onClick={() => navigate("/student/profile")}
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Account Settings</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-destructive hover:bg-destructive/5 hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sign out</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Reported Jobs</h2>
              <Card>
                <CardContent className="p-4 space-y-3">
                  {loading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                  ) : myReportedJobs.length > 0 ? (
                    myReportedJobs.map((report) => (
                      <div key={report._id} className="p-3 rounded-lg border border-border">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-medium truncate">{report.jobId?.role || "Job"}</p>
                          <Badge variant={reportStatusVariant(report.status)} className="capitalize">{report.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{report.jobId?.startupId?.startupName || "Startup"}</p>
                        <p className="text-xs text-muted-foreground mt-1">Reason: {report.reason}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground text-sm p-2">No reported jobs yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Trending Jobs Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Trending Jobs</h2>
            <Link to="/student/TrendingJobs" className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1"> 
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <div className="flex justify-center col-span-3 p-8"><Loader2 className="animate-spin text-accent" /></div>
            ) : trendingJobs.length > 0 ? (
              trendingJobs.map((job) => (
                <Card 
                  key={job._id} 
                  variant="interactive"
                  onClick={() => navigate(`/student/jobs/${job._id}`)} // Dynamic navigation to job detail page
                  className="cursor-pointer"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={job.jobType === "Internship" ? "accent" : "success"}>
                        {job.jobType}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={(event) => openReportDialog(job, event)}>
                        <Flag className="h-3 w-3 mr-1" /> Report
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{job.role}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{job.startup.startupName}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {job.location || "Remote"}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /> {job.salary || (job.stipend ? "Paid" : "Unpaid")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm col-span-3 p-4">No trending jobs found.</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Job</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">Job</Label>
              <p className="text-sm text-muted-foreground mt-1">{selectedJobForReport?.role || "Role"} at {selectedJobForReport?.startup?.startupName || "Startup"}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-reason">Reason</Label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger id="report-reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spam">Spam</SelectItem>
                  <SelectItem value="Inappropriate content">Inappropriate content</SelectItem>
                  <SelectItem value="Fake company">Fake company</SelectItem>
                  <SelectItem value="Misleading salary">Misleading salary</SelectItem>
                  <SelectItem value="Scam or fraud">Scam or fraud</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-details">Details (optional)</Label>
              <Textarea
                id="report-details"
                value={reportDetails}
                onChange={(event) => setReportDetails(event.target.value)}
                placeholder="Share details to help moderation review quickly."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)} disabled={submittingReport}>Cancel</Button>
            <Button onClick={handleReportSubmit} disabled={submittingReport}>{submittingReport ? "Submitting..." : "Submit Report"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}