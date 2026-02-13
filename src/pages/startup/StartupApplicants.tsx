import { useState, useEffect } from "react";
import {
  MoreVertical,
  Search,
  User,
  Briefcase,
  Calendar,
  Loader2,
  FileText,
  GraduationCap,
  Clock,
} from "lucide-react";

import { StartupLayout } from "@/components/layouts/StartupLayout";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { startupProfileService } from "@/services/startupProfileService";
import { jobService } from "@/services/jobService";
import { applicationService } from "@/services/applicationService";
import { format } from "date-fns";

/* ---------------- Types ---------------- */

type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "REJECTED"
  | "INTERVIEW_SCHEDULED"
  | "HIRED";

interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  status: ApplicationStatus;
  appliedDate: string;
  skills: string[];
  experience: number;
  education?: string;
  resumeUrl?: string;
  atsScore?: number;
}

export default function StartupApplicants() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const profileRes = await startupProfileService.getMyProfile();
            if (!profileRes.success || !profileRes.data) return;
            const profileId = profileRes.data._id;

            const jobsRes = await jobService.getAllJobs();
            if (!jobsRes.success || !jobsRes.data) return;

            const myJobs = jobsRes.data.filter((job: any) => {
                 const jSid = typeof job.startupId === 'object' ? job.startupId._id : job.startupId;
                 return jSid === profileId;
            });

            let allMyApplicants: any[] = [];

            // Fetch applicants for EACH job specifically to ensure proper population
            await Promise.all(myJobs.map(async (job: any) => {
                const appRes = await applicationService.getJobApplicants(job._id);
                if (appRes.success && appRes.data) {
                    const mappedApps = appRes.data.map((app: any) => ({
                        ...app,
                        jobId: job // Ensure jobId is the job object
                    }));
                    allMyApplicants = [...allMyApplicants, ...mappedApps];
                }
            }));

            const mapped = allMyApplicants.map((app: any) => {
                const student = app.studentId;
                const job = app.jobId;
                
                return {
                    _id: app._id,
                    jobId: job._id,
                    jobTitle: job?.role || "Unknown",
                    applicantName: student ? `${student.firstName} ${student.lastName}` : "Unknown Student",
                    email: student?.email || "",
                    status: app.status,
                    appliedDate: app.createdAt ? format(new Date(app.createdAt), "yyyy-MM-dd") : "N/A",
                    skills: student?.skills || [],
                    experience: student?.experience?.length || 0,
                    education: student?.education && student.education.length > 0 ? student.education[0].degree : "N/A",
                    resumeUrl: student?.resumeUrl || app.resumeUrl || null,
                    atsScore: app.atsScore || 0
                };
            });
            setApplications(mapped);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    try {
        const res = await applicationService.updateApplication(appId, { status: newStatus });
        if(res.success) {
            setApplications(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
            toast({ title: "Status Updated", description: `Application status changed to ${newStatus}` });
        }
    } catch(e) {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-3xl font-bold">All Applicants</h1>
            <p className="text-muted-foreground">Manage all your job applications</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applicants..."
                className="pl-9 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                <SelectItem value="INTERVIEW_SCHEDULED">Interview</SelectItem>
                <SelectItem value="HIRED">Hired</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10">No applicants found.</div>
          ) : (
             filteredApps.map((app) => (
                <Card 
                  key={app._id} 
                  className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
                  onClick={() => setSelectedApplicant(app)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg max-w-[150px] truncate" title={app.applicantName}>{app.applicantName}</h3>
                                <p className="text-xs text-muted-foreground">{app.jobTitle}</p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(app._id, "SHORTLISTED")}>Shortlist</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app._id, "INTERVIEW_SCHEDULED")}>Schedule Interview</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app._id, "HIRED")}>Hire</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app._id, "REJECTED")} className="text-destructive">Reject</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Applied: {app.appliedDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {app.skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">{skill}</Badge>
                        ))}
                         {app.skills.length > 3 && (
                            <Badge variant="secondary" className="text-[10px]">+{app.skills.length - 3}</Badge>
                         )}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center w-full">
                        <Badge variant={
                              app.status === 'HIRED' ? 'success' : 
                              app.status === 'REJECTED' ? 'destructive' : 'outline'
                          } className="w-fit">
                            {app.status.replace("_", " ")}
                        </Badge>
                        {app.atsScore !== undefined && (
                             <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                                ATS: {app.atsScore}%
                             </Badge>
                        )}
                    </div>
                  </CardContent>
                </Card>
             ))
          )}
        </div>

        {/* Detail Modal */}
        <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
            <DialogContent className="max-w-2xl">
                {selectedApplicant && (
                    <>
                    <DialogHeader>
                        <DialogTitle>Applicant Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold">{selectedApplicant.applicantName}</h3>
                                <p className="text-muted-foreground">{selectedApplicant.jobTitle}</p>
                                <p className="text-sm text-muted-foreground">{selectedApplicant.email}</p>
                            </div>
                            <Badge className="text-lg">{selectedApplicant.status.replace("_", " ")}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex gap-2 items-center">
                                <Clock className="h-5 w-5 text-muted-foreground"/>
                                <span>{selectedApplicant.experience} Years Experience</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <GraduationCap className="h-5 w-5 text-muted-foreground"/>
                                <span>{selectedApplicant.education}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedApplicant.skills.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                            </div>
                        </div>

                        {selectedApplicant.resumeUrl && (
                             <Button className="w-full sm:w-auto" asChild>
                                 <a 
                                    href={selectedApplicant.resumeUrl.startsWith('http') ? selectedApplicant.resumeUrl : `http://localhost:3000${selectedApplicant.resumeUrl}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                 >
                                     <FileText className="mr-2 h-4 w-4"/> View Resume
                                 </a>
                             </Button>
                        )}
                        
                        <div className="pt-4 border-t flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => handleStatusChange(selectedApplicant._id, "REJECTED")}>Reject</Button>
                            <Button variant="default" onClick={() => handleStatusChange(selectedApplicant._id, "SHORTLISTED")}>Shortlist</Button>
                        </div>
                    </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
      </div>
    </StartupLayout>
  );
}
