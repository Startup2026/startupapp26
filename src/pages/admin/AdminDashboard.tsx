import { useEffect, useMemo, useState } from "react";
import { Users, Building2, Briefcase, Activity, IndianRupee, ShieldAlert, UserRoundCheck, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

type RevenueSummary = {
  platformShare?: number;
  netRevenue?: number;
  incubatorShare?: number;
  gatewayFees?: number;
};

type DashboardSummary = {
  totals: {
    totalUsers: number;
    totalStudents: number;
    totalStartups: number;
    totalJobs: number;
    openReports: number;
    pendingVerificationsCount: number;
  };
  recentActivity: Array<{
    type: string;
    action: string;
    entity: string;
    createdAt: string;
    status?: string;
  }>;
  pendingVerifications: Array<{
    _id: string;
    companyName?: string;
    companyType?: string;
    status?: string;
    createdAt: string;
  }>;
};

export default function AdminDashboard() {
  const [revenueStats, setRevenueStats] = useState<RevenueSummary>({});
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"summary" | "fallback">("summary");

  const fetchDashboardData = async () => {
    try {
      const [revenueRes, summaryRes] = await Promise.all([
        apiFetch("/payment/admin/revenue-summary"),
        apiFetch("/admin/dashboard/summary"),
      ]);

      if (revenueRes.success && revenueRes.data) {
        setRevenueStats(revenueRes.data);
      }

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
        setDataSource("summary");
      } else {
        const [usersRes, startupsRes, jobsRes, moderationStatsRes] = await Promise.all([
          apiFetch("/users"),
          apiFetch("/startupProfiles"),
          apiFetch("/get-all-jobs"),
          apiFetch("/admin/moderation/stats"),
        ]);

        const users = usersRes.success && Array.isArray(usersRes.data) ? usersRes.data : [];
        const startups = startupsRes.success && Array.isArray(startupsRes.data) ? startupsRes.data : [];
        const jobs = jobsRes.success && Array.isArray(jobsRes.data) ? jobsRes.data : [];

        setSummary({
          totals: {
            totalUsers: users.length,
            totalStudents: users.filter((u: any) => u?.role === "student").length,
            totalStartups: startups.length,
            totalJobs: jobs.length,
            openReports: moderationStatsRes.success ? (moderationStatsRes.data?.openReports || 0) : 0,
            pendingVerificationsCount: 0,
          },
          recentActivity: [],
          pendingVerifications: [],
        });
        setDataSource("fallback");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = window.setInterval(fetchDashboardData, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const stats = useMemo(() => {
    const totals = summary?.totals;
    return [
      {
        label: "Wostup Platform Revenue",
        value: `₹${(revenueStats.platformShare || 0).toLocaleString()}`,
        subtext: "After 2% fee & 10% incubation",
        icon: IndianRupee,
        color: "bg-primary/10 text-primary",
      },
      {
        label: "Total Startup Revenue (Net)",
        value: `₹${(revenueStats.netRevenue || 0).toLocaleString()}`,
        subtext: "Net platform transactions",
        icon: Activity,
        color: "bg-success/10 text-success",
      },
      {
        label: "Total Users",
        value: (totals?.totalUsers || 0).toLocaleString(),
        subtext: `${(totals?.totalStudents || 0).toLocaleString()} students`,
        icon: Users,
        color: "bg-accent/10 text-accent",
      },
      {
        label: "Active Jobs",
        value: (totals?.totalJobs || 0).toLocaleString(),
        subtext: `${(totals?.openReports || 0).toLocaleString()} reported`,
        icon: Briefcase,
        color: "bg-warning/10 text-warning",
      },
      {
        label: "Startup Profiles",
        value: (totals?.totalStartups || 0).toLocaleString(),
        subtext: "Registered startup profiles",
        icon: Building2,
        color: "bg-secondary text-secondary-foreground",
      },
      {
        label: "Pending Verifications",
        value: (totals?.pendingVerificationsCount || 0).toLocaleString(),
        subtext: "Need admin action",
        icon: UserRoundCheck,
        color: "bg-muted text-foreground",
      },
      {
        label: "Incubator Share (10%)",
        value: `₹${(revenueStats.incubatorShare || 0).toLocaleString()}`,
        subtext: "Distributed to incubators",
        icon: Building2,
        color: "bg-accent/10 text-accent",
      },
      {
        label: "Gateway Fees (2%)",
        value: `₹${(revenueStats.gatewayFees || 0).toLocaleString()}`,
        subtext: "Paid to Razorpay",
        icon: Activity,
        color: "bg-warning/10 text-warning",
      },
    ];
  }, [revenueStats, summary]);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time platform overview and moderation health</p>
          {dataSource === "fallback" ? (
            <p className="text-xs text-warning mt-1">Showing fallback live totals because detailed summary endpoint is unavailable.</p>
          ) : null}
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold mt-4">{stat.value}</p>
                    <p className="text-muted-foreground text-sm mt-1 font-semibold">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 opacity-70">{stat.subtext}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(summary?.recentActivity || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                    ) : (
                      summary?.recentActivity.map((activity, index) => (
                        <div key={`${activity.createdAt}-${index}`} className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            {activity.type === "moderation" ? (
                              <ShieldAlert className="h-5 w-5 text-warning" />
                            ) : (
                              <Activity className="h-5 w-5 text-accent" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.entity}</p>
                          </div>
                          <Badge variant={activity.type === "moderation" ? "warning" : "secondary"}>{activity.type}</Badge>
                          <span className="text-xs text-muted-foreground hidden md:block">
                            {new Date(activity.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Verifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(summary?.pendingVerifications || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No pending verifications.</p>
                    ) : (
                      summary?.pendingVerifications.map((startup) => (
                        <div key={startup._id} className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors">
                          <h4 className="font-semibold">{startup.companyName || "Startup"}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {startup.companyType ? <Badge variant="accent">{startup.companyType}</Badge> : null}
                            <Badge variant="warning" className="capitalize">{startup.status || "pending"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">Submitted {new Date(startup.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
