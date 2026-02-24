import { useState, useEffect } from "react";
import { Upload, FileText, Send, CheckCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { apiFetch, getStoredUser } from "@/lib/api";

interface JobApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: {
    id: number | string;
    title: string;
    company: string;
  };
}

export function JobApplicationModal({
  open,
  onOpenChange,
  job,
}: JobApplicationModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storedResumeUrl, setStoredResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = getStoredUser();
      if (!user?._id || !open) return;

      try {
        const res = await apiFetch(`/student-profiles/me`);
        if (res.success && res.data?.resumeUrl) {
          setStoredResumeUrl(res.data.resumeUrl);
        }
      } catch (err) {
        console.error("Failed to fetch profile resume:", err);
      }
    };
    fetchProfile();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile && !storedResumeUrl) {
        toast({ title: "Resume Required", description: "Please upload a resume or set one in your profile.", variant: "destructive" });
        return;
    }

    const user = getStoredUser();
    if (!user?._id) {
        toast({ title: "Error", description: "You must be logged in to apply.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);

    try {
        const formData = new FormData();
        if (resumeFile) {
            formData.append('resume', resumeFile);
        }
        
        const res = await apiFetch(`/applications/${job.id}/${user._id}`, {
            method: 'POST',
            body: formData
        });
        
        if (res.success) {
            setStep("success");
            toast({
              title: "Application Submitted!",
              description: `Your application for ${job.title} at ${job.company} has been submitted. Status: ${(res.data as any)?.status}`,
            });
        } else {
             toast({
               title: "Application Failed", 
               description: res.error || "Failed to submit application.", 
               variant: "destructive" 
             });
        }

    } catch (error) {
        console.error("Submission error:", error);
        toast({ title: "Error", description: "Network error occurred.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("form");
      setResumeFile(null);
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Apply for {job.title}</DialogTitle>
              <DialogDescription>
                Upload your resume to apply at {job.company}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Stored Resume Notice */}
              {storedResumeUrl && !resumeFile && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-accent">Using profile resume</p>
                    <p className="text-muted-foreground">We'll use the resume from your profile. Upload a new one below to override it.</p>
                  </div>
                </div>
              )}

              {/* Resume Upload */}
              <div className="space-y-2">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer relative">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="resume" className="cursor-pointer block">
                    {resumeFile ? (
                      <div className="flex items-center justify-center gap-2 text-accent">
                        <FileText className="h-5 w-5" />
                        <span className="font-medium">{resumeFile.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {storedResumeUrl ? "Change resume" : "Click to upload your resume"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOC, DOCX (Max 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting || (!resumeFile && !storedResumeUrl)}>
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {resumeFile ? "Submit New Resume" : storedResumeUrl ? "Submit Profile Resume" : "Submit Resume"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Resume Submitted!</h3>
              <p className="text-muted-foreground">
                Your resume for <span className="font-medium text-foreground">{job.title}</span> at{" "}
                <span className="font-medium text-foreground">{job.company}</span> has been submitted.
              </p>
            </div>
            <Button variant="hero" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
