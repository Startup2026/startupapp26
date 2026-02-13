import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, DollarSign, Building2, Clock, Filter, ChevronDown } from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { jobService } from "@/services/jobService";
import { getStoredUser } from "@/lib/api";

const domains = ["AI/ML", "FinTech", "SaaS", "EdTech", "HealthTech", "E-Commerce", "Web3", "Other"];
const jobTypes = ["Remote", "Hybrid", "Offline"];

export default function JobListingsPage() {
  const user = getStoredUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // This fetch triggers on page load/refresh
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Appending random=true triggers the shuffleArray logic in your RecommendationController
        const res = user?._id 
          ? await jobService.getRecommendedJobs(user._id) 
          : await jobService.getColdStartJobs();
          
        if (res?.success) {
          setJobs((res.data as any[]) || []);
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchQuery.toLowerCase();
    
    // Search Filter
    const matchesSearch =
      (job.role?.toLowerCase() || "").includes(searchLower) ||
      (job.startup?.startupName?.toLowerCase() || "").includes(searchLower);

    // Domain Filter (Case-insensitive check)
    const jobIndustry = job.startup?.industry;
    const matchesDomain = selectedDomains.length === 0 || 
      (jobIndustry && selectedDomains.some(d => d.toLowerCase() === jobIndustry.toLowerCase()));

    // Job Type Filter (Case-insensitive check)
    const jobType = job.jobType;
    const matchesType = selectedTypes.length === 0 || 
      (jobType && selectedTypes.some(t => t.toLowerCase() === jobType.toLowerCase()));
      
    return matchesSearch && matchesDomain && matchesType;
  });

  const toggleFilter = (array: string[], value: string, setter: (updater: (prev: string[]) => string[]) => void) => {
    setter(prev => prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]);
  };

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Job Listings</h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time opportunities from our startup network</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className={`lg:w-72 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardContent className="p-5 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Domain</h3>
                  <div className="space-y-2">
                    {domains.map((domain) => (
                      <div key={domain} className="flex items-center space-x-2">
                        <Checkbox id={domain} checked={selectedDomains.includes(domain)} onCheckedChange={() => toggleFilter(selectedDomains, domain, setSelectedDomains)} />
                        <Label htmlFor={domain} className="text-sm font-normal cursor-pointer">{domain}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} checked={selectedTypes.includes(type)} onCheckedChange={() => toggleFilter(selectedTypes, type, setSelectedTypes)} />
                        <Label htmlFor={type} className="text-sm font-normal cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search jobs or companies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12" />
              </div>
              <Button variant="outline" className="lg:hidden h-12 gap-2" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" /> Filters <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>

            <div className="space-y-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-xl" />)
              ) : filteredJobs.map((job) => (
                <Link key={job._id} to={`/student/jobs/${job._id}`}>
                  <Card variant="interactive">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent">
                          {job.startup?.startupName?.[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={job.jobType === "Remote" ? "accent" : "secondary"}>{job.jobType}</Badge>
                            {job.tags?.slice(0, 2).map((t: string, i: number) => <Badge key={i} variant="muted">{t}</Badge>)}
                          </div>
                          <h3 className="text-xl font-semibold">{job.role}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground mb-3">
                            <Building2 className="h-4 w-4" /> <span>{job.startup?.startupName}</span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{job.aboutRole}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" /> 
                              {/* FIX: Access city string directly */}
                              {job.startup?.location?.city || "Remote"}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" /> 
                              {job.stipend ? `₹${job.salary}` : "Unpaid"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" /> 
                              {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button variant="hero" className="md:self-center">Apply Now</Button>
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