import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Briefcase,
  Users,
  ExternalLink,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiFetch, getStoredUser, API_BASE_URL } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Interface matching the UI requirements
interface Startup {
  id: string;
  name: string;
  logo: string;
  domain: string;
  tagline: string;
  description: string;
  openPositions?: number;
  teamSize?: string;
  verified: boolean;
  funding?: string;
  location?: string;
}

export default function StartupDiscoveryPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const user = getStoredUser();
  const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

  // --- Fetch Recommendations ---
  useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);
      try {
        let endpoint = "/recommendations/cold-start/startups?limit=20";
        if (user?._id) {
          endpoint = `/recommendations/startups/${user._id}?limit=20&random=true`;
        }

        const res = await apiFetch(endpoint);

        if (res.success && Array.isArray(res.data)) {
          const transformedData = res.data.map((item: any) => transformStartup(item));
          setStartups(transformedData);
        } else {
          console.error("Failed to load startups:", res.message);
        }
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [user?._id]);

  // --- Transform Backend Data to UI Model ---
  const transformStartup = (item: any): Startup => {
    let locationStr = "Remote";
    if (item.location) {
        if (typeof item.location === 'string') {
            locationStr = item.location;
        } else if (typeof item.location === 'object') {
            const { city, country } = item.location;
            const parts = [];
            if (city) parts.push(city);
            if (country) parts.push(country);
            if (parts.length > 0) locationStr = parts.join(", ");
        }
    }

    return {
      id: item._id,
      name: item.startupName || "Startup",
      logo: item.profilepic ? `${BASE_URL}${item.profilepic}` : "",
      domain: item.industry || "General",
      location: locationStr,
      tagline: item.tagline || "Building the future",
      description: item.aboutus || "No description available.",
      verified: item.verified || false,
      teamSize: item.numberOfEmployees
        ? `${item.numberOfEmployees} employees`
        : item.teamSize
          ? `${item.teamSize} employees`
          : "1-10",
      // funding: item.funding || "Bootstrapped", 
      openPositions: item.hiring ? 1 : 0
    };
  };

  // --- Client-Side Search Filtering ---
  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          />
        </div>

        {!loading && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredStartups.length} startups
          </p>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="flex flex-col h-[280px]">
                <CardContent className="p-6">
                  <div className="flex gap-3 mb-4">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))
          ) : filteredStartups.length > 0 ? (
            filteredStartups.map((startup) => (
              <Card key={startup.id} className="flex flex-col hover:shadow-md transition-all duration-200 border-border/60">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 rounded-xl border">
                        <AvatarImage src={startup.logo} alt={startup.name} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-accent/10 text-accent font-bold text-lg">
                          {startup.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-lg leading-none">{startup.name}</h3>
                          {startup.verified && (
                            <BadgeCheck className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                           <Badge variant="secondary" className="text-xs font-normal">
                             {startup.domain}
                           </Badge>
                           <span className="text-xs text-muted-foreground flex items-center">
                             {startup.location}
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="font-medium text-sm mb-1.5 line-clamp-1">{startup.tagline}</p>
                  <p className="text-muted-foreground text-sm flex-1 line-clamp-2 leading-relaxed">
                    {startup.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5" title="Team Size">
                      <Users className="h-3.5 w-3.5" />
                      {startup.teamSize}
                    </div>
                    {startup.funding && (
                       <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                         {startup.funding}
                       </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
                    <div className="flex items-center gap-1.5 text-accent font-medium text-sm">
                      {startup.openPositions && startup.openPositions > 0 ? (
                        <>
                          <Briefcase className="h-4 w-4" />
                          {startup.openPositions} open roles
                        </>
                      ) : (
                        <span className="text-muted-foreground font-normal">No open roles</span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" asChild className="gap-1 h-8 px-2 hover:bg-accent/10 hover:text-accent">
                      <Link to={`/student/startups/${startup.id}`}>
                        View <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-muted/50">
              <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center mb-4 shadow-sm">
                <Building2 className="h-66 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No startups found</h3>
              <p className="text-muted-foreground max-w-sm mt-1">
                Try adjusting your search terms or check back later for new companies.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}