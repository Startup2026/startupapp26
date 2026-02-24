import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Video, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  jobId: string;
  date: string;
  time: string;
  mode: "online" | "offline";
  location?: string;
  meetingLink?: string;
  interviewer: string;
  stage: "screening" | "technical" | "hr" | "final";
  status: "scheduled" | "completed" | "no-show" | "cancelled";
  notes?: string;
}

interface InterviewCalendarProps {
  interviews: Interview[];
  onInterviewClick: (interview: Interview) => void;
}

const stageLabels: Record<string, string> = {
  screening: "Screening",
  technical: "Technical",
  hr: "HR Round",
  final: "Final",
};

const statusColors: Record<string, string> = {
  scheduled: "bg-accent text-accent-foreground",
  completed: "bg-success text-success-foreground",
  "no-show": "bg-destructive text-destructive-foreground",
  cancelled: "bg-muted text-muted-foreground",
};

export function InterviewCalendar({ interviews, onInterviewClick }: InterviewCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [filters, setFilters] = useState({
    jobId: "all",
    stage: "all",
    interviewer: "all",
  });

  // Get unique values for filters
  const jobOptions = useMemo(() => {
    const jobs = [...new Set(interviews.map((i) => JSON.stringify({ id: i.jobId, title: i.jobTitle })))];
    return jobs.map((j) => JSON.parse(j) as { id: string; title: string });
  }, [interviews]);

  const interviewerOptions = useMemo(() => {
    return [...new Set(interviews.map((i) => i.interviewer))];
  }, [interviews]);

  // Filter interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      if (filters.jobId !== "all" && interview.jobId !== filters.jobId) return false;
      if (filters.stage !== "all" && interview.stage !== filters.stage) return false;
      if (filters.interviewer !== "all" && interview.interviewer !== filters.interviewer) return false;
      return true;
    });
  }, [interviews, filters]);

  // Get interviews for a specific day
  const getInterviewsForDay = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return filteredInterviews.filter((interview) => interview.date === dateStr);
  };

  // Navigation handlers
  const navigatePrev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, -1));
  };

  const navigateNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const goToToday = () => setCurrentDate(new Date());

  // Render month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
      const dayInterviews = getInterviewsForDay(day);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());
      const currentDay = day;

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "min-h-[120px] border-b border-r border-border p-1 md:p-2 transition-colors",
            !isCurrentMonth && "bg-muted/30",
            isToday && "bg-accent/5"
          )}
        >
          <div
            className={cn(
              "text-sm font-medium mb-1",
              !isCurrentMonth && "text-muted-foreground",
              isToday && "text-accent"
            )}
          >
            <span
              className={cn(
                "inline-flex items-center justify-center w-6 h-6 rounded-full",
                isToday && "bg-accent text-accent-foreground"
              )}
            >
              {format(day, "d")}
            </span>
          </div>
          <div className="space-y-1 overflow-hidden">
            {dayInterviews.slice(0, 3).map((interview) => (
              <button
                key={interview.id}
                onClick={() => onInterviewClick(interview)}
                className={cn(
                  "w-full text-left text-xs p-1 rounded truncate transition-all hover:scale-[1.02]",
                  interview.mode === "online" ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"
                )}
              >
                <span className="font-medium">{interview.time}</span> {interview.candidateName}
              </button>
            ))}
            {dayInterviews.length > 3 && (
              <button
                onClick={() => {
                  setCurrentDate(currentDay);
                  setView("day");
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                +{dayInterviews.length - 3} more
              </button>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 border-l border-t border-border bg-card rounded-lg overflow-hidden">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName) => (
          <div
            key={dayName}
            className="p-2 text-center text-sm font-medium bg-muted/50 border-b border-r border-border"
          >
            <span className="hidden md:inline">{dayName}</span>
            <span className="md:hidden">{dayName.charAt(0)}</span>
          </div>
        ))}
        {days}
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-8 border-b border-border">
          <div className="p-2 text-center text-sm font-medium bg-muted/50" />
          {days.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "p-2 text-center border-l border-border bg-muted/50",
                isSameDay(day, new Date()) && "bg-accent/10"
              )}
            >
              <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
              <div
                className={cn(
                  "text-lg font-medium",
                  isSameDay(day, new Date()) && "text-accent"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-border last:border-b-0">
              <div className="p-2 text-xs text-muted-foreground text-right pr-3 bg-muted/20">
                {format(new Date().setHours(hour, 0), "h a")}
              </div>
              {days.map((day) => {
                const dayInterviews = getInterviewsForDay(day).filter((i) => {
                  const interviewHour = parseInt(i.time.split(":")[0]);
                  return interviewHour === hour;
                });

                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "min-h-[60px] p-1 border-l border-border",
                      isSameDay(day, new Date()) && "bg-accent/5"
                    )}
                  >
                    {dayInterviews.map((interview) => (
                      <button
                        key={interview.id}
                        onClick={() => onInterviewClick(interview)}
                        className={cn(
                          "w-full text-left text-xs p-1.5 rounded mb-1 transition-all hover:scale-[1.02]",
                          interview.mode === "online"
                            ? "bg-accent/20 text-accent border border-accent/30"
                            : "bg-primary/10 text-primary border border-primary/30"
                        )}
                      >
                        <div className="font-medium truncate">{interview.candidateName}</div>
                        <div className="truncate opacity-80">{interview.jobTitle}</div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const dayInterviews = getInterviewsForDay(currentDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="text-lg font-semibold">{format(currentDate, "EEEE, MMMM d, yyyy")}</div>
          <div className="text-sm text-muted-foreground">{dayInterviews.length} interviews scheduled</div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {hours.map((hour) => {
            const hourInterviews = dayInterviews.filter((i) => {
              const interviewHour = parseInt(i.time.split(":")[0]);
              return interviewHour === hour;
            });

            return (
              <div key={hour} className="flex border-b border-border last:border-b-0">
                <div className="w-20 p-3 text-sm text-muted-foreground text-right bg-muted/20 shrink-0">
                  {format(new Date().setHours(hour, 0), "h:mm a")}
                </div>
                <div className="flex-1 p-2 min-h-[70px]">
                  {hourInterviews.map((interview) => (
                    <button
                      key={interview.id}
                      onClick={() => onInterviewClick(interview)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg mb-2 transition-all hover:scale-[1.01] hover:shadow-md",
                        interview.mode === "online"
                          ? "bg-accent/10 border border-accent/30"
                          : "bg-primary/5 border border-primary/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{interview.candidateName}</div>
                          <div className="text-sm text-muted-foreground">{interview.jobTitle}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {interview.mode === "online" ? (
                            <Video className="h-4 w-4 text-accent" />
                          ) : (
                            <MapPin className="h-4 w-4 text-primary" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {stageLabels[interview.stage]}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{interview.time}</span>
                        <span>•</span>
                        <span>{interview.interviewer}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with navigation and filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={goToToday} className="text-sm">
            Today
          </Button>
          <h2 className="text-xl font-semibold ml-2">
            {view === "day"
              ? format(currentDate, "MMMM d, yyyy")
              : view === "week"
              ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} - ${format(
                  addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6),
                  "MMM d, yyyy"
                )}`
              : format(currentDate, "MMMM yyyy")}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Post</label>
                  <Select
                    value={filters.jobId}
                    onValueChange={(value) => setFilters({ ...filters, jobId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Jobs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      {jobOptions.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Stage</label>
                  <Select
                    value={filters.stage}
                    onValueChange={(value) => setFilters({ ...filters, stage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Stages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="hr">HR Round</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interviewer</label>
                  <Select
                    value={filters.interviewer}
                    onValueChange={(value) => setFilters({ ...filters, interviewer: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Interviewers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Interviewers</SelectItem>
                      {interviewerOptions.map((interviewer) => (
                        <SelectItem key={interviewer} value={interviewer}>
                          {interviewer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setFilters({ jobId: "all", stage: "all", interviewer: "all" })}
                >
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* View toggle */}
          <div className="flex rounded-lg border border-border bg-muted/50 p-0.5">
            {(["day", "week", "month"] as const).map((v) => (
              <Button
                key={v}
                variant={view === v ? "default" : "ghost"}
                size="sm"
                onClick={() => setView(v)}
                className={cn("capitalize", view === v && "shadow-sm")}
              >
                {v}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}
    </div>
  );
}
