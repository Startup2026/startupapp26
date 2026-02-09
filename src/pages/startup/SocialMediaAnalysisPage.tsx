import { useState } from "react";
import {
  Eye,
  MousePointerClick,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

import { StartupLayout } from "@/components/layouts/StartupLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* -------------------- MOCK DATA -------------------- */

const statCards = [
  {
    title: "Total Job Post Reach",
    value: "48,290",
    change: "+12.4%",
    positive: true,
    icon: Eye,
  },
  {
    title: "Engagement Rate",
    value: "6.8%",
    change: "+1.2%",
    positive: true,
    icon: MousePointerClick,
  },
  {
    title: "Apply Rate",
    value: "3.2%",
    change: "-0.4%",
    positive: false,
    icon: FileText,
  },
  {
    title: "Total Applications",
    value: "1,546",
    change: "+8.7%",
    positive: true,
    icon: TrendingUp,
  },
];

const funnelData = [
  { name: "Views", value: 48290, fill: "hsl(var(--accent))" },
  { name: "Clicks", value: 12840, fill: "hsl(var(--primary))" },
  { name: "Applications", value: 1546, fill: "hsl(174 72% 30%)" },
];

const applicationsPerJob = [
  { role: "Frontend Dev", applications: 420 },
  { role: "Backend Eng", applications: 365 },
  { role: "Full Stack", applications: 310 },
  { role: "UI/UX Design", applications: 228 },
  { role: "Data Analyst", applications: 145 },
  { role: "DevOps Eng", applications: 78 },
];

const topJobPosts = [
  {
    title: "Senior Frontend Developer",
    views: 12400,
    applications: 420,
    engagement: "8.2%",
  },
  {
    title: "Backend Engineer – Node.js",
    views: 10200,
    applications: 365,
    engagement: "7.1%",
  },
  {
    title: "Full Stack Developer",
    views: 9800,
    applications: 310,
    engagement: "6.5%",
  },
  {
    title: "UI/UX Designer",
    views: 8600,
    applications: 228,
    engagement: "5.8%",
  },
  {
    title: "Data Analyst",
    views: 4500,
    applications: 145,
    engagement: "4.9%",
  },
];

const candidateSourceData = [
  { name: "Platform", value: 620, fill: "hsl(var(--accent))" },
  { name: "LinkedIn", value: 410, fill: "hsl(var(--primary))" },
  { name: "Direct", value: 310, fill: "hsl(174 72% 30%)" },
  { name: "Referrals", value: 206, fill: "hsl(38 92% 50%)" },
];

const postingActivity = {
  postedThisMonth: 8,
  active: 5,
  expired: 3,
};

/* -------------------- HELPERS -------------------- */

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

/* -------------------- PAGE -------------------- */

export default function SocialMediaAnalysisPage() {
  return (
    <StartupLayout>
      <div className="space-y-8 animate-fade-in">
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-accent" />
            Social Media Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Job posting performance and candidate engagement insights
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} variant="glass">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1">
                      {stat.positive ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.positive
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <stat.icon className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* APPLICATION FUNNEL + CANDIDATE SOURCE */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* FUNNEL — takes more space */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Application Funnel
              </CardTitle>
              <CardDescription>
                Views → Clicks → Applications conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Funnel
                      dataKey="value"
                      data={funnelData}
                      isAnimationActive
                    >
                      <LabelList
                        position="center"
                        fill="hsl(var(--accent-foreground))"
                        stroke="none"
                        fontSize={14}
                        fontWeight={600}
                        formatter={(v: number) => v.toLocaleString()}
                      />
                      <LabelList
                        position="right"
                        fill="hsl(var(--muted-foreground))"
                        stroke="none"
                        dataKey="name"
                        fontSize={13}
                      />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* CANDIDATE SOURCE DONUT */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointerClick className="h-5 w-5 text-accent" />
                Candidate Source
              </CardTitle>
              <CardDescription>Where applicants come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={candidateSourceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {candidateSourceData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {candidateSourceData.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: s.fill }}
                    />
                    <span className="text-muted-foreground">
                      {s.name}:{" "}
                      <span className="font-medium text-foreground">
                        {s.value}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* APPLICATIONS PER JOB BAR CHART + POSTING ACTIVITY */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* BAR CHART */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Applications Per Job
              </CardTitle>
              <CardDescription>
                Which job roles receive the most applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={applicationsPerJob}
                    layout="vertical"
                    margin={{ left: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      type="number"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      dataKey="role"
                      type="category"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={100}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar
                      dataKey="applications"
                      fill="hsl(var(--accent))"
                      radius={[0, 6, 6, 0]}
                      barSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* POSTING ACTIVITY */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                Posting Activity
              </CardTitle>
              <CardDescription>Your job posting overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ActivityRow
                label="Jobs posted this month"
                value={postingActivity.postedThisMonth}
                icon={<FileText className="h-4 w-4 text-accent" />}
              />
              <ActivityRow
                label="Active jobs"
                value={postingActivity.active}
                icon={<CheckCircle className="h-4 w-4 text-success" />}
              />
              <ActivityRow
                label="Expired jobs"
                value={postingActivity.expired}
                icon={<XCircle className="h-4 w-4 text-destructive" />}
              />
            </CardContent>
          </Card>
        </div>

        {/* TOP PERFORMING JOB POSTS TABLE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Top Performing Job Posts
            </CardTitle>
            <CardDescription>
              Ranked by views and engagement rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Applications</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topJobPosts.map((job, i) => (
                    <TableRow key={job.title}>
                      <TableCell className="font-medium text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell className="text-right">
                        {job.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {job.applications.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className="border-accent/30 text-accent"
                        >
                          {job.engagement}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </StartupLayout>
  );
}

/* -------------------- SUB-COMPONENTS -------------------- */

function ActivityRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
}
