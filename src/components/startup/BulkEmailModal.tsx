import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Mail, Send, Users, Loader2, X } from "lucide-react";
import { EmailTemplateSelector, EmailTemplate } from "./EmailTemplateSelector";

interface Candidate {
  id: string;
  name: string;
  email: string;
  jobTitle?: string;
}

interface BulkEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: Candidate[];
  title?: string;
}

export function BulkEmailModal({
  open,
  onOpenChange,
  candidates,
  title = "Send Email",
}: BulkEmailModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const toggleCandidate = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedIds(checked ? candidates.map((c) => c.id) : []);
  };

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

    setSending(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSending(false);
    toast({
      title: "Emails Sent",
      description: `Successfully sent ${selectedIds.length} email(s).`,
    });
    
    onOpenChange(false);
    setSelectedIds([]);
    setSubject("");
    setMessage("");
  };

  const selectedCandidates = candidates.filter((c) => selectedIds.includes(c.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Recipient Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Select Recipients ({selectedIds.length}/{candidates.length})
              </Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  id="select-all"
                />
                <label htmlFor="select-all" className="text-sm cursor-pointer">
                  Select All
                </label>
              </div>
            </div>
            
            <ScrollArea className="h-32 border rounded-lg p-3">
              <div className="space-y-2">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.includes(candidate.id)}
                      onCheckedChange={() => toggleCandidate(candidate.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {candidate.email}
                        {candidate.jobTitle && ` • ${candidate.jobTitle}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {selectedIds.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedCandidates.slice(0, 3).map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs"
                  >
                    {c.name}
                    <button
                      onClick={() => toggleCandidate(c.id)}
                      className="hover:bg-accent/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selectedIds.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                    +{selectedIds.length - 3} more
                  </span>
                )}
              </div>
            )}
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
          <div className="space-y-2 flex-1">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="min-h-[150px] resize-none"
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={sending || selectedIds.length === 0 || !subject || !message}
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
                Send to {selectedIds.length} Recipient{selectedIds.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
