import { useState } from "react";
import { ClipboardCheck, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface SelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName?: string;
  applicationId?: string;
}

type SelectionStatus = "APPROVED" | "REJECTED";

interface SelectionFormData {
  applicationId: string;
  status: SelectionStatus;
}

export function SelectionModal({ 
  open, 
  onOpenChange,
  applicantName = "Applicant",
  applicationId = "APP-001"
}: SelectionModalProps) {
  const [formData, setFormData] = useState<SelectionFormData>({
    applicationId,
    status: "APPROVED",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selection Submitted:", formData);
    toast({
      title: formData.status === "APPROVED" ? "Applicant Approved" : "Applicant Rejected",
      description: `${applicantName} has been ${formData.status.toLowerCase()}.`,
      variant: formData.status === "APPROVED" ? "default" : "destructive",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ClipboardCheck className="h-5 w-5 text-accent" />
            Application Selection
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
            <Label>Selection Status <span className="text-destructive">*</span></Label>
            <Select
              value={formData.status}
              onValueChange={(value: SelectionStatus) => 
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            variant={formData.status === "APPROVED" ? "hero" : "destructive"} 
            className="w-full gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Submit Selection
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
