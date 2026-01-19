import { useState } from "react";
import {
  MoreVertical,
  Search,
  User,
  Briefcase,
  Calendar,
  FileText,
  GraduationCap,
  Clock,
} from "lucide-react";

import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

/* ---------------- Types ---------------- */

type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "REJECTED"
  | "INTERVIEW_SCHEDULED"
  | "SELECTED";

interface Application {
  _id: string;
  jobId: string;
  studentId: string;

  candidateName: string;
  candidateEmail: string;

  jobTitle: string;
  skills: string[];

  appliedAt: string; // createdAt
  status: ApplicationStatus;

  atsScore: number;
  experience: number;
  education: string;

  resumeUrl: string | null;
}

const initialApplications: Application[] = [
  {
    _id: "1",
    jobId: "job123",
    studentId: "stu123",
    candidateName: "Amit Sharma",
    candidateEmail: "amit@gmail.com",
    jobTitle: "Frontend Developer",
    skills: ["React", "TypeScript", "Tailwind"],
    appliedAt: "12 Jan 2026",
    status: "APPLIED",
    atsScore: 78,
    experience: 2,
    education: "B.E. Computer Engineering",
    resumeUrl: "/resume/amit.pdf",
  },
  {
    _id: "2",
    jobId: "job124",
    studentId: "stu124",
    candidateName: "Neha Patil",
    candidateEmail: "neha@gmail.com",
    jobTitle: "Backend Engineer",
    skills: ["Node.js", "MongoDB", "Express"],
    appliedAt: "13 Jan 2026",
    status: "SHORTLISTED",
    atsScore: 85,
    experience: 3,
    education: "B.Tech IT",
    resumeUrl: "/resume/neha.pdf",
  },
];

/* ---------------- Page ---------------- */

export default function StartupApplicants() {
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);

  const updateStatus = (_id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a._id === _id ? { ...a, status } : a)),
    );

    toast({
      title: "Status Updated",
      description: `Applicant marked as ${status.replace("_", " ")}`,
    });
  };

  const filteredApplications = applications.filter((a) => {
    const matchSearch =
      a.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-7 w-7 text-teal-600" />
            Applications
          </h1>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidate or job..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                <SelectItem value="INTERVIEW_SCHEDULED">
                  Interview Scheduled
                </SelectItem>
                <SelectItem value="SELECTED">Selected</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <Card
              key={app._id}
              onClick={() => setSelectedApplicant(app)}
              className="cursor-pointer hover:border-teal-500 transition"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{app.candidateName}</CardTitle>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => updateStatus(app._id, "APPLIED")}
                      >
                        Mark Applied
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => updateStatus(app._id, "SHORTLISTED")}
                      >
                        Shortlist
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          updateStatus(app._id, "INTERVIEW_SCHEDULED")
                        }
                      >
                        Schedule Interview
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => updateStatus(app._id, "SELECTED")}
                      >
                        Select Candidate
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => updateStatus(app._id, "REJECTED")}
                      >
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {app.jobTitle}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Applied on {app.appliedAt}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {app.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-[10px]"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Badge
                  className={
                    app.status === "SHORTLISTED"
                      ? "bg-teal-400 text-white"
                      : app.status === "INTERVIEW_SCHEDULED"
                        ? "bg-teal-600 text-white"
                        : app.status === "SELECTED"
                          ? "bg-teal-800 text-white"
                          : app.status === "REJECTED"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-secondary text-secondary-foreground"
                  }
                >
                  {app.status.replace("_", " ")}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={!!selectedApplicant}
        onOpenChange={() => setSelectedApplicant(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedApplicant && (
            <>
              <DialogHeader>
                <DialogTitle>Applicant Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedApplicant.candidateName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplicant.jobTitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {selectedApplicant.experience} years experience
                  </div>

                  <div className="flex gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    {selectedApplicant.education}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Button
                  asChild
                  className="bg-teal-500 text-white hover:bg-teal-600"
                >
                  <a href={selectedApplicant.resumeUrl} target="_blank">
                    <FileText className="h-4 w-4 mr-2 text-white" />
                    View Resume
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </StartupLayout>
  );
}
