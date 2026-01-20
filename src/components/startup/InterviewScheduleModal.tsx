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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, Video, MapPin, Loader2 } from "lucide-react";
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

interface InterviewScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: Candidate[];
  preselectedId?: string;
}

export function InterviewScheduleModal({
  open,
  onOpenChange,
  candidates,
  preselectedId,
}: InterviewScheduleModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    preselectedId ? [preselectedId] : []
  );
  const [isCommonSchedule, setIsCommonSchedule] = useState(true);
  const [schedule, setSchedule] = useState({
    date: "",
    time: "",
    mode: "online" as "online" | "offline",
    location: "",
    interviewer: "",
    notes: "",
  });
  const [scheduling, setScheduling] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedIds(preselectedId ? [preselectedId] : []);
      setSchedule({
        date: "",
        time: "",
        mode: "online",
        location: "",
        interviewer: "",
        notes: "",
      });
    }
  }, [open, preselectedId]);

  const handleSchedule = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "No Candidates Selected",
        description: "Please select at least one candidate.",
        variant: "destructive",
      });
      return;
    }

    if (!schedule.date || !schedule.time) {
      toast({
        title: "Missing Details",
        description: "Please provide date and time.",
        variant: "destructive",
      });
      return;
    }

    setScheduling(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setScheduling(false);
    toast({
      title: "Interview Scheduled",
      description: `Scheduled ${selectedIds.length} interview(s). Email notifications sent.`,
    });

    onOpenChange(false);
  };

  // Convert candidates to selectable format
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
            <Calendar className="h-5 w-5 text-accent" />
            Schedule Interview
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Schedule Type Toggle */}
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isCommonSchedule}
                onCheckedChange={(checked) => setIsCommonSchedule(!!checked)}
                id="common-schedule"
              />
              <label
                htmlFor="common-schedule"
                className="text-sm font-medium cursor-pointer"
              >
                Common schedule for all selected candidates
              </label>
            </div>
          </div>

          {/* Candidate Selection Table */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Candidates</Label>
            <ApplicantSelectionTable
              candidates={selectableCandidates}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              showStatus={true}
              maxHeight="200px"
            />
          </div>

          {/* Schedule Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Date
              </Label>
              <Input
                type="date"
                value={schedule.date}
                onChange={(e) =>
                  setSchedule({ ...schedule, date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Time
              </Label>
              <Input
                type="time"
                value={schedule.time}
                onChange={(e) =>
                  setSchedule({ ...schedule, time: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Interview Mode</Label>
              <Select
                value={schedule.mode}
                onValueChange={(value: "online" | "offline") =>
                  setSchedule({ ...schedule, mode: value })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  <SelectItem value="online">
                    <span className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Online
                    </span>
                  </SelectItem>
                  <SelectItem value="offline">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      In-Person
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Interviewer</Label>
              <Input
                value={schedule.interviewer}
                onChange={(e) =>
                  setSchedule({ ...schedule, interviewer: e.target.value })
                }
                placeholder="Interviewer name"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label>
                {schedule.mode === "online" ? "Meeting Link" : "Location"}
              </Label>
              <Input
                value={schedule.location}
                onChange={(e) =>
                  setSchedule({ ...schedule, location: e.target.value })
                }
                placeholder={
                  schedule.mode === "online"
                    ? "https://meet.google.com/..."
                    : "Office address"
                }
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label>Notes / Instructions</Label>
              <Textarea
                value={schedule.notes}
                onChange={(e) =>
                  setSchedule({ ...schedule, notes: e.target.value })
                }
                placeholder="Additional instructions for the candidate..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Schedule Button */}
        <div className="pt-4 border-t mt-4">
          <Button
            onClick={handleSchedule}
            disabled={
              scheduling ||
              selectedIds.length === 0 ||
              !schedule.date ||
              !schedule.time
            }
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {scheduling ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule {selectedIds.length} Interview
                {selectedIds.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
