import { useState } from "react";
import { Calendar, Briefcase, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface ScheduleInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName?: string;
  applicationId?: string;
}

interface InterviewFormData {
  applicationId: string;
  scheduleDate: string;
}

export function ScheduleInterviewModal({ 
  open, 
  onOpenChange, 
  applicantName = "Applicant",
  applicationId = "APP-001" 
}: ScheduleInterviewModalProps) {
  const [formData, setFormData] = useState<InterviewFormData>({
    applicationId,
    scheduleDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Interview Scheduled:", formData);
    toast({
      title: "Interview Scheduled",
      description: `Interview with ${applicantName} has been scheduled.`,
    });
    onOpenChange(false);
    setFormData({ applicationId, scheduleDate: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="h-5 w-5 text-accent" />
            Schedule Interview
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <Label>Applicant</Label>
            <Input
              value={applicantName}
              disabled
              className="mt-1.5 bg-muted"
            />
          </div>

          <div>
            <Label className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-accent" />
              Interview Date & Time <span className="text-destructive">*</span>
            </Label>
            <Input
              type="datetime-local"
              name="scheduleDate"
              value={formData.scheduleDate}
              onChange={handleChange}
              required
              className="mt-1.5"
            />
          </div>

          <Button type="submit" variant="hero" className="w-full gap-2">
            <CheckCircle className="h-4 w-4" />
            Schedule Interview
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
