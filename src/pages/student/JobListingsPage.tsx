import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Filter,
  ChevronDown,
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const jobs = [
  {
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
    description: "Build beautiful user interfaces using React and TypeScript.",
  },
  {
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
    description: "Lead product development for sustainable energy solutions.",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "FinNext",
    companyLogo: "FN",
    location: "Mumbai",
    stipend: "₹8 LPA",
    type: "Full-time",
    domain: "FinTech",
    experience: "1-2 years",
    posted: "3 days ago",
    description: "Analyze financial data and create actionable insights.",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "DesignHub",
    companyLogo: "DH",
    location: "Remote",
    stipend: "₹50K/month",
    type: "Internship",
    domain: "Design",
    experience: "Fresher",
    posted: "5 hours ago",
    description: "Design intuitive user experiences for mobile applications.",
  },
  {
    id: 5,
    title: "Backend Engineer",
    company: "CloudNine",
    companyLogo: "CN",
    location: "Hyderabad",
    stipend: "₹12 LPA",
    type: "Full-time",
    domain: "SaaS",
    experience: "2-3 years",
    posted: "1 week ago",
    description: "Build scalable APIs and microservices architecture.",
  },
  {
    id: 6,
    title: "Marketing Intern",
    company: "BrandBoost",
    companyLogo: "BB",
    location: "Delhi",
    stipend: "₹25K/month",
    type: "Internship",
    domain: "Marketing",
    experience: "Fresher",
    posted: "4 days ago",
    description: "Create and execute digital marketing campaigns.",
  },
];

const domains = ["AI/ML", "FinTech", "CleanTech", "SaaS", "Design", "Marketing"];
const jobTypes = ["Internship", "Full-time", "Part-time"];
const experienceLevels = ["Fresher", "1-2 years", "2-4 years", "4+ years"];
const locations = ["Remote", "Bangalore", "Mumbai", "Delhi", "Hyderabad"];

export default function JobListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomains.length === 0 || selectedDomains.includes(job.domain);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
    return matchesSearch && matchesDomain && matchesType;
  });

  const toggleFilter = (array: string[], value: string, setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter((item) => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Job Listings</h1>
          <p className="text-muted-foreground mt-1">
            Find your perfect role at innovative startups
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className={`lg:w-72 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardContent className="p-5 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Domain</h3>
                  <div className="space-y-2">
                    {domains.map((domain) => (
                      <div key={domain} className="flex items-center space-x-2">
                        <Checkbox
                          id={`domain-${domain}`}
                          checked={selectedDomains.includes(domain)}
                          onCheckedChange={() => toggleFilter(selectedDomains, domain, setSelectedDomains)}
                        />
                        <Label htmlFor={`domain-${domain}`} className="text-sm font-normal cursor-pointer">
                          {domain}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleFilter(selectedTypes, type, setSelectedTypes)}
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Experience</h3>
                  <div className="space-y-2">
                    {experienceLevels.map((exp) => (
                      <div key={exp} className="flex items-center space-x-2">
                        <Checkbox id={`exp-${exp}`} />
                        <Label htmlFor={`exp-${exp}`} className="text-sm font-normal cursor-pointer">
                          {exp}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Location</h3>
                  <div className="space-y-2">
                    {locations.map((loc) => (
                      <div key={loc} className="flex items-center space-x-2">
                        <Checkbox id={`loc-${loc}`} />
                        <Label htmlFor={`loc-${loc}`} className="text-sm font-normal cursor-pointer">
                          {loc}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {(selectedDomains.length > 0 || selectedTypes.length > 0) && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setSelectedDomains([]);
                      setSelectedTypes([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Job listings */}
          <div className="flex-1 space-y-4">
            {/* Search bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search jobs or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                  inputSize="lg"
                />
              </div>
              <Button
                variant="outline"
                className="lg:hidden h-12 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} jobs
            </p>

            {/* Job cards */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Link key={job.id} to={`/student/jobs/${job.id}`}>
                  <Card variant="interactive" className="mb-4">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent flex-shrink-0">
                          {job.companyLogo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant={job.type === "Internship" ? "accent" : "success"}>
                              {job.type}
                            </Badge>
                            <Badge variant="muted">{job.domain}</Badge>
                          </div>
                          <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground mb-3">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.stipend}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.posted}
                            </div>
                          </div>
                        </div>
                        <Button variant="hero" className="md:self-center flex-shrink-0">
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
