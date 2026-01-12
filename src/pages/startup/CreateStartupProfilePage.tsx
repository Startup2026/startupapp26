import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Users,
  MapPin,
  Calendar,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { startupProfileService } from "@/services/startupProfileService";
import { useAuth } from "@/contexts/AuthContext";

const industries = [
  "FinTech", "EdTech", "HealthTech", "AI/ML", "SaaS", "E-Commerce", "Web3", "CleanTech", "AgriTech", "Other"
] as const;

const stages = ["Idea", "MVP", "Early Traction", "Growth", "Scaling"] as const;

type Industry = typeof industries[number];
type Stage = typeof stages[number];

export default function CreateStartupProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    startupName: user?.name || "",
    tagline: "",
    description: "",
    industry: "FinTech" as Industry,
    stage: "MVP" as Stage,
    website: "",
    linkedinUrl: "",
    twitterUrl: "",
    githubUrl: "",
    foundedYear: new Date().getFullYear().toString(),
    teamSize: "5",
    city: "",
    country: "",
    hiring: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const profileData = {
        userId: user?._id || "",
        startupName: formData.startupName,
        tagline: formData.tagline,
        description: formData.description,
        industry: formData.industry,
        stage: formData.stage,
        website: formData.website,
        linkedinUrl: formData.linkedinUrl,
        twitterUrl: formData.twitterUrl,
        foundedYear: formData.foundedYear,
        teamSize: formData.teamSize,
        location: `${formData.city}, ${formData.country}`.trim().replace(/^,\s*|,\s*$/g, ''),
        openPositions: formData.hiring ? 1 : 0,
      };

      const result = await startupProfileService.createProfile(profileData);

      if (result.success) {
        toast({
          title: "Profile Created!",
          description: "Welcome to PitchIt. Your startup profile is now live.",
        });
        navigate("/startup/dashboard");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Set Up Your Startup Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your startup to attract the best talent
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-accent" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startupName">Startup Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="startupName"
                    name="startupName"
                    value={formData.startupName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="A short catchphrase for your startup"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your startup, mission, and vision..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industry <span className="text-destructive">*</span></Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value: Industry) => setFormData((prev) => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Stage <span className="text-destructive">*</span></Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value: Stage) => setFormData((prev) => ({ ...prev, stage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((st) => (
                          <SelectItem key={st} value={st}>{st}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Founded Year
                    </Label>
                    <Input
                      id="foundedYear"
                      name="foundedYear"
                      type="number"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      min={1990}
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      name="teamSize"
                      type="number"
                      value={formData.teamSize}
                      onChange={handleChange}
                      min={1}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g., Bangalore"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g., India"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="hiring"
                    checked={formData.hiring}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hiring: !!checked }))}
                  />
                  <Label htmlFor="hiring" className="cursor-pointer">We are currently hiring</Label>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Online Presence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Website
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="linkedin.com/company/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" /> Twitter
                    </Label>
                    <Input
                      id="twitterUrl"
                      name="twitterUrl"
                      type="url"
                      value={formData.twitterUrl}
                      onChange={handleChange}
                      placeholder="twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl" className="flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub
                    </Label>
                    <Input
                      id="githubUrl"
                      name="githubUrl"
                      type="url"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="github.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              {isSubmitting ? "Creating Profile..." : "Complete Profile"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
