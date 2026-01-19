import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, Search, Eye, Plus, MoreVertical } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { CreateJobModal } from "@/components/startup/CreateJobModal";

/* ---------------- TYPES ---------------- */

interface Job {
  id: number;
  title: string;
  description: string;
  experienceRequired: string;
  educationRequired: string;
  skillsRequired: string[];
  applicantsCount: number;
  postedOn: string;
  status: "Open" | "Closed";
}

/* ---------------- MOCK DATA ---------------- */

const hardcodedJobs: Job[] = [
  {
    id: 101,
    title: "Frontend Developer",
    description: "Looking for a React developer with strong UI skills.",
    experienceRequired: "1-3 years",
    educationRequired: "B.E / B.Tech",
    skillsRequired: ["React", "JavaScript", "CSS"],
    applicantsCount: 5,
    postedOn: "2025-01-10",
    status: "Open",
  },
  {
    id: 102,
    title: "Backend Engineer",
    description: "Node.js developer needed for API development.",
    experienceRequired: "2-4 years",
    educationRequired: "B.Tech / MCA",
    skillsRequired: ["Node.js", "MongoDB", "Express"],
    applicantsCount: 3,
    postedOn: "2025-01-12",
    status: "Open",
  },
  {
    id: 103,
    title: "UI/UX Designer",
    description: "Creative designer for web and mobile interfaces.",
    experienceRequired: "1-2 years",
    educationRequired: "Any degree",
    skillsRequired: ["Figma", "Adobe XD", "Prototyping"],
    applicantsCount: 8,
    postedOn: "2025-01-08",
    status: "Closed",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function StartupJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    // Load from localStorage or use mock data
    const stored = localStorage.getItem("startup_jobs_list");
    if (stored) {
      setJobs(JSON.parse(stored));
    } else {
      setJobs(hardcodedJobs);
      localStorage.setItem("startup_jobs_list", JSON.stringify(hardcodedJobs));
    }
  }, []);

  const toggleJobStatus = (jobId: number) => {
    const updatedJobs: Job[] = jobs.map((job) =>
      job.id === jobId
        ? { ...job, status: (job.status === "Open" ? "Closed" : "Open") as "Open" | "Closed" }
        : job
    );
    setJobs(updatedJobs);
    localStorage.setItem("startup_jobs_list", JSON.stringify(updatedJobs));
    toast({
      title: "Job Status Updated",
      description: "Job position status changed.",
    });
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openJobs = jobs.filter((j) => j.status === "Open").length;
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantsCount, 0);

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-accent" />
              Job Posts
            </h1>
            <p className="text-muted-foreground mt-1">
              {openJobs} open positions • {totalApplicants} total applicants
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setCreateModalOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Briefcase className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Positions</p>
                <p className="text-2xl font-bold">{openJobs}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Applicants</p>
                <p className="text-2xl font-bold">{totalApplicants}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* JOB CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                      <DropdownMenuItem onClick={() => toggleJobStatus(job.id)}>
                        {job.status === "Open" ? "Close Position" : "Reopen Position"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Job</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Job</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {job.skillsRequired.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skillsRequired.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skillsRequired.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {job.applicantsCount} Applicants
                  </div>
                  <Badge
                    variant={job.status === "Open" ? "accent" : "muted"}
                    className="cursor-pointer"
                    onClick={() => toggleJobStatus(job.id)}
                  >
                    {job.status}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={job.status === "Closed"}
                    asChild
                  >
                    <Link to={`/startup/jobs/${job.id}/applications`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Applications
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No jobs found</p>
          </div>
        )}

        {/* Create Job Modal */}
        <CreateJobModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      </div>
    </StartupLayout>
  );
}
