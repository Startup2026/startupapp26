import { useState, ChangeEvent } from "react";
import {
  Building,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface EditStartupProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const industries = [
  "FinTech", "EdTech", "HealthTech", "AI/ML", "SaaS", "E-Commerce", "Web3", "Other"
] as const;

const stages = ["Idea", "MVP", "Early Traction", "Growth", "Scaling"] as const;

type Industry = typeof industries[number];
type Stage = typeof stages[number];

interface StartupFormData {
  startupName: string;
  tagline: string;
  description: string;
  industry: Industry;
  stage: Stage;
  website: string;
  linkedin: string;
  twitter: string;
  github: string;
  foundedYear: string;
  teamSize: number;
  city: string;
  country: string;
  hiring: boolean;
}

export function EditStartupProfileModal({ open, onOpenChange }: EditStartupProfileModalProps) {
  const [formData, setFormData] = useState<StartupFormData>({
    startupName: "TechCorp",
    tagline: "Building the future of tech",
    description: "",
    industry: "FinTech",
    stage: "MVP",
    website: "",
    linkedin: "",
    twitter: "",
    github: "",
    foundedYear: "2023",
    teamSize: 5,
    city: "Bangalore",
    country: "India",
    hiring: true,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Startup Profile Updated:", formData);
    toast({
      title: "Profile Updated",
      description: "Your startup profile has been saved.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building className="h-5 w-5 text-accent" />
            Edit Startup Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Startup Name <span className="text-destructive">*</span></Label>
              <Input
                name="startupName"
                value={formData.startupName}
                onChange={handleChange}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about your startup..."
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value: Industry) => setFormData((prev) => ({ ...prev, industry: value }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value: Stage) => setFormData((prev) => ({ ...prev, stage: value }))}
              >
                <SelectTrigger className="mt-1.5">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="flex items-center gap-1">
                <Globe className="h-3 w-3" /> Website
              </Label>
              <Input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Linkedin className="h-3 w-3" /> LinkedIn
              </Label>
              <Input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Twitter className="h-3 w-3" /> Twitter
              </Label>
              <Input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Github className="h-3 w-3" /> GitHub
              </Label>
              <Input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Founded Year</Label>
              <Input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                min={1990}
                max={new Date().getFullYear()}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Users className="h-3 w-3" /> Team Size
              </Label>
              <Input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                min={1}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Country</Label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="hiring"
              checked={formData.hiring}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hiring: !!checked }))}
            />
            <Label htmlFor="hiring" className="cursor-pointer">Currently Hiring</Label>
          </div>

          <Button type="submit" variant="hero" className="w-full gap-2">
            <CheckCircle className="h-4 w-4" />
            Save Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
