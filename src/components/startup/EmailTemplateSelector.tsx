import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";

export type EmailTemplate = "interview_invite" | "rejection" | "general_update" | "custom";

interface EmailTemplateSelectorProps {
  onSelect: (template: EmailTemplate, subject: string, body: string) => void;
}

const templates: Record<EmailTemplate, { subject: string; body: string; label: string }> = {
  interview_invite: {
    label: "Interview Invitation",
    subject: "Interview Invitation - [Company Name]",
    body: `Dear [Candidate Name],

We are pleased to inform you that you have been shortlisted for the [Position] role at [Company Name].

We would like to invite you for an interview:
- Date: [Date]
- Time: [Time]
- Mode: [Online/In-person]
- Location/Link: [Details]

Please confirm your availability by replying to this email.

Best regards,
[Company Name] Hiring Team`,
  },
  rejection: {
    label: "Rejection Notice",
    subject: "Application Update - [Company Name]",
    body: `Dear [Candidate Name],

Thank you for your interest in the [Position] role at [Company Name] and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We appreciate your interest in our company and wish you the best in your future endeavors.

Best regards,
[Company Name] Hiring Team`,
  },
  general_update: {
    label: "General Update",
    subject: "Application Status Update - [Company Name]",
    body: `Dear [Candidate Name],

We wanted to provide you with an update regarding your application for the [Position] role at [Company Name].

[Your message here]

If you have any questions, please don't hesitate to reach out.

Best regards,
[Company Name] Hiring Team`,
  },
  custom: {
    label: "Custom Email",
    subject: "",
    body: "",
  },
};

export function EmailTemplateSelector({ onSelect }: EmailTemplateSelectorProps) {
  const [selected, setSelected] = useState<EmailTemplate | "">("");

  const handleSelect = (value: EmailTemplate) => {
    setSelected(value);
    const template = templates[value];
    onSelect(value, template.subject, template.body);
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Email Template
      </Label>
      <Select value={selected} onValueChange={handleSelect}>
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder="Select a template..." />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          {Object.entries(templates).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { templates };
