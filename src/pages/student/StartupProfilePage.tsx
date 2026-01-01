import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  Linkedin,
  Twitter,
  ArrowLeft,
  Clock,
  IndianRupee,
  Megaphone,
  PartyPopper,
  UserPlus,
} from "lucide-react";

// Mock startup data
const startupData = {
  id: "1",
  name: "TechVenture Labs",
  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=techventure",
  tagline: "Building the future of AI-powered analytics",
  domain: "AI/ML",
  verified: true,
  founded: "2022",
  teamSize: "50-100",
  location: "Bangalore, India",
  website: "https://techventurelabs.com",
  linkedin: "https://linkedin.com/company/techventurelabs",
  twitter: "https://twitter.com/techventurelabs",
  about: `TechVenture Labs is a cutting-edge AI startup focused on revolutionizing how businesses understand and leverage their data. Founded by IIT alumni with experience at Google and Microsoft, we're building next-generation analytics tools that make complex data accessible to everyone.

Our mission is to democratize data analytics by creating intuitive, AI-powered tools that help businesses of all sizes make better decisions. We believe that the future of business intelligence lies in making data analysis as simple as having a conversation.`,
  product: `Our flagship product, InsightAI, is an AI-powered analytics platform that transforms raw data into actionable insights in seconds. Key features include:

• Natural Language Queries: Ask questions in plain English and get instant answers
• Predictive Analytics: ML-powered forecasting for business metrics
• Automated Reporting: Generate beautiful reports with one click
• Real-time Dashboards: Live data visualization and monitoring
• Integration Hub: Connect with 100+ data sources seamlessly`,
  culture: `At TechVenture Labs, we believe in:

• Innovation First: We encourage experimentation and creative problem-solving
• Flat Hierarchy: Everyone's ideas matter, from interns to founders
• Work-Life Balance: Flexible hours and remote-first culture
• Continuous Learning: Weekly tech talks and learning stipends
• Impact Driven: Your work directly shapes our product and user experience`,
  team: [
    {
      name: "Rahul Sharma",
      role: "CEO & Co-founder",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
      linkedin: "https://linkedin.com/in/rahulsharma",
    },
    {
      name: "Priya Patel",
      role: "CTO & Co-founder",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      linkedin: "https://linkedin.com/in/priyapatel",
    },
    {
      name: "Amit Kumar",
      role: "VP Engineering",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
      linkedin: "https://linkedin.com/in/amitkumar",
    },
    {
      name: "Sneha Reddy",
      role: "Head of Product",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sneha",
      linkedin: "https://linkedin.com/in/snehareddy",
    },
  ],
  jobs: [
    {
      id: "1",
      title: "Frontend Developer",
      type: "Full-time",
      location: "Bangalore",
      salary: "₹12-18 LPA",
      posted: "2 days ago",
    },
    {
      id: "2",
      title: "ML Engineer",
      type: "Full-time",
      location: "Remote",
      salary: "₹18-25 LPA",
      posted: "1 week ago",
    },
    {
      id: "3",
      title: "Product Design Intern",
      type: "Internship",
      location: "Bangalore",
      salary: "₹25,000/month",
      posted: "3 days ago",
    },
  ],
  updates: [
    {
      id: "1",
      type: "announcement",
      title: "Series A Funding Announcement",
      content: "We're thrilled to announce our $10M Series A funding led by Sequoia Capital!",
      date: "2 days ago",
    },
    {
      id: "2",
      type: "event",
      title: "Tech Talk: Future of AI Analytics",
      content: "Join us for an exclusive webinar on the future of AI in business analytics.",
      date: "1 week ago",
    },
    {
      id: "3",
      type: "hiring",
      title: "We're Hiring!",
      content: "Looking for passionate engineers to join our growing team. Multiple positions open!",
      date: "2 weeks ago",
    },
  ],
};

const getUpdateIcon = (type: string) => {
  switch (type) {
    case "announcement":
      return <Megaphone className="h-4 w-4" />;
    case "event":
      return <PartyPopper className="h-4 w-4" />;
    case "hiring":
      return <UserPlus className="h-4 w-4" />;
    default:
      return <Megaphone className="h-4 w-4" />;
  }
};

const getUpdateColor = (type: string) => {
  switch (type) {
    case "announcement":
      return "bg-primary/10 text-primary";
    case "event":
      return "bg-accent/10 text-accent";
    case "hiring":
      return "bg-green-500/10 text-green-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function StartupProfilePage() {
  const { id } = useParams();
  const startup = startupData; // In real app, fetch by id

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link to="/student/startups">
            <ArrowLeft className="h-4 w-4" />
            Back to Startups
          </Link>
        </Button>

        {/* Header */}
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 rounded-xl border-2 border-border">
                  <AvatarImage src={startup.logo} alt={startup.name} />
                  <AvatarFallback className="rounded-xl text-2xl">
                    {startup.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold">{startup.name}</h1>
                  {startup.verified && (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant="secondary">{startup.domain}</Badge>
                </div>
                <p className="text-muted-foreground text-lg">{startup.tagline}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {startup.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {startup.teamSize} employees
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Founded {startup.founded}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {startup.jobs.length} open positions
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild className="gap-2">
                    <a href={startup.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="gap-2">
                    <a href={startup.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="gap-2">
                    <a href={startup.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({startup.jobs.length})</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    About Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {startup.about}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Our Product
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {startup.product}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Culture & Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {startup.culture}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Leadership Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {startup.team.map((member) => (
                    <div
                      key={member.name}
                      className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-20 w-20 mb-3 border-2 border-border">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        <Linkedin className="h-3 w-3" />
                        Connect
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {startup.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold">{job.title}</h4>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3" />
                          {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.posted}
                        </span>
                      </div>
                    </div>
                    <Button asChild className="gap-2">
                      <Link to={`/student/jobs/${job.id}`}>
                        View Details
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {startup.updates.map((update) => (
                  <div
                    key={update.id}
                    className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getUpdateColor(update.type)}`}>
                        {getUpdateIcon(update.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{update.title}</h4>
                          <span className="text-xs text-muted-foreground">{update.date}</span>
                        </div>
                        <p className="text-muted-foreground">{update.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
}
