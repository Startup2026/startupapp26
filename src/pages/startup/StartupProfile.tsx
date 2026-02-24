


import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Calendar,
  Linkedin,
  Twitter,
  User,
  Loader2,
  Edit
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { startupProfileService, StartupProfile as IStartupProfile } from "@/services/startupProfileService";
import { toast } from "@/hooks/use-toast";
import { EditStartupProfileModal } from "@/components/startup/EditStartupProfileModal";

export default function StartupProfilePage() {
  const [profile, setProfile] = useState<IStartupProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await startupProfileService.getMyProfile();
        if (res.success && res.data) {
          setProfile(res.data);
        } else {
             // If no profile, we might prompt creation, but dashboard handles that usually.
             console.error("Profile fetch failed:", res.error);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [editModalOpen]);

  if (loading) {
     return (
        <StartupLayout>
          <div className="flex bg-background h-[calc(100vh-4rem)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </StartupLayout>
     );
  }

  if (!profile) {
      return (
          <StartupLayout>
               <div className="p-8 text-center text-muted-foreground">
                   <p>Profile not found.</p>
                   <Link to="/startup/create-profile">
                        <Button variant="link" className="mt-4">Create Profile</Button>
                   </Link>
               </div>
          </StartupLayout>
      )
  }

  // Helper for location display
  const getLocationString = (loc: any) => {
      if (!loc) return "Not Specified";
      if (typeof loc === 'string') return loc;
      if (loc.city && loc.country) return `${loc.city}, ${loc.country}`;
      return "Location";
  }

  return (
    <StartupLayout>
      <div className="p-6 animate-fade-in space-y-5">
        {/* Header */}
        <Card>
          <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-4 items-center">
                <div className="h-14 w-14 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-lg overflow-hidden">
                {profile.profilepic ? <img src={profile.profilepic} alt="Logo" className="w-full h-full object-cover"/> : (profile.startupName?.[0] || "S")}
                </div>

                <div className="flex-1">
                <h1 className="text-xl font-bold">{profile.startupName}</h1>
                <p className="text-sm text-muted-foreground">
                    {profile.tagline || profile.industry}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                    {profile.stage && <Badge variant="secondary">{profile.stage}</Badge>}
                    {profile.industry && <Badge variant="outline">{profile.industry}</Badge>}
                    {profile.numberOfEmployees && <Badge variant="outline">{profile.numberOfEmployees} Employees</Badge>}
                </div>
                </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
                <Edit className="h-4 w-4 mr-2"/> Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold">About</h2>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {profile.aboutus || "No description provided."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Founded {profile.foundedYear || "N/A"}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {getLocationString(profile.location)}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Startup
              </div>
              {profile.website && (
                <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-teal-600 hover:underline"
                >
                    <Globe className="h-4 w-4" />
                    Website
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Founders */}
       {profile.leadershipTeam && profile.leadershipTeam.length > 0 && (
         <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold">Leadership Team</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.leadershipTeam.map((member: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        {/* Leadership member might be just a string ID or populated object depending on backend.
                            Based on model update, it's string (name) or reference?
                            The model change I did earlier was `user: String`.
                            And there are fields `name`, `role`, `linkedInUrl`.
                        */}
                        <p className="font-medium">{member.name || `Team Member ${index + 1}`}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.role || "Role"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-3 text-muted-foreground">
                      {member.linkedInUrl && (
                        <a href={member.linkedInUrl} target="_blank" rel="noreferrer">
                          <Linkedin className="h-4 w-4 hover:text-teal-600" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
       )}

        {/* Product (Simplified) */}
        {profile.productOrService && (
             <Card>
                <CardHeader className="pb-2">
                    <h2 className="font-semibold">Product / Service</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {profile.productOrService}
                    </p>
                </CardContent>
            </Card>
        )}
      </div>

       <EditStartupProfileModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </StartupLayout>
  );
}
