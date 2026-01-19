import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge, ApplicationStatus } from "./StatusBadge";
import { Applicant } from "./ApplicantsTable";
import { toast } from "@/hooks/use-toast";
import {
  User,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Mail,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Hand,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ManualShortlistingPanelProps {
  applicants: Applicant[];
  onStatusChange: (id: string, status: ApplicationStatus, notes?: string) => void;
  onScheduleInterview: (applicant: Applicant) => void;
  onSendEmail: (applicant: Applicant) => void;
}

export function ManualShortlistingPanel({
  applicants,
  onStatusChange,
  onScheduleInterview,
  onSendEmail,
}: ManualShortlistingPanelProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null);

  const pendingApplicants = applicants.filter((a) => a.status === "APPLIED");
  const reviewedApplicants = applicants.filter((a) => a.status !== "APPLIED");

  const handleStatusUpdate = (status: ApplicationStatus) => {
    setPendingStatus(status);
    setStatusModalOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedApplicant && pendingStatus) {
      onStatusChange(selectedApplicant.id, pendingStatus, reviewNotes);
      toast({
        title: "Status Updated",
        description: `${selectedApplicant.name} marked as ${pendingStatus.toLowerCase().replace("_", " ")}.`,
      });
      setStatusModalOpen(false);
      setReviewNotes("");
      setPendingStatus(null);
      setSelectedApplicant(null);
    }
  };

  const ApplicantCard = ({ applicant }: { applicant: Applicant }) => (
    <div
      className={cn(
        "p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md",
        selectedApplicant?.id === applicant.id
          ? "border-accent bg-accent/5 shadow-md"
          : "hover:border-accent/50"
      )}
      onClick={() => setSelectedApplicant(applicant)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
            <User className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-medium">{applicant.name}</p>
            <p className="text-xs text-muted-foreground">{applicant.email}</p>
          </div>
        </div>
        <StatusBadge status={applicant.status} />
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          {applicant.jobTitle}
        </span>
        <span>{applicant.appliedAt}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pending Review */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hand className="h-5 w-5 text-warning" />
            Pending Review
            <Badge variant="secondary" className="ml-auto">
              {pendingApplicants.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {pendingApplicants.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No pending applications
                </p>
              ) : (
                pendingApplicants.map((applicant) => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Applicant Details */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Applicant Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedApplicant ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-accent/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedApplicant.name}</h3>
                    <p className="text-muted-foreground">{selectedApplicant.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={selectedApplicant.status} showIcon />
                    </div>
                  </div>
                </div>
                {selectedApplicant.resumeUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={selectedApplicant.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Resume
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Position</p>
                  <p className="font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-accent" />
                    {selectedApplicant.jobTitle}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Applied On</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    {selectedApplicant.appliedAt}
                  </p>
                </div>
                {selectedApplicant.experience !== undefined && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Experience</p>
                    <p className="font-medium">{selectedApplicant.experience} years</p>
                  </div>
                )}
                {selectedApplicant.education && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Education</p>
                    <p className="font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-accent" />
                      {selectedApplicant.education}
                    </p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button
                  className="bg-success text-success-foreground hover:bg-success/90"
                  onClick={() => handleStatusUpdate("SELECTED")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent/10"
                  onClick={() => handleStatusUpdate("SHORTLISTED")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("INTERVIEW_SCHEDULED")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onSendEmail(selectedApplicant)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleStatusUpdate("REJECTED")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Select an applicant to review</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Confirmation Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update <strong>{selectedApplicant?.name}</strong>'s status to{" "}
              <StatusBadge status={pendingStatus || "PENDING"} />
            </p>
            <div className="space-y-2">
              <Label>Review Notes (optional)</Label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add any notes about this decision..."
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setStatusModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmStatusUpdate}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
