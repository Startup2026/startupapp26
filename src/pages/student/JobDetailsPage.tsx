import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, DollarSign, Building2, Clock, Briefcase, Calendar, 
  ArrowLeft, Bookmark, CheckCircle2, Gift, Tag as TagIcon
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { jobService } from "@/services/jobService";
import { Skeleton } from "@/components/ui/skeleton";
import { JobApplicationModal } from "@/components/student/JobApplicationModal";
import { apiFetch, getStoredUser } from "@/lib/api"; 
import { toast } from "@/hooks/use-toast";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const user = getStoredUser(); 
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isDeadlinePassed = (() => {
    if (!job?.deadline) return false;
    const deadlineDate = new Date(job.deadline);
    if (Number.isNaN(deadlineDate.getTime())) return false;
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate < new Date();
  })();

  // 1. Fetch Job Details (Calls /api/get-job/:id)
  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      try {
        const res = await jobService.getJobById(id);
        if (res.success) {
          setJob(res.data);
        } else {
           console.error("Failed to load job:", res.error);
        }
      } catch (err) {
        console.error("Error loading job details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  // 2. Check Save Status (Calls /api/save-job?studentId=...)
  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!user?._id || !id) return;

      try {
        const res = await apiFetch(`/save-job?studentId=${user._id}`, {
          method: 'GET',
          headers: { "Content-Type": "application/json" }
        });

        if (res.success && Array.isArray(res.data)) {
          const isJobAlreadySaved = res.data.some((savedItem: any) => 
            (savedItem.jobId?._id === id || savedItem.jobId === id)
          );
          setIsSaved(isJobAlreadySaved);
        }
      } catch (err) {
        console.error("Error checking save status:", err);
      }
    };

    checkSaveStatus();
  }, [id, user?._id]);

  // 3. Handle Save/Remove (Toggle)
  const handleSaveJob = async () => {
    if (!user?._id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save this job.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const endpoint = isSaved ? `/delete-saved-job/${id}` : `/save-job/${id}`;
      const method = isSaved ? "DELETE" : "POST";

      const res = await apiFetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user._id }),
      });

      if (res.success) {
        // SUCCESS: Toggle the state
        setIsSaved((prev) => !prev);
        
        toast({
          title: isSaved ? "Removed" : "Saved",
          description: isSaved
            ? "Job removed from your saved list."
            : "Job saved to your profile successfully.",
        });
      } else {
        // ERROR HANDLER
        if (res.error === 'Job already saved') {
             setIsSaved(true); // Force UI to 'Saved'
             toast({ title: "Already Saved", description: "This job is already in your list." });
        } else if (res.error === 'Saved job not found or already removed') {
             setIsSaved(false); // Force UI to 'Not Saved'
             toast({ title: "Removed", description: "Job was already removed." });
        } else {
             toast({
               title: "Error",
               description: res.error || "Action could not be completed.",
               variant: "destructive",
             });
        }
      }
    } catch (error) {
      console.error("Save/Remove error:", error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <StudentLayout>
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </StudentLayout>
  );

  if (!job) return (
    <StudentLayout>
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Job Not Found</h2>
        <Link to="/student/jobs" className="text-primary hover:underline mt-4 inline-block">
          Return to listings
        </Link>
      </div>
    </StudentLayout>
  );

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        <Link to="/student/jobs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Job Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="h-16 w-16 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent text-xl flex-shrink-0">
                    {job.startupId?.startupName?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary">{job.jobType}</Badge>
                      {job.Tag?.map((t: string, i: number) => (
                        <Badge key={i} variant="outline" className="bg-primary/5">{t}</Badge>
                      ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.role}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{job.startupId?.startupName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.startupId?.location?.city || "Remote"}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {job.stipend ? `₹${job.salary}` : "Unpaid"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Deadline: {job.deadline}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => setShowApplicationModal(true)}
                    disabled={isDeadlinePassed}
                  >
                    {isDeadlinePassed ? "Deadline Passed" : "Apply Now"}
                  </Button>
                  <Button 
                    variant={isSaved ? "secondary" : "outline"}
                    size="lg" 
                    onClick={handleSaveJob}
                    disabled={isSaving}
                    className={isSaved ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current text-primary" : ""}`} /> 
                    {isSaving ? "Updating..." : isSaved ? "Saved" : "Save Job"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>About the Role</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {job.aboutRole}
                </p>
              </CardContent>
            </Card>

            {job.Tag && job.Tag.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-5 w-5 text-primary" />
                    <CardTitle>Skills & Technologies</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {job.Tag.map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1">{tag}</Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {job.requirements && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <CardTitle>Requirements</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{job.requirements}</p>
                </CardContent>
              </Card>
            )}

            {job.perksAndBenifits && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <CardTitle>Perks & Benefits</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{job.perksAndBenifits}</p>
                </CardContent>
              </Card>
            )}

            {job.keyResponsibilities && (
              <Card>
                <CardHeader><CardTitle>Key Responsibilities</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{job.keyResponsibilities}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Quick Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>Openings</span>
                  </div>
                  <span className="font-semibold">{job.openings}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                  <span className="font-semibold">{job.startupId?.location?.city || "Remote"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <JobApplicationModal 
        open={showApplicationModal} 
        onOpenChange={setShowApplicationModal} 
        job={{
          id: job._id,
          title: job.role,
          company: job.startupId?.startupName || "Startup",
          deadline: job.deadline
        }} 
      />
    </StudentLayout>
  );
}