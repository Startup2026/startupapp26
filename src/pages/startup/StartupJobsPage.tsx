import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, Search, Eye, Plus, MoreVertical, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { CreateJobModal } from "@/components/startup/CreateJobModal";
import { jobService, Job } from "@/services/jobService";
import { startupProfileService } from "@/services/startupProfileService";
import { applicationService, Application } from "@/services/applicationService";
import { formatDistanceToNow } from "date-fns";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { UpgradeModal } from "@/components/UpgradeModal";

export default function StartupJobsPage() {
  const { 
    hasAccess, 
    getFeatureValue, 
    isUpgradeModalOpen, 
    closeUpgradeModal, 
    checkAccessAndShowModal,
    triggeredFeature 
  } = usePlanAccess();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Get Profile ID
      const profileRes = await startupProfileService.getMyProfile();
      let currentProfileId = null;
      if (profileRes.success && profileRes.data) {
        setProfileId(profileRes.data._id);
        currentProfileId = profileRes.data._id;
      }

      if (currentProfileId) {
          // 2. Get Jobs
          const jobsRes = await jobService.getAllJobs();
          let myJobs: Job[] = [];
          if (jobsRes.success && jobsRes.data) {
             myJobs = jobsRes.data.filter(job => {
                if (typeof job.startupId === 'object' && job.startupId !== null) {
                    return job.startupId._id === currentProfileId;
                }
                return job.startupId === currentProfileId;
            });
            setJobs(myJobs);
          }

          // 3. Get Applications (for counts)
          const appsRes = await applicationService.getAllApplications();
          if (appsRes.success && appsRes.data) {
             const myApps = appsRes.data.filter(app => {
                 const appJobId = typeof app.jobId === 'object' ? app.jobId._id : app.jobId;
                 return myJobs.some(job => job._id === appJobId);
             });
             setApplications(myApps);
          }
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({ title: "Error", description: "Failed to load jobs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Logic
  const filteredJobs = jobs.filter((job) =>
    job.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openJobsCount = jobs.length; // Assuming all jobs fetched are "active" unless we have a status field? Model has deadline.
  // Actually the job schema doesn't have a specific "status" field, but the UI had "Open/Closed".
  // We'll assume all existing jobs are Open for now, or use deadline logic.
  
  const totalApplicants = applications.length;

  const getApplicantCount = (jobId: string) => {
      return applications.filter(a => {
           const aJobId = typeof a.jobId === 'object' ? a.jobId._id : a.jobId;
           return aJobId === jobId;
      }).length;
  };

  const handleOpenCreateModal = () => {
    const limit = getFeatureValue("maxActiveJobs") as number;
    // Ensure limit is a valid number (loaded) before blocking
    if (typeof limit === 'number' && jobs.length >= limit) {
      checkAccessAndShowModal("maxActiveJobs", "Multiple Active Jobs");
      return;
    }
    setCreateModalOpen(true);
  };

  // Helper to delete job
  const handleDeleteJob = async (id: string, e: React.MouseEvent) => {
      e.preventDefault(); // prevent navigation
      if(!confirm("Are you sure you want to delete this job?")) return;

      const res = await jobService.deleteJob(id);
      if(res.success) {
          toast({ title: "Job Deleted", description: "Job removed successfully." });
          fetchData(); 
      } else {
          toast({ title: "Error", description: res.error || "Failed to delete" , variant:"destructive"});
      }
  };

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
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-accent" />
              Job Posts
            </h1>
            <p className="text-muted-foreground mt-1">
              {openJobsCount} active positions • {totalApplicants} total applicants
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenCreateModal} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Briefcase className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{openJobsCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Applicants</p>
                <p className="text-2xl font-bold">{totalApplicants}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* JOB CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition-shadow bg-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{job.role}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                      <DropdownMenuItem onClick={(e) => handleDeleteJob(job._id, e as any)} className="text-destructive">Delete Job</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.aboutRole}
                </p>

                {/* Show badges for requirements if possible, else just generic tags */}
                <div className="flex flex-wrap gap-1.5">
                   {job.requirements && <Badge variant="secondary" className="text-xs truncate max-w-full">{job.requirements.substring(0, 30)}...</Badge>}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {getApplicantCount(job._id)} Applicants
                  </div>
                  <Badge
                    variant="accent"
                  >
                    Active
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/startup/jobs/${job._id}/applications`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Applications
                    </Link>
                  </Button>
                </div>
                 <div className="text-xs text-muted-foreground text-center">
                    Posted {formatDistanceToNow(new Date(job.createdAt || Date.now()), { addSuffix: true })}
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No jobs found</p>
          </div>
        )}

        {/* Create Job Modal */}
        <CreateJobModal open={createModalOpen} onOpenChange={setCreateModalOpen} onJobCreated={fetchData} />
        <UpgradeModal isOpen={isUpgradeModalOpen} onClose={closeUpgradeModal} featureName={triggeredFeature} />
      </div>
    </StartupLayout>
  );
}
