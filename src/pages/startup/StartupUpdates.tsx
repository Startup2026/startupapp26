import { useState, useEffect } from "react";
import {
  Mail,
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle,
  Loader2,
  Briefcase,
} from "lucide-react";

import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { startupProfileService } from "@/services/startupProfileService";
import { jobService } from "@/services/jobService";
import { applicationService } from "@/services/applicationService";
import { interviewService } from "@/services/interviewService";

/* ---------------- TYPES ---------------- */

type Status =
  | "HIRED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "APPLIED"
  | "REJECTED";

interface Application {
  id: string; // Application ID
  jobId: string;
  studentId: string;
  name: string;
  email: string;
  jobTitle: string;
  status: Status;
}

export default function StartupUpdates() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [startupId, setStartupId] = useState<string>("");

  /* ---------- Selected Candidates ---------- */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [emailModal, setEmailModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  /* ---------- Interview Schedule ---------- */
  const [schedule, setSchedule] = useState({
    applicationId: "",
    date: "",
    time: "",
    mode: "Online",
    link: "",
    interviewer: "",
    notes: "",
  });

  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
        try {
            const profileRes = await startupProfileService.getMyProfile();
            if(!profileRes.success || !profileRes.data) return;
            setStartupId(profileRes.data._id);
            const sId = profileRes.data._id;

            const jobsRes = await jobService.getAllJobs();
            if(!jobsRes.success || !jobsRes.data) return;
            const myJobs = jobsRes.data.filter((j: any) => {
                 const jSid = typeof j.startupId === 'object' ? j.startupId._id : j.startupId;
                 return jSid === sId;
            });

            const appRes = await applicationService.getAllApplications();
            if(appRes.success && appRes.data) {
                const relevant = appRes.data.filter((a: any) => {
                     const aJobId = typeof a.jobId === 'object' ? a.jobId._id : a.jobId;
                     return myJobs.some((j: any) => j._id === aJobId);
                });

                setApplications(relevant.map((a: any) => {
                    const student = a.studentId;
                    const job = typeof a.jobId === 'object' ? a.jobId : myJobs.find((j: any) => j._id === a.jobId);
                    return {
                        id: a._id,
                        jobId: job?._id,
                        studentId: student?._id,
                        name: student ? `${student.firstName} ${student.lastName}` : "Unknown",
                        email: student?.email || "",
                        jobTitle: job?.role || "Unknown",
                        status: a.status as Status
                    };
                }));
            }
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchApps();
  }, []);


  const selectedCandidates = applications.filter(
    (a) => a.status === "HIRED"
  );

  const shortlisted = applications.filter(
    (a) => a.status === "SHORTLISTED"
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const sendSelectionEmail = async () => {
    setSending(true);

    // Mock Email sending
    setTimeout(() => {
      setSending(false);
      setEmailModal(false);
      setSelectedIds([]);
      toast({
        title: "Emails Sent",
        description: `Selection emails sent to ${selectedIds.length} candidates.`,
      });
    }, 1500);
  };

  const scheduleInterview = async () => {
    if(!schedule.applicationId) return;
    
    setScheduling(true);
    try {
        const app = applications.find(a => a.id === schedule.applicationId);
        if(!app) throw new Error("Application not found");

        const dateTime = new Date(`${schedule.date}T${schedule.time}`);

        const payload = {
            startupId,
            jobId: app.jobId,
            studentId: app.studentId,
            date: schedule.date, // Backend expects string dates? Model uses String for date/time based on previous fix
            time: schedule.time,
            type: schedule.mode,
            meetingLink: schedule.link,
            interviewerName: schedule.interviewer,
            notes: schedule.notes,
            status: "Scheduled"
        };
        
        const res = await interviewService.createInterview(payload);
        if(res.success) {
            // Also update application status?
            await applicationService.updateApplication(app.id, { status: "INTERVIEW_SCHEDULED" });
            
            // Update local state
            setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: "INTERVIEW_SCHEDULED" } : a));

            toast({
                title: "Interview Scheduled",
                description: "Interview has been created successfully.",
            });

            setSchedule({
                applicationId: "",
                date: "",
                time: "",
                mode: "Online",
                link: "",
                interviewer: "",
                notes: "",
            });
        }
    } catch(e) {
        toast({ title: "Error", description: "Failed to schedule interview", variant: "destructive" });
    } finally {
        setScheduling(false);
    }
  };

  if (loading) return (
      <StartupLayout>
          <div className="flex bg-background h-[calc(100vh-4rem)] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      </StartupLayout>
  );

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold flex items-center gap-3">
  <Mail className="h-8 w-8 text-accent" />
  Updates
</h1>


        {/* ================= SELECTED CANDIDATES ================= */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-accent" />
              Hired Candidates
            </CardTitle>

            <Button
              disabled={selectedIds.length === 0}
              onClick={() => setEmailModal(true)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Selection Email
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {selectedCandidates.length === 0 ? <p className="text-muted-foreground">No hired candidates yet.</p> :
            selectedCandidates.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.includes(c.id)}
                    onCheckedChange={() => toggleSelect(c.id)}
                  />
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.jobTitle}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-600">HIRED</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ================= INTERVIEW SCHEDULE ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-accent" />
              Interview Schedule
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Candidate (Shortlisted only)</Label>
                <Select
                  value={schedule.applicationId}
                  onValueChange={(v) =>
                    setSchedule({ ...schedule, applicationId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {shortlisted.length === 0 ? <SelectItem value="none" disabled>No shortlisted candidates</SelectItem> :
                    shortlisted.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} — {a.jobTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Interview Mode</Label>
                <Select
                  value={schedule.mode}
                  onValueChange={(v) =>
                    setSchedule({ ...schedule, mode: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="In-person">In-person</SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="md:col-span-2">
                <Label>Interview Link / Location</Label>
                <Input
                  placeholder="Google Meet / Office address"
                  value={schedule.link}
                  onChange={(e) =>
                    setSchedule({ ...schedule, link: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Interviewer</Label>
                <Input
                  placeholder="Name of interviewer"
                  value={schedule.interviewer}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      interviewer: e.target.value,
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional instructions"
                  value={schedule.notes}
                  onChange={(e) =>
                    setSchedule({ ...schedule, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              className="w-full mt-4"
              onClick={scheduleInterview}
              disabled={!schedule.applicationId || scheduling}
            >
              {scheduling ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Clock className="h-4 w-4 mr-2" />}
              Schedule Interview
            </Button>
          </CardContent>
        </Card>

        {/* ================= EMAIL MODAL ================= */}
        <Dialog open={emailModal} onOpenChange={setEmailModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Selection Email</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Textarea
                placeholder="Email message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />

              <Button
                className="w-full"
                onClick={sendSelectionEmail}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Confirm & Send"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </StartupLayout>
  );
}
