import { useState, useEffect } from "react";
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
  Bot,
  Hand,
  Briefcase,
  User,
  GraduationCap,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { StatusBadge } from "@/components/startup/StatusBadge";
import { applicationService, Application } from "@/services/applicationService";
import { jobService, Job } from "@/services/jobService";
import { format } from "date-fns";

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const [atsEnabled, setAtsEnabled] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // Fetch Data
  const fetchData = async () => {
      try {
          if (!jobId) return;
          setLoading(true);

          // Fetch Job Details
          // Note: jobService.getJobById might return single job
          const jobRes = await jobService.getJobById(jobId);
          if (jobRes.success && jobRes.data) {
              setJobDetails(jobRes.data);
          }

          // Fetch Applications
          const appRes = await applicationService.getAllApplications();
          if (appRes.success && appRes.data) {
              const filteredApps = appRes.data.filter(app => {
                  const appId = typeof app.jobId === 'object' ? app.jobId._id : app.jobId;
                  return appId === jobId;
              });

              // Map to Applicant Interface
              const mappedApplicants: Applicant[] = filteredApps.map(app => {
                  // Safely access nested student info
                  const student = app.studentId as any; 
                  // If studentId is not populated (string), we have incomplete data. Handle gracefully.
                  // Fix: access firstName (camelCase) to match backend model
                  const fname = student?.firstName || student?.firstname;
                  const lname = student?.lastName || student?.lastname;
                  const name = fname ? `${fname} ${lname}` : "Unknown Student";
                  const email = student?.email || "No Email";
                  
                  // Resume fallback: Application specific > Student Profile > null
                  const resumeUrl = app.resumeUrl || student?.resumeUrl || null;
                  
                  return {
                      id: app._id,
                      name: name,
                      email: email,
                      jobTitle: (jobRes.success && jobRes.data) ? jobRes.data.role : "Job Role", // Use local data
                      resumeUrl: resumeUrl,
                      appliedAt: format(new Date(app.createdAt), "dd MMM yyyy"),
                      status: app.status as ApplicationStatus, // Ensure backend status matches UI enum or map it
                      atsScore: app.atsScore,
                      skills: student?.skills || [], 
                      experience: student?.experience?.length || 0, // Using count of exp entries as "years" approximation if not stored
                      education: student?.education?.[0]?.degree || "N/A"
                  };
              });

              setApplicants(mappedApplicants);
          }
      } catch (error) {
          console.error("Error loading applications:", error);
          toast({ title: "Error", description: "Failed to load data.", variant: "destructive" });
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]); 

  // Update effect to refresh when jobDetails changes (to fix jobTitle in list if fetched later)
  useEffect(() => {
     if(jobDetails && applicants.length > 0 && applicants[0].jobTitle !== jobDetails.role) {
         setApplicants(prev => prev.map(a => ({...a, jobTitle: jobDetails.role})));
     }
  }, [jobDetails]);


  const handleStatusChange = async (id: string, status: ApplicationStatus, notes?: string) => {
    // Optimistic Update
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );

    const res = await applicationService.updateApplication(id, { status });
    
    if (res.success) {
        toast({
            title: "Status Updated",
            description: `Application status changed to ${status.toLowerCase().replace("_", " ")}.`,
        });
    } else {
        // Revert
        fetchData();
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setDetailsModalOpen(true);
  };


  const handleSendEmail = (applicant: Applicant) => {
    setSelectedIds([applicant.id]);
    setEmailModalOpen(true);
  };

  const stats = {
    total: applicants.length,
    applied: applicants.filter((a) => a.status === "APPLIED").length,
    shortlisted: applicants.filter((a) => a.status === "SHORTLISTED").length,
    interview: applicants.filter((a) => a.status === "INTERVIEW_SCHEDULED").length, // Backend doesn't support this yet -> map to supported
    selected: applicants.filter((a) => a.status === "HIRED" || a.status === "SELECTED").length,
    rejected: applicants.filter((a) => a.status === "REJECTED").length,
  };

  const emailCandidates = applicants.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    status: a.status,
    jobTitle: a.jobTitle,
  }));


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
                {jobDetails ? jobDetails.role : "Loading Job..."}
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
          </div>
        </div>

        {/* Stats */}
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
          {/* Interview column commented out if not supported by backend yet, or mapped to SHORTLISTED */}
          {/* <Card className="p-4">
            <p className="text-sm text-muted-foreground">Interview</p>
            <p className="text-2xl font-bold text-warning">{stats.interview}</p>
          </Card> */}
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Selected</p>
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
              onSendEmail={handleSendEmail}
            />
          </TabsContent>

          <TabsContent value="manual">
            <ManualShortlistingPanel
              applicants={applicants}
              onStatusChange={handleStatusChange}
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
                      <a 
                        href={selectedApplicant.resumeUrl.startsWith('http') ? selectedApplicant.resumeUrl : `http://localhost:3000${selectedApplicant.resumeUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
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
                  <Button
                    className="bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => {
                      handleStatusChange(selectedApplicant.id, "HIRED" as ApplicationStatus);
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

      </div>
    </StartupLayout>
  );
}

