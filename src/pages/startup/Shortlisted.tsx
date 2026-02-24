import { useEffect, useState } from "react";
import { Calendar, Mail, User, X, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { toast } from "@/hooks/use-toast";
import { startupProfileService } from "@/services/startupProfileService";
import { jobService } from "@/services/jobService";
import { selectionService } from "@/services/selectionService";
import { Checkbox } from "@/components/ui/checkbox";
import { applicationService } from "@/services/applicationService";
import { interviewService } from "@/services/interviewService";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ---------------- TYPES ---------------- */

type ApplicantStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "REJECTED"
  | "HIRED";

interface Applicant {
  id: string;
  jobId: string;
  jobRole: string;
  name: string;
  email: string;
  role: string;
  appliedOn: string;
  skills: string[];
  experience: number;
  education: string;
  status: ApplicantStatus;
  resumeUrl?: string;
}

/* ---------------- COMPONENT ---------------- */

export default function Shortlisted() {
  const [shortlistedApps, setShortlistedApps] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // States for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState({
    applicationId: "",
    candidateName: "",
    date: "",
    time: "",
    mode: "Online",
    link: "",
    interviewer: "",
    notes: "",
  });

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "Shortlisted for Interview",
    message: "Congratulations! You have been shortlisted for the interview round. We will share the schedule shortly.",
  });

  const fetchData = async () => {
    try {
        setLoading(true);
        const profileRes = await startupProfileService.getMyProfile();
        if (!profileRes.success || !profileRes.data) {
            setLoading(false);
            return;
        }
        const profileId = profileRes.data._id;

        const jobsRes = await jobService.getAllJobs();
        if (!jobsRes.success || !jobsRes.data) {
            setLoading(false);
            return;
        }

        // Filter my jobs
        const myJobs = jobsRes.data.filter(job => {
            const jSid = (job.startupId && typeof job.startupId === 'object') ? job.startupId._id : job.startupId;
            return jSid === profileId;
        });

        // Get all applications
        const appRes = await applicationService.getAllApplications();
        if (appRes.success && appRes.data) {
            // Filter apps for my jobs AND status SHORTLISTED
            const relevantApps = appRes.data.filter(app => {
                if (!app.jobId) return false;
                const appId = (typeof app.jobId === 'object') ? app.jobId._id : app.jobId;
                const matchesJob = myJobs.some(j => j._id === appId);
                return matchesJob && app.status === 'SHORTLISTED';
            });

            // Map to UI model
            const cleanApps: Applicant[] = relevantApps.map(app => {
                const student = app.studentId as any; 
                const job = typeof app.jobId === 'object' ? app.jobId : myJobs.find(j => j._id === app.jobId);

                return {
                    id: app._id,
                    jobId: job?._id || "",
                    jobRole: (job as any)?.role || "Unknown Role",
                    name: student ? `${student.firstName || student.firstname} ${student.lastName || student.lastname}` : "Unknown",
                    email: student?.email || "",
                    role: (job as any)?.role || "Unknown Role",
                    appliedOn: app.createdAt ? format(new Date(app.createdAt), "yyyy-MM-dd") : "N/A",
                    skills: student?.skills || [],
                    experience: (student?.experience || []).length || 0,
                    education: student?.education?.[0]?.degree || "N/A",
                    status: app.status as ApplicantStatus,
                    resumeUrl: app.resumeUrl || student?.resumeUrl || null
                };
            });
            
            setShortlistedApps(cleanApps);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const openScheduleModal = (applicant: Applicant) => {
    setSchedule({
      ...schedule,
      applicationId: applicant.id,
      candidateName: applicant.name, 
    });
    setIsModalOpen(true);
  };

  const scheduleInterview = async () => {
    if (!schedule.date || !schedule.time) {
      toast({ title: "Validation Error", description: "Please provide both date and time", variant: "destructive" });
      return;
    }

    try {
      const res = await interviewService.scheduleInterview(schedule.applicationId, {
        interviewDate: schedule.date,
        interviewTime: schedule.time,
        mode: schedule.mode,
        interviewLink: schedule.link,
        interviewer: schedule.interviewer,
        notes: schedule.notes
      });

      if (res.success || res.message === "Interview Scheduled!!!") {
        toast({
          title: "Interview Scheduled",
          description: `Interview scheduled with ${schedule.candidateName} on ${schedule.date} at ${schedule.time}`,
        });
        setSchedule({
          applicationId: "",
          candidateName: "",
          date: "",
          time: "",
          mode: "Online",
          link: "",
          interviewer: "",
          notes: "",
        });
        setIsModalOpen(false);
        // Refresh data to reflect status change
        fetchData(); 
      } else {
        toast({ title: "Error", description: res.error || "Failed to schedule interview", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  const handleBulkEmail = () => {
     // Keep existing template or reset if empty. 
     // For now, ensuring it opens with the template is enough.
     setIsEmailModalOpen(true);
  };

  const sendEmail = async () => {
    try {
        const res = await selectionService.notifyShortlisted({
            subject: emailData.subject,
            message: emailData.message,
            applicationIdList: selectedIds
        });

        if (res.success) {
            toast({
                title: "Bulk Email Sent",
                description: `Emails sent to ${selectedIds.length} candidates.`,
            });
            setIsEmailModalOpen(false);
            setSelectedIds([]);
        } else {
             toast({ title: "Error", description: "Failed to send emails", variant: "destructive" });
        }
    } catch (e) {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const removeCandidate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if any
    try {
        const res = await applicationService.updateApplication(id, { status: "APPLIED" });
        if(res.success){
             setShortlistedApps((prev) => prev.filter((app) => app.id !== id));
             toast({ title: "Removed from Shortlist", description: "Candidate status reset to Applied." });
        } else {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive"});
        }
    } catch(err) {
        toast({ title: "Error", description: "An error occurred", variant: "destructive"});
    }
  };

  /* -------- FILTERED CANDIDATES -------- */
  const filtered = shortlistedApps.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
                 <h1 className="text-3xl font-bold">Shortlisted Candidates</h1>
                 <p className="text-muted-foreground">{shortlistedApps.length} Candidates</p>
            </div>
            <div className="flex gap-2">
                 <Button disabled={selectedIds.length === 0} onClick={handleBulkEmail}>
                    <Mail className="h-4 w-4 mr-2"/> Send Bulk Email ({selectedIds.length})
                 </Button>
                <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                />
          </div>
        </div>

        {/* CANDIDATE CARDS */}
        {filtered.length === 0 ? (
          <p className="text-muted-foreground">
            No shortlisted candidates found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <Card key={c.id} className={selectedIds.includes(c.id) ? "border-primary border-2" : ""}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                        checked={selectedIds.includes(c.id)}
                        onCheckedChange={() => toggleSelect(c.id)}
                    />
                    <CardTitle className="text-lg font-bold flex items-center gap-2 cursor-pointer" onClick={() => toggleSelect(c.id)}>
                        <User className="h-5 w-5" />
                        {c.name}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => removeCandidate(c.id, e)}
                    title="Remove from shortlist"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{c.jobRole}</p>
                      <User className="h-3 w-3 inline mr-1"/> {c.experience}y exp • {c.education}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                      {c.skills.slice(0,3).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">{skill}</span>
                      ))}
                  </div>

                  {/* Buttons inside each card */}
                  <div className="flex gap-2 pt-2">
                    {c.resumeUrl && (
                      <Button variant="outline" size="sm" className="flex-1 text-xs border-teal-500 text-teal-600 hover:bg-teal-50" asChild>
                         <a 
                          href={c.resumeUrl.startsWith('http') ? c.resumeUrl : `http://localhost:3000${c.resumeUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-3 w-3 mr-1"/>
                          Resume
                        </a>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600 text-white flex-1 text-xs"
                      onClick={() => openScheduleModal(c)}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* -------- SCHEDULE INTERVIEW MODAL -------- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <Card className="w-full max-w-2xl relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-accent" />
                  Schedule Interview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-3 right-3 border-2 border-teal-500 text-teal-500 rounded-full p-1 flex items-center justify-center hover:bg-teal-50 focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <Label>Candidate</Label>
                    <Input value={schedule.candidateName} disabled />
                  </div>

                  <div>
                    <Label>Interview Mode</Label>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={schedule.mode}
                      onChange={(e) =>
                        setSchedule({ ...schedule, mode: e.target.value })
                      }
                    >
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                    </select>
                  </div>

                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={schedule.date}
                      onChange={(e) =>
                        setSchedule({ ...schedule, date: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={schedule.time}
                      onChange={(e) =>
                        setSchedule({ ...schedule, time: e.target.value })
                      }
                    />
                  </div>
                  
                  {schedule.mode === "Online" && (
                    <div className="md:col-span-2">
                        <Label>Meeting Link</Label>
                        <Input
                          placeholder="https://zoom.us/..."
                          value={schedule.link}
                          onChange={(e) =>
                            setSchedule({ ...schedule, link: e.target.value })
                          }
                        />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                   <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                   <Button onClick={scheduleInterview}>Schedule</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* -------- EMAIL MODAL -------- */}
        {isEmailModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Send Email to {selectedIds.length} Candidates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData({ ...emailData, subject: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={emailData.message}
                    onChange={(e) =>
                      setEmailData({ ...emailData, message: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setIsEmailModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={sendEmail}>Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </StartupLayout>
  );
}
