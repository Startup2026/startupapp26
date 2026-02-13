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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Mail, Send, Loader2, Calendar } from "lucide-react";
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

  // Interview States
  const [isInterview, setIsInterview] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewMode, setInterviewMode] = useState<"online" | "offline">("online");
  const [interviewLink, setInterviewLink] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedIds(preselectedIds);
      setSubject("");
      setMessage("");
      setIsInterview(false);
      setInterviewDate("");
      setInterviewTime("");
      setInterviewMode("online");
      setInterviewLink("");
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

    if (isInterview && (!interviewDate || !interviewTime)) {
      toast({
        title: "Incomplete Schedule",
        description: "Please provide interview date and time.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    const interviewDetails = isInterview ? {
        date: interviewDate,
        time: interviewTime,
        mode: interviewMode,
        link: interviewLink
    } : null;

    const res = await apiFetch<{
      results?: { sent?: Array<{ applicationId: string }>; failed?: Array<{ applicationId: string; error: string }> };
    }>("/emails/bulk", {
      method: "POST",
      body: JSON.stringify({
        subject: subject.trim(),
        message: message.trim(),
        applicationIdList: selectedIds,
        isInterview,
        interviewDetails
      }),
    });

    setSending(false);

    if (res.success) {
      const sentCount = res.results?.sent?.length ?? selectedIds.length;
      const failedCount = res.results?.failed?.length ?? 0;

      toast({
        title: isInterview ? "Interviews Scheduled" : "Emails Sent",
        description: failedCount
          ? `Processed ${sentCount} application(s). ${failedCount} failed.`
          : `Successfully processed ${sentCount} application(s).`,
      });

      onOpenChange(false);
    } else {
      toast({
        title: "Operation Failed",
        description: res.error || "Unable to complete request.",
        variant: "destructive",
      });
    }
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
              maxHeight="200px"
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
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Interview Toggle */}
          <div className="flex items-center justify-between p-4 bg-accent/5 rounded-xl border border-accent/10">
            <div className="space-y-1">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                Schedule Interview?
              </Label>
              <p className="text-sm text-muted-foreground">
                Add this to candidates' calendars and mark as interview.
              </p>
            </div>
            <Switch checked={isInterview} onCheckedChange={setIsInterview} />
          </div>

          {/* Interview Details */}
          {isInterview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <Label>Interview Date</Label>
                <Input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Interview Time</Label>
                <Input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Meeting Mode</Label>
                <Select value={interviewMode} onValueChange={(v: any) => setInterviewMode(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-[60]">
                    <SelectItem value="online">Online (Video Call)</SelectItem>
                    <SelectItem value="offline">In-Person (Office)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{interviewMode === 'online' ? 'Meeting Link' : 'Location'}</Label>
                <Input
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  placeholder={interviewMode === 'online' ? 'https://zoom.us/...' : 'Office address...'}
                />
              </div>
            </div>
          )}
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
                {isInterview ? `Schedule & Notify ${selectedIds.length} Recipient${selectedIds.length !== 1 ? 's' : ''}` : `Send Email to ${selectedIds.length} Recipient${selectedIds.length !== 1 ? 's' : ''}`}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

