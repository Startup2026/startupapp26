import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const stats = [
  { label: "Active Jobs", value: "5", icon: Briefcase, trend: "+2 this week", color: "bg-accent/10 text-accent" },
  { label: "Total Applicants", value: "127", icon: Users, trend: "+34 this week", color: "bg-success/10 text-success" },
  { label: "Profile Views", value: "892", icon: Eye, trend: "+156 this week", color: "bg-warning/10 text-warning" },
];

const recentApplications = [
  { id: 1, name: "Priya Sharma", role: "Frontend Developer", avatar: "PS", time: "2h ago", status: "New" },
  { id: 2, name: "Arjun Patel", role: "Backend Engineer", avatar: "AP", time: "4h ago", status: "Reviewed" },
  { id: 3, name: "Meera Gupta", role: "Product Manager", avatar: "MG", time: "6h ago", status: "Shortlisted" },
  { id: 4, name: "Rahul Kumar", role: "Data Analyst", avatar: "RK", time: "1d ago", status: "New" },
];

const activeJobs = [
  { id: 1, title: "Frontend Developer", applicants: 45, status: "Active", posted: "5 days ago" },
  { id: 2, title: "Backend Engineer", applicants: 32, status: "Active", posted: "1 week ago" },
  { id: 3, title: "Product Manager", applicants: 28, status: "Active", posted: "2 weeks ago" },
];

export default function StartupDashboard() {
  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center font-bold text-accent text-2xl">
              TC
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">TechCorp</h1>
              <p className="text-muted-foreground">Welcome back! Here's your hiring overview.</p>
            </div>
          </div>
          <Link to="/startup/jobs/create">
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-4xl font-bold mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-success">
                      <TrendingUp className="h-4 w-4" />
                      {stat.trend}
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Recent Applications</CardTitle>
                <Link to="/startup/applicants">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                        {app.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.role}</p>
                    </div>
                    <Badge
                      variant={
                        app.status === "New"
                          ? "accent"
                          : app.status === "Shortlisted"
                          ? "success"
                          : "muted"
                      }
                    >
                      {app.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground hidden md:block">
                      {app.time}
                    </span>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Active jobs */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Active Jobs</CardTitle>
                <Link to="/startup/jobs">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Manage <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{job.title}</h4>
                      <Badge variant="success">{job.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{job.applicants} applicants</span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StartupLayout>
  );
}
