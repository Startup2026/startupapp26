


import {
  Building2,
  Globe,
  MapPin,
  Calendar,
  Linkedin,
  Twitter,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { StartupLayout } from "@/components/layouts/StartupLayout";

interface Founder {
  name: string;
  role: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
}

interface StartupProfile {
  name: string;
  logo: string;
  tagline: string;
  description: string;
  foundedYear: number;
  stage: string;
  industry: string;
  companySize: string;
  location: string;
  website: string;
  founders: Founder[];
  product: {
    title: string;
    description: string;
    problem: string;
    solution: string;
    techStack: string[];
  };
}

const startupProfile: StartupProfile = {
  name: "TechFlow AI",
  logo: "TF",
  tagline: "Automating workflows using AI",
  description:
    "TechFlow AI builds AI-powered tools that help startups automate internal workflows, reduce manual overhead, and scale operations efficiently.",
  foundedYear: 2023,
  stage: "Early-stage",
  industry: "Artificial Intelligence",
  companySize: "11–50",
  location: "Pune, India",
  website: "https://techflow.ai",
  founders: [
    {
      name: "Rahul Mehta",
      role: "CEO & Co-Founder",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Ananya Sharma",
      role: "CTO & Co-Founder",
      linkedin: "#",
    },
    {
      name: "Vishal Patil",
      role: "Head of Product",
      twitter: "#",
    },
  ],
  product: {
    title: "FlowBot",
    description:
      "FlowBot is an AI-driven workflow automation platform designed for fast-growing startups.",
    problem:
      "Startups rely heavily on manual processes for operations, approvals, and reporting, which slows down productivity.",
    solution:
      "FlowBot automates repetitive workflows using AI, integrates with existing tools, and provides actionable insights in real time.",
    techStack: ["React", "Node.js", "Python", "AI/ML"],
  },
};

export default function StartupProfilePage() {
  return (
    <StartupLayout>
      <div className="p-6 animate-fade-in space-y-5">
        {/* Header */}
        <Card>
          <CardContent className="p-5 flex gap-4">
            <div className="h-14 w-14 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-lg">
              {startupProfile.logo}
            </div>

            <div className="flex-1">
              <h1 className="text-xl font-bold">{startupProfile.name}</h1>
              <p className="text-sm text-muted-foreground">
                {startupProfile.tagline}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{startupProfile.stage}</Badge>
                <Badge variant="outline">{startupProfile.industry}</Badge>
                <Badge variant="outline">{startupProfile.companySize}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold">About</h2>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p className="text-muted-foreground">
              {startupProfile.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Founded {startupProfile.foundedYear}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {startupProfile.location}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Startup
              </div>
              <a
                href={startupProfile.website}
                target="_blank"
                className="flex items-center gap-2 text-teal-600 hover:underline"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Founders */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold">Founders & Team</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {startupProfile.founders.map((founder, index) => (
                <Card key={index}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{founder.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {founder.role}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-3 text-muted-foreground">
                      {founder.linkedin && (
                        <a href={founder.linkedin} target="_blank">
                          <Linkedin className="h-4 w-4 hover:text-teal-600" />
                        </a>
                      )}
                      {founder.twitter && (
                        <a href={founder.twitter} target="_blank">
                          <Twitter className="h-4 w-4 hover:text-teal-600" />
                        </a>
                      )}
                      {founder.website && (
                        <a href={founder.website} target="_blank">
                          <Globe className="h-4 w-4 hover:text-teal-600" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold">Product</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-base">
                {startupProfile.product.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {startupProfile.product.description}
              </p>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Problem:</span>{" "}
                {startupProfile.product.problem}
              </p>
              <p>
                <span className="font-medium">Solution:</span>{" "}
                {startupProfile.product.solution}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {startupProfile.product.techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StartupLayout>
  );
}
