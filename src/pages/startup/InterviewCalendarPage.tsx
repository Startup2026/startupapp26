import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format, parse } from "date-fns";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { InterviewCalendar, Interview } from "@/components/startup/InterviewCalendar";
import { InterviewDetailPanel } from "@/components/startup/InterviewDetailPanel";
import { interviewService } from "@/services/interviewService";
import { toast } from "@/hooks/use-toast";

export default function InterviewCalendarPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getAllInterviews();
      if (res.success && res.data) {
        const mappedInterviews: Interview[] = res.data.map((item: any) => {
           const student = item.applicationId?.studentId;
           const job = item.applicationId?.jobId;
           
           // Ensure date is in clean yyyy-MM-dd format
           let dateStr = item.interviewDate || item.scheduleDate || "";
           if (dateStr.includes('T')) dateStr = dateStr.split('T')[0];
           if (dateStr.includes(' ')) dateStr = dateStr.split(' ')[0];
           if (!dateStr) dateStr = format(new Date(), "yyyy-MM-dd");

           return {
             id: item._id,
             candidateName: student ? `${student.firstName || student.firstname} ${student.lastName || student.lastname}` : "Unknown Candidate",
             candidateEmail: student?.email || "No Email",
             jobTitle: job?.role || "Unknown Role",
             jobId: job?._id || "",
             date: dateStr,
             time: item.interviewTime || "00:00",
             mode: (item.mode?.toLowerCase() as "online" | "offline") || "online",
             meetingLink: item.interviewLink || "",
             location: item.location || "",
             interviewer: item.interviewer || "Me",
             stage: "scheduled", // Default stage
             status: item.status || "scheduled",
             notes: item.notes || ""
           };
        });
        setInterviews(mappedInterviews);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load interviews", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleInterviewClick = (interview: Interview) => {
    setSelectedInterview(interview);
    setDetailPanelOpen(true);
  };

  const handleStatusChange = async (interviewId: string, status: Interview["status"]) => {
    try {
      const res = await interviewService.updateInterviewStatus(interviewId, status);
      if (res.success) {
        // Optimistic update
        setInterviews((prev) =>
          prev.map((interview) =>
            interview.id === interviewId ? { ...interview, status } : interview
          )
        );
        if (selectedInterview?.id === interviewId) {
          setSelectedInterview((prev) => (prev ? { ...prev, status } : null));
        }
        toast({ title: "Status Updated", description: `Interview status changed to ${status}` });
      } else {
        toast({ title: "Error", description: res.error || "Failed to update status", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  const handleRescheduleUpdate = (updatedInterview: Interview) => {
    // Refresh all data from server to be absolutely sure of positions
    fetchInterviews();
    
    if (selectedInterview?.id === updatedInterview.id) {
      setSelectedInterview(updatedInterview);
    }
  };

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
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Interview Calendar</h1>
              <p className="text-muted-foreground">
                View and manage all scheduled interviews
              </p>
            </div>
          </div>
        </div>

        {/* Interview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Today's Interviews</p>
            <p className="text-2xl font-bold text-accent">
              {interviews.filter((i) => i.date === format(new Date(), "yyyy-MM-dd")).length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">
              {interviews.filter((i) => {
                const date = parse(i.date, "yyyy-MM-dd", new Date());
                const today = new Date();
                const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 7);
                return date >= weekStart && date < weekEnd;
              }).length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-success">
              {interviews.filter((i) => i.status === "completed").length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">No Shows</p>
            <p className="text-2xl font-bold text-destructive">
              {interviews.filter((i) => i.status === "no-show").length}
            </p>
          </div>
        </div>

        {/* Calendar */}
        <InterviewCalendar
          interviews={interviews}
          onInterviewClick={handleInterviewClick}
        />

        {/* Detail Panel */}
        <InterviewDetailPanel
          interview={selectedInterview}
          open={detailPanelOpen}
          onOpenChange={setDetailPanelOpen}
          onStatusChange={handleStatusChange}
          onReschedule={handleRescheduleUpdate}
        />
      </div>
    </StartupLayout>
  );
}
