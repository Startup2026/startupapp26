import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  GraduationCap,
  Layers,
  Download,
  Filter,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startupProfileService } from "@/services/startupProfileService";
import { jobService } from "@/services/jobService";
import { applicationService } from "@/services/applicationService";
import { toast } from "@/hooks/use-toast";
import { format, subDays, isSameDay } from "date-fns";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { UpgradeModal } from "@/components/UpgradeModal";

/* ---------------- TYPES ---------------- */

interface TrendPoint {
  day: string;
  count: number;
}

interface DistributionItem {
  key: string;
  count: number;
}

const CHART_COLORS = [
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(var(--chart-3, 197 37% 24%))",
  "hsl(var(--chart-4, 43 74% 66%))",
  "hsl(var(--chart-5, 27 87% 67%))",
  "hsl(var(--muted-foreground))",
];

/* ---------------- PAGE ---------------- */

export default function JobAnalysisPage() {
  const { 
    hasAccess, 
    loading: planLoading, 
    isUpgradeModalOpen, 
    closeUpgradeModal, 
    triggeredFeature,
    checkAccessAndShowModal
  } = usePlanAccess();
  const [educationBy, setEducationBy] = useState<"degree" | "college">("degree");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Data states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [jobsList, setJobsList] = useState<{id: string, title: string}[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
        if (!hasAccess("jobAnalysis")) {
            setLoading(false);
            return;
        }
        try {
            const profileRes = await startupProfileService.getMyProfile();
            if(!profileRes.success || !profileRes.data) return;
            const profileId = profileRes.data._id;

            const jobsRes = await jobService.getAllJobs();
            if (jobsRes.success && jobsRes.data) {
                const myJobs = jobsRes.data.filter((job: any) => {
                    const jSid = (job.startupId && typeof job.startupId === 'object') ? job.startupId._id : job.startupId;
                    return jSid === profileId;
                });
                setJobsList(myJobs.map((j: any) => ({ id: j._id, title: j.role })));
            }
        } catch(e) { console.error(e); }
    };
    fetchJobs();
  }, [hasAccess]);

  useEffect(() => {
    const fetchAnalytics = async () => {
        if (!hasAccess("jobAnalysis")) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await applicationService.getHiringAnalytics(selectedJob);
            if (res.success) {
                setAnalyticsData(res.data);
            }
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Failed to load analytics", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    fetchAnalytics();
  }, [selectedJob, hasAccess]);

  if (planLoading) {
    return (
      <StartupLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StartupLayout>
    );
  }

  if (!hasAccess("jobAnalysis")) {
    return (
      <StartupLayout>
          <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-card rounded-xl border-2 border-dashed">
              <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Unlock Advanced Job Analysis</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                  Deep dive into your hiring performance, candidate demographics, and application trends. 
                  Upgrade to Growth, Pro or Enterprise plan to access this feature.
              </p>
              <Button size="lg" onClick={() => (window.location.href = "/startup/select-plan")}>
                  Upgrade to Premium
              </Button>
          </div>
      </StartupLayout>
    );
  }

  const handleExport = () => {
    if (!analyticsData) return;

    const csvRows = [
      ["Hiring Analysis Report"],
      ["Date", format(new Date(), "yyyy-MM-dd HH:mm:ss")],
      ["Job ID", selectedJob],
      [""],
      ["Metric", "Value"],
      ["Total Applications", analyticsData.totalApplications],
      ["Conversion Rate (%)", analyticsData.conversionRate],
      [""],
      ["Status Distribution"],
      ["Status", "Count"],
      ...(analyticsData.statusDistribution?.map((s: any) => [s.status, s.count]) || []),
      [""],
      ["Top Skills"],
      ["Skill", "Count"],
      ...(analyticsData.topSkills?.map((s: any) => [s.skill, s.count]) || []),
      [""],
      ["Education background"],
      ["Background", "Count"],
      ...(analyticsData.educationDistribution?.map((e: any) => [e.degree, e.count]) || []),
      [""],
      ["Experience Level"],
      ["Range", "Count"],
      ...(analyticsData.experienceDistribution?.map((ex: any) => [ex.range, ex.count]) || []),
    ];

    const csvString = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Hiring_Report_${selectedJob}_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Report Exported", description: "Your analysis report has been downloaded." });
  };


  if (loading && !analyticsData) {
      return (
          <StartupLayout>
              <div className="flex bg-background h-[calc(100vh-4rem)] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
          </StartupLayout>
      )
  }

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-accent" />
              Job Analysis
            </h1>
            <p className="text-muted-foreground mt-1">
              Insights and analytics for your job postings
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobsList.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleExport} disabled={!analyticsData}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold">{analyticsData?.totalApplications || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-3xl font-bold">{analyticsData?.conversionRate || 0}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                  <p className="text-3xl font-bold">
                    {analyticsData?.statusDistribution?.find((s:any) => s.status === 'SHORTLISTED')?.count || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Peak Daily</p>
                  <p className="text-3xl font-bold">
                    {analyticsData?.applicationsOverTime?.reduce((max: number, curr: any) => Math.max(max, curr.count), 0) || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* APPLICATION TREND CHART */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Application Trend – Last 30 Days
            </CardTitle>
            <CardDescription>Day-wise application submissions</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData?.applicationsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(val) => format(new Date(val), "MMM d")}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    labelFormatter={(val) => format(new Date(val), "MMM d, yyyy")}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "hsl(var(--accent))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* DISTRIBUTION CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* EDUCATION DISTRIBUTION */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  Education Distribution
                </CardTitle>
                <CardDescription>Applicants by education background</CardDescription>
              </div>
            </CardHeader>
             <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={analyticsData?.educationDistribution || []} 
                        layout="vertical" 
                        margin={{ left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" hide />
                      <YAxis 
                         dataKey="degree" 
                         type="category" 
                         width={120} 
                         tick={{ fontSize: 12 }} 
                         interval={0}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>

          {/* SKILLS DISTRIBUTION */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Top Applicant Skills
              </CardTitle>
              <CardDescription>Most common skills among candidates</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.topSkills || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="skill" 
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
          </Card>

          {/* STATUS BREAKDOWN */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Funnel distribution</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData?.statusDistribution || []}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {analyticsData?.statusDistribution?.map((_: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>

          {/* EXPERIENCE DISTRIBUTION */}
          <Card>
            <CardHeader>
              <CardTitle>Experience Levels</CardTitle>
              <CardDescription>Candidate seniority breakdown</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.experienceDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={closeUpgradeModal} featureName={triggeredFeature || "Job Analytics"} />
    </StartupLayout>
  );
}

