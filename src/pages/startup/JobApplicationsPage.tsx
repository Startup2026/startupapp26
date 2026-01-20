import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATSToggle } from "@/components/startup/ATSToggle";
import { ApplicantsTable, Applicant } from "@/components/startup/ApplicantsTable";
import { ManualShortlistingPanel } from "@/components/startup/ManualShortlistingPanel";
import { BulkEmailModal } from "@/components/startup/BulkEmailModal";
import { InterviewScheduleModal } from "@/components/startup/InterviewScheduleModal";
import { ApplicationStatus } from "@/components/startup/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Users,
  Mail,
  Calendar,
  Bot,
  Hand,
  Briefcase,
  User,
  GraduationCap,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/startup/StatusBadge";

// Mock data for applications
const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "Amit Sharma",
    email: "amit@gmail.com",
    jobTitle: "Frontend Developer",
    resumeUrl: "/resume/amit.pdf",
    appliedAt: "12 Jan 2026",
    status: "APPLIED",
    atsScore: 85,
    skills: ["React", "TypeScript", "Tailwind"],
    experience: 2,
    education: "B.E. Computer Engineering",
  },
  {
    id: "2",
    name: "Neha Patil",
    email: "neha@gmail.com",
    jobTitle: "Frontend Developer",
    resumeUrl: "/resume/neha.pdf",
    appliedAt: "13 Jan 2026",
    status: "SHORTLISTED",
    atsScore: 92,
    skills: ["React", "Node.js", "MongoDB"],
    experience: 3,
    education: "B.Tech IT",
  },
  {
    id: "3",
    name: "Rahul Verma",
    email: "rahul@gmail.com",
    jobTitle: "Frontend Developer",
    resumeUrl: "/resume/rahul.pdf",
    appliedAt: "14 Jan 2026",
    status: "APPLIED",
    atsScore: 72,
    skills: ["JavaScript", "CSS", "HTML"],
    experience: 1,
    education: "BCA",
  },
  {
    id: "4",
    name: "Priya Kulkarni",
    email: "priya@gmail.com",
    jobTitle: "Frontend Developer",
    resumeUrl: "/resume/priya.pdf",
    appliedAt: "15 Jan 2026",
    status: "INTERVIEW_SCHEDULED",
    atsScore: 88,
    skills: ["React", "Vue", "Angular"],
    experience: 4,
    education: "M.Tech Computer Science",
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram@gmail.com",
    jobTitle: "Frontend Developer",
    resumeUrl: null,
    appliedAt: "16 Jan 2026",
    status: "REJECTED",
    atsScore: 45,
    skills: ["HTML", "CSS"],
    experience: 0,
    education: "BSc IT",
  },
];

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const [atsEnabled, setAtsEnabled] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [preselectedForSchedule, setPreselectedForSchedule] = useState<string | undefined>();

  const handleStatusChange = (id: string, status: ApplicationStatus, notes?: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    toast({
      title: "Status Updated",
      description: `Application status changed to ${status.toLowerCase().replace("_", " ")}.`,
    });
  };

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setDetailsModalOpen(true);
  };

  const handleScheduleInterview = (applicant: Applicant) => {
    setPreselectedForSchedule(applicant.id);
    setScheduleModalOpen(true);
  };

  const handleSendEmail = (applicant: Applicant) => {
    setSelectedIds([applicant.id]);
    setEmailModalOpen(true);
  };

  const stats = {
    total: applicants.length,
    applied: applicants.filter((a) => a.status === "APPLIED").length,
    shortlisted: applicants.filter((a) => a.status === "SHORTLISTED").length,
    interview: applicants.filter((a) => a.status === "INTERVIEW_SCHEDULED").length,
    selected: applicants.filter((a) => a.status === "SELECTED").length,
    rejected: applicants.filter((a) => a.status === "REJECTED").length,
  };

  const emailCandidates = applicants.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    status: a.status,
    jobTitle: a.jobTitle,
  }));

  const scheduleCandidates = applicants
    .filter((a) => a.status === "SHORTLISTED" || a.status === "APPLIED")
    .map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      status: a.status,
      jobTitle: a.jobTitle,
    }));

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/startup/jobs">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-accent" />
                Applications
              </h1>
              <p className="text-muted-foreground text-sm">
                Frontend Developer • Job ID: {jobId || "101"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedIds([]);
                setEmailModalOpen(true);
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Bulk Email
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPreselectedForSchedule(undefined);
                setScheduleModalOpen(true);
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interviews
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Applied</p>
            <p className="text-2xl font-bold text-secondary-foreground">{stats.applied}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Shortlisted</p>
            <p className="text-2xl font-bold text-accent">{stats.shortlisted}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Interview</p>
            <p className="text-2xl font-bold text-warning">{stats.interview}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Accepted</p>
            <p className="text-2xl font-bold text-success">{stats.selected}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
          </Card>
        </div>

        {/* ATS Toggle */}
        <ATSToggle enabled={atsEnabled} onToggle={setAtsEnabled} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="table" className="gap-2">
              {atsEnabled ? <Bot className="h-4 w-4" /> : <Users className="h-4 w-4" />}
              {atsEnabled ? "ATS View" : "All Applicants"}
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <Hand className="h-4 w-4" />
              Manual Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-4">
            <ApplicantsTable
              applicants={atsEnabled ? [...applicants].sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0)) : applicants}
              atsEnabled={atsEnabled}
              selectedIds={selectedIds}
              onSelectChange={setSelectedIds}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onScheduleInterview={handleScheduleInterview}
              onSendEmail={handleSendEmail}
            />
          </TabsContent>

          <TabsContent value="manual">
            <ManualShortlistingPanel
              applicants={applicants}
              onStatusChange={handleStatusChange}
              onScheduleInterview={handleScheduleInterview}
              onSendEmail={handleSendEmail}
            />
          </TabsContent>
        </Tabs>

        {/* Applicant Details Modal */}
        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Applicant Details</DialogTitle>
            </DialogHeader>
            {selectedApplicant && (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-accent/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedApplicant.name}</h3>
                      <p className="text-muted-foreground">{selectedApplicant.email}</p>
                      <StatusBadge status={selectedApplicant.status} showIcon className="mt-1" />
                    </div>
                  </div>
                  {atsEnabled && selectedApplicant.atsScore !== undefined && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">ATS Score</p>
                      <p className="text-3xl font-bold text-accent">{selectedApplicant.atsScore}%</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Position</p>
                    <p className="font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-accent" />
                      {selectedApplicant.jobTitle}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Applied On</p>
                    <p className="font-medium">{selectedApplicant.appliedAt}</p>
                  </div>
                  {selectedApplicant.experience !== undefined && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="font-medium">{selectedApplicant.experience} years</p>
                    </div>
                  )}
                  {selectedApplicant.education && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Education</p>
                      <p className="font-medium flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-accent" />
                        {selectedApplicant.education}
                      </p>
                    </div>
                  )}
                </div>

                {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  {selectedApplicant.resumeUrl && (
                    <Button variant="outline" asChild>
                      <a href={selectedApplicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Resume
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => handleSendEmail(selectedApplicant)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" onClick={() => handleScheduleInterview(selectedApplicant)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                  <Button
                    className="bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => {
                      handleStatusChange(selectedApplicant.id, "SELECTED");
                      setDetailsModalOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      handleStatusChange(selectedApplicant.id, "REJECTED");
                      setDetailsModalOpen(false);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Bulk Email Modal */}
        <BulkEmailModal
          open={emailModalOpen}
          onOpenChange={setEmailModalOpen}
          candidates={emailCandidates}
          title="Send Email to Applicants"
          preselectedIds={selectedIds}
        />

        {/* Interview Schedule Modal */}
        <InterviewScheduleModal
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
          candidates={scheduleCandidates}
          preselectedId={preselectedForSchedule}
        />
      </div>
    </StartupLayout>
  );
}
