import { useState } from "react";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditStartupProfileModal } from "@/components/startup/EditStartupProfileModal";

const stats = [
  {
    label: "Active Jobs",
    value: "5",
    icon: Briefcase,
    trend: "+2 this week",
    color: "bg-accent/10 text-accent",
  },
  {
    label: "Total Applicants",
    value: "127",
    icon: Users,
    trend: "+34 this week",
    color: "bg-success/10 text-success",
  },
  {
    label: "Profile Views",
    value: "892",
    icon: Eye,
    trend: "+156 this week",
    color: "bg-warning/10 text-warning",
  },
  {
    label: "Interviews Scheduled",
    value: "12",
    icon: Calendar,
    trend: "+5 this week",
    color: "bg-primary/10 text-primary",
  },
];

const recentApplications = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Frontend Developer",
    avatar: "PS",
    time: "2h ago",
    status: "New",
  },
  {
    id: 2,
    name: "Arjun Patel",
    role: "Backend Engineer",
    avatar: "AP",
    time: "4h ago",
    status: "Reviewed",
  },
  {
    id: 3,
    name: "Meera Gupta",
    role: "Product Manager",
    avatar: "MG",
    time: "6h ago",
    status: "Shortlisted",
  },
  {
    id: 4,
    name: "Rahul Kumar",
    role: "Data Analyst",
    avatar: "RK",
    time: "1d ago",
    status: "New",
  },
];

const activeJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    applicants: 45,
    status: "Active",
    posted: "5 days ago",
  },
  {
    id: 2,
    title: "Backend Engineer",
    applicants: 32,
    status: "Active",
    posted: "1 week ago",
  },
  {
    id: 3,
    title: "Product Manager",
    applicants: 28,
    status: "Active",
    posted: "2 weeks ago",
  },
];

const upcomingInterviews = [
  {
    id: 1,
    candidateName: "Neha Patil",
    position: "Frontend Developer",
    date: "Today",
    time: "2:00 PM",
    mode: "Online",
  },
  {
    id: 2,
    candidateName: "Amit Sharma",
    position: "Backend Engineer",
    date: "Tomorrow",
    time: "10:30 AM",
    mode: "In-Person",
  },
  {
    id: 3,
    candidateName: "Priya Kulkarni",
    position: "Product Manager",
    date: "Jan 22",
    time: "3:00 PM",
    mode: "Online",
  },
];

export default function StartupDashboard() {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center font-bold text-accent text-2xl cursor-pointer hover:bg-accent/20 transition-colors"
              onClick={() => setProfileModalOpen(true)}
            >
              TC
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">TechCorp</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's your hiring overview.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setProfileModalOpen(true)}
              className="gap-2"
            >
              <Building className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-success">
                      <TrendingUp className="h-4 w-4" />
                      {stat.trend}
                    </div>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Recent Applications
                </CardTitle>
                <Link to="/startup/jobs">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                        {app.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{app.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.role}
                      </p>
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
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Active Jobs */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-accent" />
                  Active Jobs
                </CardTitle>
                <Link to="/startup/jobs">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Manage <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/startup/jobs/${job.id}/applications`}
                    className="block p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{job.title}</h4>
                      <Badge variant="success">{job.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.applicants} applicants
                      </span>
                      <span>{job.posted}</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Interviews & Pipeline Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Interviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{interview.candidateName}</p>
                    <p className="text-sm text-muted-foreground">
                      {interview.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{interview.date}</p>
                    <p className="text-xs text-muted-foreground">
                      {interview.time} • {interview.mode}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pipeline Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-accent" />
                Hiring Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Users className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <span className="font-medium">Applied</span>
                  </div>
                  <span className="text-2xl font-bold">89</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-medium">Shortlisted</span>
                  </div>
                  <span className="text-2xl font-bold text-accent">24</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-warning" />
                    </div>
                    <span className="font-medium">Interview</span>
                  </div>
                  <span className="text-2xl font-bold text-warning">12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-success" />
                    </div>
                    <span className="font-medium">Selected</span>
                  </div>
                  <span className="text-2xl font-bold text-success">8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Modal */}
      <EditStartupProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </StartupLayout>
  );
}
