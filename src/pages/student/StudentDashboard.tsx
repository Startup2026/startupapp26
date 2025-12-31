import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  MapPin,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const featuredStartups = [
  {
    id: 1,
    name: "TechFlow AI",
    logo: "TF",
    domain: "AI/ML",
    tagline: "Automating workflows with AI",
    openPositions: 3,
  },
  {
    id: 2,
    name: "GreenScale",
    logo: "GS",
    domain: "CleanTech",
    tagline: "Sustainable energy solutions",
    openPositions: 2,
  },
  {
    id: 3,
    name: "FinNext",
    logo: "FN",
    domain: "FinTech",
    tagline: "Next-gen payment infrastructure",
    openPositions: 5,
  },
];

const trendingJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechFlow AI",
    location: "Remote",
    stipend: "₹40K/month",
    type: "Internship",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "GreenScale",
    location: "Bangalore",
    stipend: "₹15 LPA",
    type: "Full-time",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "FinNext",
    location: "Mumbai",
    stipend: "₹8 LPA",
    type: "Full-time",
  },
];

const recentUpdates = [
  { id: 1, company: "TechFlow AI", update: "Just raised Series A funding!", time: "2h ago" },
  { id: 2, company: "GreenScale", update: "Launched new product line", time: "5h ago" },
  { id: 3, company: "FinNext", update: "Hiring spree - 10 new positions!", time: "1d ago" },
];

export default function StudentDashboard() {
  const profileCompletion = 65;

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, John! 👋</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening in the startup world today.
            </p>
          </div>
          <Link to="/student/jobs">
            <Button variant="hero" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Profile completion */}
        <Card variant="gradient" className="border-accent/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="font-semibold">Complete your profile</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  A complete profile increases your chances of getting hired by 3x
                </p>
                <Progress value={profileCompletion} className="h-2" />
                <span className="text-sm text-muted-foreground mt-2 block">
                  {profileCompletion}% complete
                </span>
              </div>
              <Link to="/student/profile">
                <Button variant="accent" className="gap-2">
                  Complete Profile
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Jobs Applied</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured startups */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Featured Startups</h2>
              <Link to="/student/startups" className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredStartups.map((startup) => (
                <Card key={startup.id} variant="interactive">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent">
                        {startup.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{startup.name}</h3>
                        <Badge variant="accent" className="text-xs">{startup.domain}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {startup.tagline}
                    </p>
                    <div className="flex items-center text-sm text-accent font-medium">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {startup.openPositions} open positions
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent updates */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Startup Updates</h2>
            <Card>
              <CardContent className="p-4 space-y-4">
                {recentUpdates.map((update) => (
                  <div key={update.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{update.company}</p>
                      <p className="text-sm text-muted-foreground truncate">{update.update}</p>
                      <p className="text-xs text-muted-foreground mt-1">{update.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trending jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Trending Jobs</h2>
            <Link to="/student/jobs" className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingJobs.map((job) => (
              <Card key={job.id} variant="interactive">
                <CardContent className="p-5">
                  <Badge variant={job.type === "Internship" ? "accent" : "success"} className="mb-3">
                    {job.type}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{job.company}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.stipend}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
