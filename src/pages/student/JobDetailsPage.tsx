import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JobApplicationModal } from "@/components/student/JobApplicationModal";

// Mock job data - in a real app this would come from an API
const jobsData: Record<string, {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  stipend: string;
  type: string;
  domain: string;
  experience: string;
  posted: string;
  deadline: string;
  openings: number;
  applicants: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  companyDescription: string;
  companySize: string;
  companyWebsite: string;
}> = {
  "1": {
    id: 1,
    title: "Frontend Developer",
    company: "TechFlow AI",
    companyLogo: "TF",
    location: "Remote",
    stipend: "₹40K/month",
    type: "Internship",
    domain: "AI/ML",
    experience: "Fresher",
    posted: "2 days ago",
    deadline: "Jan 30, 2026",
    openings: 3,
    applicants: 45,
    description: "We're looking for a passionate Frontend Developer to join our growing team. You'll be working on cutting-edge AI products, building beautiful and responsive user interfaces that make complex technology accessible to everyone.",
    responsibilities: [
      "Build and maintain responsive web applications using React and TypeScript",
      "Collaborate with designers to implement pixel-perfect UI components",
      "Optimize application performance and ensure cross-browser compatibility",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and contribute to technical discussions",
    ],
    requirements: [
      "Strong proficiency in React, TypeScript, and modern CSS",
      "Understanding of responsive design principles",
      "Familiarity with REST APIs and state management libraries",
      "Good problem-solving skills and attention to detail",
      "Excellent communication skills",
    ],
    perks: [
      "Flexible working hours",
      "Remote work options",
      "Certificate of completion",
      "Pre-placement offer opportunity",
      "Mentorship from industry experts",
    ],
    companyDescription: "TechFlow AI is a leading AI startup focused on building intelligent automation solutions for businesses. We're backed by top VCs and are on a mission to transform how companies work.",
    companySize: "50-100 employees",
    companyWebsite: "techflow.ai",
  },
  "2": {
    id: 2,
    title: "Product Manager",
    company: "GreenScale",
    companyLogo: "GS",
    location: "Bangalore",
    stipend: "₹15 LPA",
    type: "Full-time",
    domain: "CleanTech",
    experience: "2-4 years",
    posted: "1 day ago",
    deadline: "Feb 15, 2026",
    openings: 1,
    applicants: 120,
    description: "Lead product development for our sustainable energy solutions platform. Drive the product vision and work closely with engineering and design teams to deliver impactful features.",
    responsibilities: [
      "Define and communicate the product vision and strategy",
      "Gather and prioritize product requirements",
      "Work closely with engineering, design, and marketing teams",
      "Analyze market trends and competitive landscape",
      "Drive product launches and measure success metrics",
    ],
    requirements: [
      "2-4 years of product management experience",
      "Strong analytical and problem-solving skills",
      "Excellent communication and stakeholder management skills",
      "Experience with agile methodologies",
      "Passion for sustainability and clean technology",
    ],
    perks: [
      "Competitive salary and equity",
      "Health insurance for family",
      "Learning and development budget",
      "Flexible work arrangements",
      "Impact-driven work culture",
    ],
    companyDescription: "GreenScale is building the future of sustainable energy. Our platform helps businesses reduce their carbon footprint through smart energy management solutions.",
    companySize: "100-200 employees",
    companyWebsite: "greenscale.io",
  },
};

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const job = jobsData[id || "1"] || jobsData["1"];

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        {/* Back navigation */}
        <Link
          to="/student/jobs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="h-16 w-16 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent text-xl flex-shrink-0">
                    {job.companyLogo}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={job.type === "Internship" ? "accent" : "success"}>
                        {job.type}
                      </Badge>
                      <Badge variant="muted">{job.domain}</Badge>
                      <Badge variant="outline">{job.experience}</Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {job.stipend}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Posted {job.posted}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {job.applicants} applicants
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <Button variant="hero" size="lg" onClick={() => setShowApplicationModal(true)}>
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save Job"}
                  </Button>
                  <Button variant="ghost" size="lg">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About the Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Perks */}
            <Card>
              <CardHeader>
                <CardTitle>Perks & Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.perks.map((perk, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1.5">
                      {perk}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>Openings</span>
                  </div>
                  <span className="font-semibold">{job.openings}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Applicants</span>
                  </div>
                  <span className="font-semibold">{job.applicants}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline</span>
                  </div>
                  <span className="font-semibold">{job.deadline}</span>
                </div>
              </CardContent>
            </Card>

            {/* Company Card */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent">
                    {job.companyLogo}
                  </div>
                  <div>
                    <h4 className="font-semibold">{job.company}</h4>
                    <p className="text-sm text-muted-foreground">{job.domain}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.companyDescription}
                </p>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Company Size</span>
                    <span className="font-medium">{job.companySize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Website</span>
                    <a
                      href={`https://${job.companyWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-accent hover:underline"
                    >
                      {job.companyWebsite}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/student/startups/1`}>View Full Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <JobApplicationModal
        open={showApplicationModal}
        onOpenChange={setShowApplicationModal}
        job={job}
      />
    </StudentLayout>
  );
}
