import { useState } from "react";
import {
  Search,
  Building2,
  Briefcase,
  Users,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const startups = [
  {
    id: 1,
    name: "TechFlow AI",
    logo: "TF",
    domain: "AI/ML",
    tagline: "Automating workflows with intelligent AI solutions",
    description: "Building the future of business automation using advanced machine learning models.",
    openPositions: 3,
    teamSize: "11-50",
    verified: true,
    funding: "Series A",
  },
  {
    id: 2,
    name: "GreenScale",
    logo: "GS",
    domain: "CleanTech",
    tagline: "Sustainable energy for everyone",
    description: "Making renewable energy accessible and affordable for homes and businesses.",
    openPositions: 2,
    teamSize: "1-10",
    verified: true,
    funding: "Seed",
  },
  {
    id: 3,
    name: "FinNext",
    logo: "FN",
    domain: "FinTech",
    tagline: "Next-gen payment infrastructure",
    description: "Building seamless payment solutions for the digital economy.",
    openPositions: 5,
    teamSize: "51-200",
    verified: true,
    funding: "Series B",
  },
  {
    id: 4,
    name: "HealthPulse",
    logo: "HP",
    domain: "HealthTech",
    tagline: "AI-powered health monitoring",
    description: "Wearable technology that predicts and prevents health issues.",
    openPositions: 4,
    teamSize: "11-50",
    verified: true,
    funding: "Series A",
  },
  {
    id: 5,
    name: "EduBridge",
    logo: "EB",
    domain: "EdTech",
    tagline: "Bridging learning gaps",
    description: "Personalized learning platform for K-12 students.",
    openPositions: 6,
    teamSize: "11-50",
    verified: false,
    funding: "Seed",
  },
  {
    id: 6,
    name: "LogiFlow",
    logo: "LF",
    domain: "Logistics",
    tagline: "Smart supply chain solutions",
    description: "AI-driven logistics optimization for businesses.",
    openPositions: 2,
    teamSize: "1-10",
    verified: true,
    funding: "Pre-Seed",
  },
];

export default function StartupDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Discover Startups</h1>
          <p className="text-muted-foreground mt-1">
            Explore verified startups and find your next workplace
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search startups by name, domain, or tagline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
            inputSize="lg"
          />
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredStartups.length} startups
        </p>

        {/* Startup grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <Card key={startup.id} variant="interactive" className="flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent text-lg">
                      {startup.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{startup.name}</h3>
                        {startup.verified && (
                          <BadgeCheck className="h-5 w-5 text-accent" />
                        )}
                      </div>
                      <Badge variant="accent" className="text-xs mt-1">
                        {startup.domain}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="font-medium text-sm mb-2">{startup.tagline}</p>
                <p className="text-muted-foreground text-sm flex-1 line-clamp-2">
                  {startup.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {startup.teamSize}
                  </div>
                  <Badge variant="muted">{startup.funding}</Badge>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-1 text-accent font-medium text-sm">
                    <Briefcase className="h-4 w-4" />
                    {startup.openPositions} open roles
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
