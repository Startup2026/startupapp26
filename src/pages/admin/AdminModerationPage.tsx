import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Check, Flag, Briefcase, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

type JobReport = {
  _id: string;
  reason: string;
  details?: string;
  status: "open" | "kept" | "removed";
  createdAt: string;
  adminNote?: string;
  jobId?: {
    _id?: string;
    role?: string;
    location?: string;
    jobType?: string;
    startupId?: {
      startupName?: string;
    };
  };
  reporterId?: {
    username?: string;
    email?: string;
  };
};

type ModerationStats = {
  openReports: number;
  keptReports: number;
  removedReports: number;
  totalReports: number;
};

export default function AdminModerationPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<JobReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingReportId, setActingReportId] = useState<string | null>(null);
  const [stats, setStats] = useState<ModerationStats>({
    openReports: 0,
    keptReports: 0,
    removedReports: 0,
    totalReports: 0,
  });

  const fetchModerationData = async () => {
    try {
      const [reportsRes, statsRes] = await Promise.all([
        apiFetch("/admin/moderation/jobs?status=all"),
        apiFetch("/admin/moderation/stats"),
      ]);

      if (reportsRes.success && Array.isArray(reportsRes.data)) {
        setReports(reportsRes.data);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch moderation data:", error);
      toast({
        title: "Failed to load moderation data",
        description: "Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationData();
    const intervalId = window.setInterval(fetchModerationData, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const openReports = useMemo(() => reports.filter((report) => report.status === "open"), [reports]);

  const handleReview = async (reportId: string, action: "keep" | "remove") => {
    setActingReportId(reportId);
    try {
      const response = await apiFetch(`/admin/moderation/jobs/${reportId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });

      if (!response.success) {
        toast({
          title: "Action failed",
          description: response.error || "Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: action === "keep" ? "Job kept" : "Job removed",
        description: action === "keep" ? "Report has been resolved." : "Job and linked reports were removed.",
      });

      fetchModerationData();
    } catch (error) {
      console.error("Moderation action failed:", error);
      toast({
        title: "Action failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setActingReportId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Moderation</h1>
          <p className="text-muted-foreground mt-1">Real-time review queue for reported jobs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Open Reports</p>
              <p className="text-2xl font-bold text-warning">{stats.openReports}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Kept</p>
              <p className="text-2xl font-bold">{stats.keptReports}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Removed</p>
              <p className="text-2xl font-bold text-success">{stats.removedReports}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold">{stats.totalReports}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[420px]">
            <TabsTrigger value="jobs">Reported Jobs ({openReports.length})</TabsTrigger>
            <TabsTrigger value="posts">Reported Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-6 space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-8 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </CardContent>
              </Card>
            ) : openReports.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Check className="h-10 w-10 mx-auto mb-3 text-success" />
                  <p>All clear. No open job reports.</p>
                </CardContent>
              </Card>
            ) : (
              openReports.map((item) => (
                <Card key={item._id} className="border-l-4 border-l-warning">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      {item.jobId?.role || "Job"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-warning border-warning/30">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {item.reason}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Startup: <span className="font-medium text-foreground">{item.jobId?.startupId?.startupName || "Unknown"}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Reported by: <span className="font-medium text-foreground">{item.reporterId?.username || item.reporterId?.email || "User"}</span>
                    </p>
                    {item.details ? (
                      <p className="text-sm bg-muted/40 border rounded-md p-3">{item.details}</p>
                    ) : null}

                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        className="text-success hover:text-success"
                        disabled={actingReportId === item._id}
                        onClick={() => handleReview(item._id, "keep")}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Keep Job
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={actingReportId === item._id}
                        onClick={() => handleReview(item._id, "remove")}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Job
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="posts" className="mt-6">
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <Flag className="h-10 w-10 mx-auto mb-3 opacity-60" />
                <p>Post moderation is not enabled yet. Job moderation is live now.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
