import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Building2, Briefcase, Loader2, AlertTriangle, IndianRupee } from "lucide-react";
import { apiFetch } from "@/lib/api";

type TimeRange = "1m" | "3m" | "6m" | "1y";

type PlatformUser = {
  _id: string;
  role: string;
  createdAt: string;
};

type StartupProfile = {
  _id: string;
  industry?: string;
  createdAt: string;
};

type JobRecord = {
  _id: string;
  createdAt: string;
  startupId?: {
    _id?: string;
    industry?: string;
  };
};

type JobReport = {
  _id: string;
  status: "open" | "kept" | "removed";
  createdAt: string;
};

type RevenueSummary = {
  platformShare?: number;
  netRevenue?: number;
  incubatorShare?: number;
  gatewayFees?: number;
};

const COLORS = ["#2563eb", "#059669", "#f59e0b", "#ef4444", "#7c3aed", "#14b8a6"];

const dayLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const getRangeDays = (range: TimeRange) => {
  if (range === "1m") return 30;
  if (range === "3m") return 90;
  if (range === "6m") return 180;
  return 365;
};

const buildDailySeries = (
  days: number,
  users: PlatformUser[],
  jobs: JobRecord[],
  reports: JobReport[]
) => {
  const now = new Date();
  const buckets: Array<{
    key: string;
    name: string;
    students: number;
    startups: number;
    jobs: number;
    reports: number;
  }> = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.push({ key, name: dayLabel(d), students: 0, startups: 0, jobs: 0, reports: 0 });
  }

  const indexByKey = new Map(buckets.map((bucket, idx) => [bucket.key, idx]));

  users.forEach((user) => {
    const key = new Date(user.createdAt).toISOString().slice(0, 10);
    const idx = indexByKey.get(key);
    if (idx === undefined) return;
    if (user.role === "student") buckets[idx].students += 1;
    if (user.role === "startup") buckets[idx].startups += 1;
  });

  jobs.forEach((job) => {
    const key = new Date(job.createdAt).toISOString().slice(0, 10);
    const idx = indexByKey.get(key);
    if (idx === undefined) return;
    buckets[idx].jobs += 1;
  });

  reports.forEach((report) => {
    const key = new Date(report.createdAt).toISOString().slice(0, 10);
    const idx = indexByKey.get(key);
    if (idx === undefined) return;
    buckets[idx].reports += 1;
  });

  return buckets;
};

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [startups, setStartups] = useState<StartupProfile[]>([]);
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [reports, setReports] = useState<JobReport[]>([]);
  const [revenue, setRevenue] = useState<RevenueSummary>({});

  const fetchAnalyticsData = async () => {
    try {
      const [usersRes, startupsRes, jobsRes, reportsRes, revenueRes] = await Promise.all([
        apiFetch("/users"),
        apiFetch("/startupProfiles"),
        apiFetch("/get-all-jobs"),
        apiFetch("/admin/moderation/jobs?status=all"),
        apiFetch("/payment/admin/revenue-summary"),
      ]);

      if (usersRes.success && Array.isArray(usersRes.data)) setUsers(usersRes.data);
      if (startupsRes.success && Array.isArray(startupsRes.data)) setStartups(startupsRes.data);
      if (jobsRes.success && Array.isArray(jobsRes.data)) setJobs(jobsRes.data);
      if (reportsRes.success && Array.isArray(reportsRes.data)) setReports(reportsRes.data);
      if (revenueRes.success && revenueRes.data) setRevenue(revenueRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    const intervalId = window.setInterval(fetchAnalyticsData, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const rangeDays = getRangeDays(timeRange);

  const dailySeries = useMemo(() => buildDailySeries(rangeDays, users, jobs, reports), [rangeDays, users, jobs, reports]);

  const weeklyActivity = useMemo(() => dailySeries.slice(-7), [dailySeries]);

  const jobsByDomain = useMemo(() => {
    const domainCount = new Map<string, number>();

    jobs.forEach((job) => {
      const domain = job.startupId?.industry || "Other";
      domainCount.set(domain, (domainCount.get(domain) || 0) + 1);
    });

    return Array.from(domainCount.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [jobs]);

  const reportStatusData = useMemo(() => {
    const open = reports.filter((report) => report.status === "open").length;
    const kept = reports.filter((report) => report.status === "kept").length;
    const removed = reports.filter((report) => report.status === "removed").length;

    return [
      { name: "Open", value: open },
      { name: "Kept", value: kept },
      { name: "Removed", value: removed },
    ];
  }, [reports]);

  const totalUsers = users.length;
  const activeStartups = startups.length;
  const jobsPosted = jobs.length;
  const openReports = reportStatusData.find((item) => item.name === "Open")?.value || 0;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Platform Analytics</h1>
            <p className="text-muted-foreground mt-1">Live analytics from current platform data</p>
          </div>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <h3 className="text-2xl font-bold">{totalUsers.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Startups</p>
                    <h3 className="text-2xl font-bold">{activeStartups.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jobs Posted</p>
                    <h3 className="text-2xl font-bold">{jobsPosted.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-full">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Open Reports</p>
                    <h3 className="text-2xl font-bold">{openReports.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full">
                    <IndianRupee className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Platform Share</p>
                    <h3 className="text-2xl font-bold">₹{(revenue.platformShare || 0).toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Net Revenue</p>
                  <h3 className="text-2xl font-bold">₹{(revenue.netRevenue || 0).toLocaleString()}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Incubator Share</p>
                  <h3 className="text-2xl font-bold">₹{(revenue.incubatorShare || 0).toLocaleString()}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Gateway Fees</p>
                  <h3 className="text-2xl font-bold">₹{(revenue.gatewayFees || 0).toLocaleString()}</h3>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Daily new student and startup registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailySeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorStartups" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" minTickGap={24} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="students" stroke="#2563eb" fillOpacity={1} fill="url(#colorStudents)" name="Students" />
                        <Area type="monotone" dataKey="startups" stroke="#059669" fillOpacity={1} fill="url(#colorStartups)" name="Startups" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>New jobs and reports received in last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyActivity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="jobs" fill="#f97316" radius={[4, 4, 0, 0]} name="Jobs" />
                        <Bar dataKey="reports" fill="#ef4444" radius={[4, 4, 0, 0]} name="Reports" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Jobs by Domain</CardTitle>
                  <CardDescription>Distribution of current job listings by startup industry</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={jobsByDomain} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                          {jobsByDomain.map((entry, index) => (
                            <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Moderation Outcomes</CardTitle>
                  <CardDescription>Status split of all submitted job reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={reportStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                          {reportStatusData.map((entry, index) => (
                            <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
