import { useState, useEffect } from "react";
import { format, parseISO, parse } from "date-fns";
import { X, Video, MapPin, Mail, Calendar, Clock, User, Briefcase, FileText, ExternalLink, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Interview } from "./InterviewCalendar";
import { interviewService } from "@/services/interviewService";
import { toast } from "@/hooks/use-toast";

interface InterviewDetailPanelProps {
  interview: Interview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (interviewId: string, status: Interview["status"]) => void;
  onReschedule?: (interview: Interview) => void;
}

const stageLabels: Record<string, string> = {
  screening: "Screening",
  technical: "Technical",
  hr: "HR Round",
  final: "Final",
};

const stageColors: Record<string, string> = {
  screening: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  technical: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  hr: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  final: "bg-accent/10 text-accent border-accent/30",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Scheduled", color: "bg-accent text-accent-foreground" },
  completed: { label: "Completed", color: "bg-success text-success-foreground" },
  "no-show": { label: "No Show", color: "bg-destructive text-destructive-foreground" },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground" },
};

export function InterviewDetailPanel({
  interview,
  open,
  onOpenChange,
  onStatusChange,
  onReschedule,
}: InterviewDetailPanelProps) {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (interview) {
      setRescheduleData({
        date: interview.date,
        time: interview.time,
      });
      setIsRescheduling(false);
    }
  }, [interview]);

  if (!interview) return null;

  const handleReschedule = async () => {
    try {
      setLoading(true);
      const res = await interviewService.rescheduleInterview(interview.id, {
        interviewDate: rescheduleData.date,
        interviewTime: rescheduleData.time,
      });

      if (res.success) {
        toast({ title: "Success", description: "Interview rescheduled successfully" });
        setIsRescheduling(false);
        if (onReschedule) {
          onReschedule({
            ...interview,
            date: rescheduleData.date,
            time: rescheduleData.time,
          });
        }
      } else {
        toast({ title: "Error", description: res.error || "Failed to reschedule", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-xl">{interview.candidateName}</SheetTitle>
              <p className="text-sm text-muted-foreground">{interview.candidateEmail}</p>
            </div>
            <Badge className={cn("shrink-0", statusConfig[interview.status].color)}>
              {statusConfig[interview.status].label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Interview Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Interview Details
            </h3>
            
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  {isRescheduling ? (
                    <div className="space-y-1">
                      <Input
                        type="date"
                        value={rescheduleData.date}
                        onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                        className="h-8 py-1"
                      />
                      <p className="text-xs text-muted-foreground">Select New Date</p>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">
                        {format(parse(interview.date, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">Date</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                   {isRescheduling ? (
                    <div className="space-y-1">
                      <Input
                        type="time"
                        value={rescheduleData.time}
                        onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                        className="h-8 py-1"
                      />
                      <p className="text-xs text-muted-foreground">Select New Time</p>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">{interview.time}</p>
                      <p className="text-sm text-muted-foreground">Time</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  {interview.mode === "online" ? (
                    <Video className="h-5 w-5 text-accent" />
                  ) : (
                    <MapPin className="h-5 w-5 text-accent" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">{interview.mode}</p>
                  <p className="text-sm text-muted-foreground">
                    {interview.mode === "online" ? interview.meetingLink : interview.location}
                  </p>
                </div>
                {interview.mode === "online" && interview.meetingLink && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                      Join <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">{interview.interviewer}</p>
                  <p className="text-sm text-muted-foreground">Interviewer</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Job Details
            </h3>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{interview.jobTitle}</p>
                <p className="text-sm text-muted-foreground">Position</p>
              </div>
              <Badge variant="outline" className={cn("border", stageColors[interview.stage])}>
                {stageLabels[interview.stage]}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          {interview.notes && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Notes / Instructions
                </h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm">{interview.notes}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Update Status */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            {isRescheduling ? (
               <>
                <Button 
                  variant="outline" 
                   className="gap-2"
                   onClick={() => setIsRescheduling(false)}
                   disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                   className="gap-2"
                   onClick={handleReschedule}
                   disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                  {!loading && <Save className="h-4 w-4" />}
                </Button>
              </>
            ) : (
              <>
                <div className="col-span-1">
                   <p className="text-xs text-muted-foreground mb-2 px-1">Update Status</p>
                    <Select
                      value={interview.status}
                      onValueChange={(value) => onStatusChange?.(interview.id, value as Interview["status"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="no-show">No Show</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="col-span-1 flex items-end">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => setIsRescheduling(true)}
                    >
                      <Calendar className="h-4 w-4" />
                      Reschedule
                    </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
