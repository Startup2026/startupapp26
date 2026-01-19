import { useState, useEffect } from "react";
import { Briefcase, Users, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { StartupLayout } from "@/components/layouts/StartupLayout";

/* ---------------- TYPES ---------------- */

type ApplicantStatus =
  | "Applied"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected";

interface Applicant {
  id: string;
  jobId: number; // ✅ ADD THIS
  name: string;
  email: string;
  role: string;
  appliedOn: string;
  skills: string[];
  resumeUrl: string;
  experience: number;
  education: string;
  status: ApplicantStatus;
}

interface Job {
  id: number;
  title: string;
  description: string;
  experienceRequired: string;
  educationRequired: string;
  skillsRequired: string[];
  applicants: Applicant[];
  postedOn: string;
  status: "Open" | "Closed";
}

/* ---------------- DATA ---------------- */

const skillsList = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "Python",
  "Java",
  "AWS",
  "Docker",
];

const hardcodedJobs: Job[] = [
  {
    id: 101,
    title: "Frontend Developer",
    description: "Looking for a React developer with strong UI skills.",
    experienceRequired: "1-3 years",
    educationRequired: "B.E / B.Tech",
    skillsRequired: ["React", "JavaScript", "CSS"],
    postedOn: "2025-01-10",
    status: "Open",
    applicants: [
      {
        id: "1",
        jobId: 101,
        name: "Amit Sharma",
        email: "amit@gmail.com",
        role: "Frontend Developer",
        appliedOn: "2025-01-12",
        skills: ["React", "JavaScript", "CSS"],
        resumeUrl: "/resumes/amit-sharma.pdf",
        experience: 2,
        education: "B.E Computer Engineering",
        status: "Applied",
      },
    ],
  },
];

/* ---------------- COMPONENT ---------------- */

export default function StartupJobDetail() {
  // const [jobs, setJobs] = useState<Job[]>([]);

  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem("startup_jobs");
    if (stored) return JSON.parse(stored);

    localStorage.setItem("startup_jobs", JSON.stringify(hardcodedJobs));
    return hardcodedJobs;
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editJob, setEditJob] = useState(false);

  const toggleJobStatus = (jobId: number) => {
    setJobs((prevJobs): Job[] => {
      const updatedJobs: Job[] = prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: job.status === "Open" ? "Closed" : "Open",
            }
          : job,
      );

      localStorage.setItem("startup_jobs", JSON.stringify(updatedJobs));
      return updatedJobs;
    });

    toast({
      title: "Job Status Updated",
      description: "Job position status changed",
    });
  };

  const handleStatusUpdate = (
    jobId: number,
    applicantId: string,
    status: ApplicantStatus,
  ) => {
    const updatedJobs = jobs.map((job) =>
      job.id !== jobId
        ? job
        : {
            ...job,
            applicants: job.applicants.map((a) =>
              a.id === applicantId ? { ...a, status } : a,
            ),
          },
    );

    setJobs(updatedJobs);
    localStorage.setItem("startup_jobs", JSON.stringify(updatedJobs));

    if (selectedApplicant) {
      setSelectedApplicant({ ...selectedApplicant, status });
    }

    toast({
      title: "Status Updated",
      description: `Applicant marked as ${status}`,
    });
  };

  /* -------- FILTER -------- */

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <StartupLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-accent" />
            Posted Jobs
          </h1>

          <div className="relative w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* JOB CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{job.title}</CardTitle>

                  <Badge
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleJobStatus(job.id);
                    }}
                    className={`cursor-pointer ${
                      job.status === "Open"
                        ? "bg-teal-500 text-white hover:bg-teal-600"
                        : "bg-gray-400 text-white hover:bg-gray-500"
                    }`}
                  >
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {job.skillsRequired.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  {job.applicants.length} Applicants
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={job.status === "Closed"}
                    onClick={() => setSelectedJob(job)}
                  >
                    View Applicants
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedJob(job);
                      setEditJob(true);
                    }}
                  >
                    Edit Post
                  </Button>
                </div>{" "}
              </CardContent>{" "}
            </Card>
          ))}{" "}
        </div>

        {/* APPLICANTS LIST */}
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJob?.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedJob?.applicants.map((a) => (
                <Card
                  key={a.id}
                  onClick={() => {
                    setSelectedApplicant({ ...a, jobId: selectedJob!.id });
                    setSelectedJob(null);
                  }}
                  className="cursor-pointer hover:bg-muted/40"
                >
                  <CardContent className="p-4 flex justify-between">
                    <div>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.email}</p>
                    </div>
                    {/* <Badge>{a.status}</Badge> */}

                    <Badge
                      className={
                        a.status === "Rejected"
                          ? "bg-red-500 text-white"
                          : "bg-teal-500 text-white"
                      }
                    >
                      {a.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* APPLICANT DETAIL MODAL */}
        <Dialog
          open={!!selectedApplicant}
          onOpenChange={() => setSelectedApplicant(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Applicant Details</DialogTitle>
            </DialogHeader>

            {selectedApplicant && (
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-semibold">
                    {selectedApplicant.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplicant.email}
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Role: {selectedApplicant.role}</span>
                  <span>Applied on: {selectedApplicant.appliedOn}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* <Badge>{selectedApplicant.status}</Badge> */}

                  <Badge
                    className={
                      selectedApplicant.status === "Rejected"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-teal-500 text-white hover:bg-teal-600"
                    }
                  >
                    {selectedApplicant.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Change Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {[
                        "Applied",
                        "Shortlisted",
                        "Interview Scheduled",
                        "Selected",
                        "Rejected",
                      ].map((s) => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() =>
                            handleStatusUpdate(
                              selectedApplicant.jobId,
                              selectedApplicant.id,
                              s as ApplicantStatus,
                            )
                          }
                        >
                          {s}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <p className="text-sm font-medium">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedApplicant.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p>Experience: {selectedApplicant.experience} years</p>
                <p>Education: {selectedApplicant.education}</p>

                <Button
                  asChild
                  className="outline bg-teal-500 text-white hover:bg-teal-600"
                >
                  <a
                    href={selectedApplicant.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </StartupLayout>
  );
}
