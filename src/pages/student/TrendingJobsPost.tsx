import { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Search, 
  ArrowRight,
  Loader2 
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiFetch, getStoredUser } from "@/lib/api";
import { Link } from "react-router-dom";

interface TrendingJob {
  _id: string;
  role: string;
  location: string;
  jobType: string;
  stipend: boolean;
  salary: string | null;
  deadline: string;
  hasApplied: boolean;
  startup: {
    _id: string;
    startupName: string;
    industry: string;
  };
  scores: {
    final: number;
  };
}

export default function TrendingJobsPage() {
  const [jobs, setJobs] = useState<TrendingJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const user = getStoredUser();

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    const fetchTrendingJobs = async () => {
      setLoading(true);
      try {
        const endpoint = user?._id 
          ? `/recommendations/trending/jobs?limit=10&page=${page}` 
          : `/recommendations/cold-start?type=trending-jobs&limit=10&page=${page}`;
        
        const res = await apiFetch(endpoint);
        if (res.success && Array.isArray(res.data)) {
           if (res.data.length === 0) {
             setHasMore(false);
           } else {
             setJobs(prev => {
                const newJobs = page === 1 ? res.data : [...prev, ...res.data];
                return Array.from(new Map(newJobs.map(j => [j._id, j])).values());
             });
           }
        } else {
           setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching trending jobs:", error);
      } finally {
        setLoading(false);
        setIsInitialLoading(false);
      }
    };

    fetchTrendingJobs();
  }, [page, user?._id]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  // Client-side filtering for the search bar
  const filteredJobs = jobs.filter(job => 
    job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.startup.startupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDeadline = (dateString: string) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-accent/10 rounded-full mb-2">
            <TrendingUp className="h-5 w-5 text-accent mr-2" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">What's Hot</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Trending Opportunities</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular jobs and internships based on student engagement and upcoming deadlines.
          </p>
        </div>

        {/* Search and Filters Area */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by role or company..." 
              className="pl-10 h-14 bg-background border-2 focus-visible:ring-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Jobs List */}
        <div className="max-w-5xl mx-auto space-y-4">
          {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
              <p className="text-muted-foreground font-medium">Analyzing trends for you...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <>
            {filteredJobs.map((job) => (
              <Card key={job._id} className="overflow-hidden hover:border-accent/40 transition-all group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    {/* Left: Branding */}
                    <div className="p-6 flex items-center gap-4 flex-1">
                      <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center font-bold text-xl text-accent shrink-0 group-hover:scale-105 transition-transform">
                        {job.startup.startupName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-xl truncate">{job.role}</h3>
                          <Badge variant={job.jobType === "Internship" ? "accent" : "success"}>
                            {job.jobType}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                          {job.startup.startupName} • <span className="text-xs">{job.startup.industry}</span>
                        </p>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="px-6 py-4 md:py-0 flex flex-wrap gap-6 text-sm font-medium border-y md:border-y-0 md:border-x">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {job.location || "Remote"}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {job.salary || (job.stipend ? "Paid" : "Unpaid")}
                      </div>
                      <div className="flex items-center gap-2 text-warning">
                        <Clock className="h-4 w-4" />
                        Ends {formatDeadline(job.deadline)}
                      </div>
                    </div>

                    {/* Right: Action */}
                    <div className="p-6 flex items-center gap-3">
                      {job.hasApplied ? (
                        <Button variant="outline" className="w-full md:w-auto border-success text-success bg-success/5" disabled>
                          Applied
                        </Button>
                      ) : (
                        <Link to={`/student/jobs/${job._id}`} className="w-full md:w-auto">
                          <Button className="w-full bg-accent hover:bg-accent/90">
                            Apply Now <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {loading && hasMore && (
               <div className="flex justify-center p-8 w-full">
                  <Loader2 className="animate-spin h-6 w-6 text-primary" />
               </div>
            )}
            {!loading && hasMore && (
               <div ref={observerTarget} className="flex justify-center p-8 w-full h-10">
               </div>
            )}
            </>
          ) : (
            
            filteredJobs.length === 0 && !isInitialLoading && (
            <Card className="p-20 text-center border-dashed">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">No trending jobs found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Try adjusting your search or check back later as trends update constantly.
                </p>
                {searchQuery && (
                   <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
                )}
              </div>
            </Card>
            )
          )}
        </div>
      </div>
    </StudentLayout>
  );
}