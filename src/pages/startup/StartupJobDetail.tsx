


import { useState, useEffect } from "react";
import { Briefcase, Users, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { jobService } from "@/services/jobService";
import { applicationService } from "@/services/applicationService";
import { startupProfileService } from "@/services/startupProfileService";
import { format } from "date-fns";

/* ---------------- TYPES ---------------- */

type ApplicantStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "HIRED"
  | "REJECTED";

interface Applicant {
  id: string; // This is the Application ID
  jobId: string;
  name: string;
  email: string;
  role: string;
  appliedOn: string;
  skills: string[];
  resumeUrl: string;
  experience: number;
  education: string;
  status: ApplicantStatus;
}

interface Job {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  applicants: Applicant[];
  postedOn: string;
  status: "Open" | "Closed"; // Mapping this might be tricky if backend doesn't support it yet, default Open
}

/* ---------------- COMPONENT ---------------- */

export default function StartupJobDetail() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
        try {
            setLoading(true);
            const profileRes = await startupProfileService.getMyProfile();
            if(!profileRes.success || !profileRes.data) return;
            const profileId = profileRes.data._id;

            const jobsRes = await jobService.getAllJobs();
            if(!jobsRes.success || !jobsRes.data) return;

            const myJobs = jobsRes.data.filter((j: any) => {
                 const jSid = typeof j.startupId === 'object' ? j.startupId._id : j.startupId;
                 return jSid === profileId;
            });

            const appRes = await applicationService.getAllApplications();
            
            const relevantApps = appRes.success && appRes.data ? appRes.data : [];

            const processedJobs: Job[] = myJobs.map((job: any) => {
                const jobApps = relevantApps.filter((a: any) => {
                    const aJobId = typeof a.jobId === 'object' ? a.jobId._id : a.jobId;
                    return aJobId === job._id;
                });

                const applicants: Applicant[] = jobApps.map((a: any) => {
                    const s = a.studentId || {};
                    return {
                        id: a._id,
                        jobId: job._id,
                        name: s.firstName ? `${s.firstName} ${s.lastName}` : "Unknown",
                        email: s.email || "",
                        role: job.role,
                        appliedOn: a.createdAt ? format(new Date(a.createdAt), 'yyyy-MM-dd') : 'N/A',
                        skills: s.skills || [],
                        resumeUrl: a.resumeUrl || s.resumeUrl || "#",
                        experience: s.experience?.length || 0,
                        education: s.education?.length > 0 ? s.education[0].degree : "N/A",
                        status: a.status as ApplicantStatus
                    };
                });

                return {
                    id: job._id,
                    title: job.role,
                    description: job.aboutRole || "No description",
                    skillsRequired: job.Tag || [],
                    applicants: applicants,
                    postedOn: job.createdAt ? format(new Date(job.createdAt), 'yyyy-MM-dd') : 'N/A',
                    status: (job.deadline && new Date(job.deadline) < new Date()) ? "Closed" : "Open"
                };
            });

            setJobs(processedJobs);
        } catch(e) {
            console.error(e);
            toast({ title: "Error", description: "Failed to load jobs", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };
    fetchAllData();
  }, []);

  const toggleJobStatus = async (jobId: string) => {
     // Optional: If backend supports toggling status
     toast({ title: "Info", description: "Job status toggling involves editing deadline. Not implemented yet." });
  };

  const handleStatusUpdate = async (
    jobId: string,
    applicationId: string,
    status: ApplicantStatus
  ) => {
    try {
        const res = await applicationService.updateApplication(applicationId, { status });
        if(res.success) {
             setJobs(prev => prev.map(job => 
                 job.id === jobId ? {
                     ...job,
                     applicants: job.applicants.map(a => a.id === applicationId ? { ...a, status } : a)
                 } : job
             ));

             if (selectedApplicant && selectedApplicant.id === applicationId) {
                setSelectedApplicant({ ...selectedApplicant, status });
             }

             if (selectedJob && selectedJob.id === jobId) {
                 setSelectedJob(prev => prev ? {
                     ...prev,
                     applicants: prev.applicants.map(a => a.id === applicationId ? { ...a, status } : a)
                 } : null);
             }

             toast({ title: "Updated", description: `Status changed to ${status}` });
        }
    } catch(e) {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
      <StartupLayout>
          <div className="flex bg-background h-[calc(100vh-4rem)] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      </StartupLayout>
  );

  return (
    <StartupLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-accent" />
            Posted Jobs
          </h1>

          <div className="relative w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* JOB CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? <p className="col-span-full text-center text-muted-foreground">No jobs posted yet.</p> : 
          filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="truncate" title={job.title}>{job.title}</CardTitle>

                  <Badge
                    variant={job.status === "Open" ? "default" : "secondary"}
                  >
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2" title={job.description}>
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {job.skillsRequired.slice(0, 3).map((s, i) => (
                    <Badge key={i} variant="outline">
                      {s}
                    </Badge>
                  ))}
                  {job.skillsRequired.length > 3 && <Badge variant="outline">+{job.skillsRequired.length - 3}</Badge>}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  {job.applicants.length} Applicants
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedJob(job)}
                >
                  View Applicants
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* APPLICANTS LIST */}
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJob?.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {selectedJob?.applicants.length === 0 ? <p className="text-center text-muted-foreground">No applicants yet.</p> :
               selectedJob?.applicants.map((a) => (
                <Card
                  key={a.id}
                  onClick={() => {
                    setSelectedApplicant(a);
                    // Keep parent dialog open? No, typically nested dialogs or side-by-side. 
                    // Shadcn Dialog inside Dialog issues? Assuming acceptable. 
                    // Often better to close parent or trigger separate state.
                    // The original code kept selectedJob non-null.
                  }}
                  className="cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.email}</p>
                    </div>

                    <Badge
                       variant={a.status ==='REJECTED' ? 'destructive' : a.status === 'HIRED' ? 'success' : 'secondary'}
                    >
                      {a.status.replace("_", " ")}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* APPLICANT DETAIL MODAL */}
        <Dialog
          open={!!selectedApplicant}
          onOpenChange={() => setSelectedApplicant(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Applicant Details</DialogTitle>
            </DialogHeader>

            {selectedApplicant && (
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-semibold">
                    {selectedApplicant.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplicant.email}
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Role: {selectedApplicant.role}</span>
                  <span>Applied on: {selectedApplicant.appliedOn}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                     variant={selectedApplicant.status ==='REJECTED' ? 'destructive' : selectedApplicant.status === 'HIRED' ? 'success' : 'secondary'}
                  >
                    {selectedApplicant.status.replace("_", " ")}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Change Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {[
                        "APPLIED",
                        "SHORTLISTED",
                        "INTERVIEW_SCHEDULED",
                        "HIRED",
                        "REJECTED",
                      ].map((s) => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() =>
                            handleStatusUpdate(
                              selectedApplicant.jobId,
                              selectedApplicant.id,
                              s as ApplicantStatus,
                            )
                          }
                        >
                          {s.replace("_", " ")}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <p className="text-sm font-medium">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedApplicant.skills.map((skill, i) => (
                      <Badge key={i} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p>Experience: {selectedApplicant.experience} years</p>
                <p>Education: {selectedApplicant.education}</p>

                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a
                    href={selectedApplicant.resumeUrl.startsWith('http') ? selectedApplicant.resumeUrl : `http://localhost:3000${selectedApplicant.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </StartupLayout>
  );
}
