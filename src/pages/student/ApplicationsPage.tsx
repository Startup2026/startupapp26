import { useState, useEffect } from "react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useSocket } from "@/contexts/SocketContext";
import { useToast } from "@/hooks/use-toast";

type ApplicationStatus = "applied" | "shortlisted" | "rejected" | "selected" | "interview" | "all";

interface Application {
  _id: string;
  jobId: {
    _id: string;
    role: string;
    jobType: string;
    location?: string;
    startupId: {
      startupName: string;
      profilepic: string;
      location: { city: string; country: string };
    };
  };
  studentId: string;
  atsScore: number;
  status: string; // "APPLIED", "SHORTLISTED", "REJECTED"
  statusVisible?: boolean; // New field from backend
  createdAt: string;
}

const statusConfig: any = {
  applied: {
    label: "Applied",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: Clock,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-accent/10 text-accent border-accent/20",
    icon: CheckCircle2,
  },
  interview: {
    label: "Interview",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: Calendar,
  },
  selected: {
    label: "Selected",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
};

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (!socket) return;

    // Listen for application status updates
    const handleStatusUpdate = (data: { applicationId: string, status: string, jobRole?: string, company?: string }) => {
        console.log("Status update received:", data);
        setApplications(prev => prev.map(app => {
            if (app._id === data.applicationId) {
                return { ...app, status: data.status };
            }
            return app;
        }));

        toast({
            title: "Application Updated",
            description: `Your application for ${data.jobRole || 'a job'} at ${data.company || 'a company'} has been updated to ${data.status}.`,
        });
    };

    socket.on("applicationStatusUpdated", handleStatusUpdate);

    return () => {
        socket.off("applicationStatusUpdated", handleStatusUpdate);
    };
  }, [socket, toast]);

  useEffect(() => {
    const fetchApplications = async () => {
      const user = getStoredUser();
      if (!user?._id) return;
      
      try {
        const res = await apiFetch(`/applications/student/${user._id}`);
        if (res.success && Array.isArray(res.data)) {
          console.log("Fetched applications:", res.data);
          setApplications(res.data);
        }
      } catch (error) {
        console.error("Failed to load applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const jobTitle = app?.jobId?.role || "Unknown Role";
    const company = app?.jobId?.startupId?.startupName || "Unknown Company";
    
    // Check visibility logic: If status is not visible to student, show as 'applied'
    // We check statusVisible (explicit flag) OR fallback to isNotified (if present) OR if actual status is APPLIED
    const isVisible = app.statusVisible || (app as any).isNotified || app.status === "APPLIED";
    const effectiveStatus = isVisible ? app.status : "APPLIED";

    // Normalize status from backend (UPPERCASE) to frontend (lowercase) for filtering
    let appStatus = effectiveStatus ? effectiveStatus.toLowerCase() : "applied";
    if (effectiveStatus?.toUpperCase() === "INTERVIEW_SCHEDULED") appStatus = "interview";
    if (effectiveStatus?.toUpperCase() === "SELECTED" || effectiveStatus?.toUpperCase() === "HIRED") appStatus = "selected";

    const matchesSearch =
      jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || appStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusKey = (status: string, isVisible: boolean = true) => {
    // If not visible and not 'APPLIED', force to 'applied' key
    if (!isVisible && status !== "APPLIED") return "applied";
    
    if (!status) return "applied";
    if (status.toUpperCase() === "INTERVIEW_SCHEDULED") return "interview";
    if (status.toUpperCase() === "SELECTED" || status.toUpperCase() === "HIRED") return "selected";
    return status.toLowerCase();
  };

  const statusCounts = {
    all: applications.length,
    applied: applications.filter((a) => {
      const isVisible = a.statusVisible || (a as any).isNotified || a.status === "APPLIED";
      const status = isVisible ? a.status : "APPLIED";
      return !status || status.toUpperCase() === "APPLIED";
    }).length,
    shortlisted: applications.filter((a) => {
       const isVisible = a.statusVisible || (a as any).isNotified || a.status === "APPLIED";
       return isVisible && a.status && a.status.toUpperCase() === "SHORTLISTED";
    }).length,
    interview: applications.filter((a) => {
       const isVisible = a.statusVisible || (a as any).isNotified || a.status === "APPLIED";
       return isVisible && a.status && a.status.toUpperCase() === "INTERVIEW_SCHEDULED";
    }).length,
    selected: applications.filter((a) => {
       const isVisible = a.statusVisible || (a as any).isNotified || a.status === "APPLIED";
       return isVisible && a.status && ["SELECTED", "HIRED"].includes(a.status.toUpperCase());
    }).length,
    rejected: applications.filter((a) => {
       const isVisible = a.statusVisible || (a as any).isNotified || a.status === "APPLIED";
       return isVisible && a.status && a.status.toUpperCase() === "REJECTED";
    }).length,
  };

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            My Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(["all", "applied", "shortlisted", "interview", "selected", "rejected"] as const).map((status) => {
            const isActive = statusFilter === status;
            const config = status === "all" ? null : statusConfig[status];
            
            return (
              <Card
                key={status}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isActive ? "ring-2 ring-accent" : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {status === "all" ? "Total" : status}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {statusCounts[status]}
                      </p>
                    </div>
                    {config ? (
                      <config.icon className={`h-8 w-8 ${
                        status === "applied" ? "text-blue-400" :
                        status === "shortlisted" ? "text-accent" : 
                        status === "selected" ? "text-green-400" :
                        status === "interview" ? "text-purple-400" :
                        "text-destructive"
                      }`} />
                    ) : (
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ApplicationStatus)}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="grid gap-4">
          {loading ? (
             Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No applications found matching your criteria.
            </div>
          ) : (
            filteredApplications.map((app) => {
              const isStatusVisible = app.statusVisible || (app as any).isNotified || app.status === "APPLIED";
              const effectiveStatus = isStatusVisible ? app.status : "APPLIED";
              const statusKey = getStatusKey(effectiveStatus, true); // effectiveStatus is already filtered, pass true
              const config = statusConfig[statusKey] || statusConfig['applied'];
              
              return (
              <Card key={app._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Company Logo */}
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-lg font-bold text-accent shrink-0">
                      {app.jobId?.startupId?.profilepic ? (
                          <img src={app.jobId.startupId.profilepic} alt="Logo" className="rounded-lg object-cover h-12 w-12" />
                      ) : (
                          app.jobId?.startupId?.startupName?.[0] || 'C'
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 text-center lg:text-left space-y-1">
                      <h3 className="font-semibold text-lg">{app.jobId?.role}</h3>
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground">
                        <span className="font-medium text-foreground">{app.jobId?.startupId?.startupName}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{app.jobId?.startupId?.location?.city || "Remote"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Date */}
                    <div className="flex flex-col items-center lg:items-end gap-2">
                       <Badge variant="outline" className={`${config.color} border`}>
                        <div className="flex items-center gap-1.5">
                          {config.icon && <config.icon className="h-3 w-3" />}
                          {config.label}
                        </div>
                      </Badge>
                      {app.resumeUrl && (
                        <Button variant="link" size="sm" className="h-auto p-0 text-accent" asChild>
                          <a 
                            href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `http://localhost:3000${app.resumeUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View Applied Resume
                          </a>
                        </Button>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )})
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
