import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Mail, Send, Loader2 } from "lucide-react";
import { EmailTemplateSelector, EmailTemplate } from "./EmailTemplateSelector";
import {
  ApplicantSelectionTable,
  SelectableCandidate,
} from "./ApplicantSelectionTable";

interface Candidate {
  id: string;
  name: string;
  email: string;
  status?: string;
  jobTitle?: string;
}

interface BulkEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: Candidate[];
  title?: string;
  preselectedIds?: string[];
}

export function BulkEmailModal({
  open,
  onOpenChange,
  candidates,
  title = "Send Email",
  preselectedIds = [],
}: BulkEmailModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(preselectedIds);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedIds(preselectedIds);
      setSubject("");
      setMessage("");
    }
  }, [open, preselectedIds]);

  const handleTemplateSelect = (
    template: EmailTemplate,
    templateSubject: string,
    templateBody: string
  ) => {
    setSubject(templateSubject);
    setMessage(templateBody);
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please select at least one candidate.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide both subject and message.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSending(false);
    toast({
      title: "Emails Sent",
      description: `Successfully sent ${selectedIds.length} email(s).`,
    });

    onOpenChange(false);
  };

  // Convert candidates to selectable format with status
  const selectableCandidates: SelectableCandidate[] = candidates.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    status: c.status,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Applicant Selection Table */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Recipients</Label>
            <ApplicantSelectionTable
              candidates={selectableCandidates}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              showStatus={true}
              maxHeight="220px"
            />
          </div>

          {/* Email Template */}
          <EmailTemplateSelector onSelect={handleTemplateSelect} />

          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="min-h-[140px] resize-none"
            />
          </div>
        </div>

        {/* Send Button */}
        <div className="pt-4 border-t mt-4">
          <Button
            onClick={handleSend}
            disabled={
              sending || selectedIds.length === 0 || !subject.trim() || !message.trim()
            }
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to {selectedIds.length} Recipient
                {selectedIds.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
