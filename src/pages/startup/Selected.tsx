import { useEffect, useState } from "react";
import { Mail, User, X, Loader2, CheckCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { toast } from "@/hooks/use-toast";
import { startupProfileService } from "@/services/startupProfileService";
import { jobService } from "@/services/jobService";
import { applicationService } from "@/services/applicationService";
import { selectionService } from "@/services/selectionService";
import { Checkbox } from "@/components/ui/checkbox";

/* ---------------- TYPES ---------------- */

type ApplicantStatus = "APPLIED" | "SHORTLISTED" | "REJECTED" | "HIRED";

interface Applicant {
  id: string;
  jobId: string;
  jobRole: string; // added
  name: string;
  email: string;
  role: string;
  status: ApplicantStatus;
  resumeUrl?: string;
}


/* ---------------- COMPONENT ---------------- */

export default function Selected() {
  const [selectedApps, setSelectedApps] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* Email modal state */
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "Job Offer - Congratulations!",
    message: "We are pleased to offer you the position. Please find the details attached.",
  });

  /* Load selected candidates */
  useEffect(() => {
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
                // Filter apps: My Jobs AND Status is HIRED (Selected)
                const relevantApps = appRes.data.filter(app => {
                    if (!app.jobId) return false;
                    const appId = (typeof app.jobId === 'object') ? app.jobId._id : app.jobId;
                    const matchesJob = myJobs.some(j => j._id === appId);
                    // Check status - Backend likely uses 'HIRED' for final selection
                    return matchesJob && (app.status === 'HIRED' || app.status === 'SELECTED'); // handle both Just In Case
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
                        status: app.status as ApplicantStatus,
                        resumeUrl: app.resumeUrl || student?.resumeUrl || null
                    };
                });
                
                setSelectedApps(cleanApps);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  /* Open email modal */
  const handleBulkEmail = () => {
    setIsEmailModalOpen(true);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* Send email */
  const sendSelectionEmail = async () => {
    try {
        const res = await selectionService.notifySelected({
            subject: emailData.subject,
            message: emailData.message,
            applicationIdList: selectedIds
        });

        if (res.success) {
             toast({
              title: "Bulk Email Sent",
              description: `Selection emails sent to ${selectedIds.length} candidates.`,
            });
            setIsEmailModalOpen(false);
            setSelectedIds([]);
        } else {
            toast({ title: "Error", description: "Failed to send emails", variant: "destructive" });
        }
    } catch(e) {
         toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
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
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
             <h1 className="text-3xl font-bold">Selected Candidates</h1>
             <Button disabled={selectedIds.length === 0} onClick={handleBulkEmail}>
                <Mail className="h-4 w-4 mr-2"/> Send Selection Email ({selectedIds.length})
             </Button>
        </div>

        {/* Candidate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedApps.length > 0 ? (
           selectedApps.map((c) => (
            <Card key={c.id} className={selectedIds.includes(c.id) ? "border-primary border-2" : ""}>
              <CardHeader className="flex flex-row items-center gap-2">
                 <Checkbox 
                        checked={selectedIds.includes(c.id)}
                        onCheckedChange={() => toggleSelect(c.id)}
                 />
                <CardTitle className="flex items-center gap-2 text-lg cursor-pointer" onClick={() => toggleSelect(c.id)}>
                  <CheckCircle className="h-5 w-5 text-success" />
                  {c.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm pt-0">
                <p><strong>Role:</strong> {c.role}</p>
                <p><strong>Job:</strong> {c.jobRole}</p>
                <p className="text-muted-foreground">{c.email}</p>
                {c.resumeUrl && (
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                      <a 
                        href={c.resumeUrl.startsWith('http') ? c.resumeUrl : `http://localhost:3000${c.resumeUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-3 w-3 mr-1"/> View Resume
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
           ))
          ) : (
             <p className="text-muted-foreground">No selected candidates found.</p>
          )}
        </div>

        {/* -------- EMAIL MODAL -------- */}
        {isEmailModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-xl relative">
              {/* Close Button */}
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="absolute top-2 right-2 border-2 text-muted-foreground rounded-full p-2 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  Send Selection Email
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Subject */}
                <div>
                  <Label>Subject</Label>
                  <Input 
                   value={emailData.subject} 
                   onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                   placeholder="Congratulations! You have been selected"
                  />
                </div>

                {/* Message */}
                <div>
                  <Label>Message</Label>
                  <Textarea 
                   value={emailData.message}
                   onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                   rows={5}
                   placeholder="We are pleased to offer you the position..."
                  />
                </div>
                
                 <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setIsEmailModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={sendSelectionEmail}>Send Emails</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </StartupLayout>
  );
}
