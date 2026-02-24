import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { startupProfileService } from "@/services/startupProfileService";
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
  Rocket,
  Heart,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function StartupProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [startup, setStartup] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

  useEffect(() => {
    const fetchStartupDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Correctly calls getProfileById from your startupProfileService
        const res = await startupProfileService.getProfileById(id);
        if (res.success && res.data) {
          setStartup(res.data);
        }
      } catch (error) {
        console.error("Error fetching startup details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartupDetails();
  }, [id]);

  if (loading) {
    return (
      <StudentLayout>
        <div className="space-y-6 animate-pulse p-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (!startup) {
    return (
      <StudentLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Startup not found</h2>
          <Button asChild className="mt-4">
            <Link to="/student/startups">Back to Discovery</Link>
          </Button>
        </div>
      </StudentLayout>
    );
  }

  // Maps to the 'location' object in your Mongoose schema
  const locationDisplay = startup.location 
    ? `${startup.location.city || ''}${startup.location.city && startup.location.country ? ', ' : ''}${startup.location.country || ''}`
    : "Remote";

  return (
    <StudentLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link to="/student/startups">
            <ArrowLeft className="h-4 w-4" />
            Back to Startups
          </Link>
        </Button>

        {/* Header - Uses profilepic and startupName from schema */}
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 rounded-xl border-2 border-border">
                <AvatarImage 
                  src={startup.profilepic ? `${BASE_URL}${startup.profilepic}` : undefined} 
                  alt={startup.startupName} 
                  className="object-cover" 
                />
                <AvatarFallback className="rounded-xl text-2xl font-bold bg-accent/10 text-accent">
                  {startup.startupName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold">{startup.startupName}</h1>
                  {startup.verified && (
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                  <Badge variant="secondary">{startup.industry}</Badge>
                </div>
                <p className="text-muted-foreground text-lg">{startup.tagline}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {locationDisplay}</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> 
                    {startup.numberOfEmployees || startup.teamSize || 1} Employees
                  </span>
                  {startup.foundedYear && (
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Founded {startup.foundedYear}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {startup.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={startup.website} target="_blank" rel="noreferrer"><Globe className="h-4 w-4 mr-2" /> Website</a>
                    </Button>
                  )}
                  {startup.socialLinks?.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={startup.socialLinks.linkedin} target="_blank" rel="noreferrer"><Linkedin className="h-4 w-4 mr-2" /> LinkedIn</a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs - Integrated with aboutus, productOrService, and cultureAndValues */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> About Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{startup.aboutus}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" /> Product & Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{startup.productOrService}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="culture">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Culture & Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{startup.cultureAndValues}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
}