import { useState, useEffect } from "react";
import { Briefcase, FileText, GraduationCap, Layers, CheckCircle, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { jobService } from "@/services/jobService";
import { startupProfileService } from "@/services/startupProfileService";

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobCreated?: () => void;
}

interface JobFormData {
  role: string;
  aboutRole: string;
  experienceRequired: string;
  educationRequired: string;
  skillsRequired: string[];
  jobType: string;
  location: string;
  salary: string;
  openings: number;
}

const skillsList = [
  "React", "Node.js", "MongoDB", "Express", "Python", "Java", "AWS", "Docker",
  "TypeScript", "PostgreSQL", "GraphQL", "Kubernetes"
];

export function CreateJobModal({ open, onOpenChange, onJobCreated }: CreateJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [startupId, setStartupId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<JobFormData>({
    role: "",
    aboutRole: "",
    experienceRequired: "",
    educationRequired: "",
    skillsRequired: [],
    jobType: "Full-Time",
    location: "Remote",
    salary: "",
    openings: 1
  });

  useEffect(() => {
    if (open) {
        startupProfileService.getMyProfile().then(res => {
            if (res.success && res.data) {
                setStartupId(res.data._id);
            }
        });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.includes(skill)
        ? prev.skillsRequired.filter((s) => s !== skill)
        : [...prev.skillsRequired, skill],
    }));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (!startupId) {
            toast({
                title: "Error",
                description: "Startup Profile not found. Please complete profile first.",
                variant: "destructive"
            });
            return;
        }

        // Map form data to backend schema
        const requirements = `Experience: ${formData.experienceRequired} years. Education: ${formData.educationRequired}. Skills: ${formData.skillsRequired.join(", ")}`;
        
        const jobPayload = {
            startupId: startupId,
            role: formData.role,
            aboutRole: formData.aboutRole,
            requirements: requirements,
            stipend: false, // Defaulting for now
            salary: Number(formData.salary) || 0,
            openings: Number(formData.openings) || 1,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            jobType: formData.jobType,
            location: formData.location,
            Tag: formData.skillsRequired // Send skills as Tags
        };

        const result = await jobService.createJob(jobPayload);

        if (result.success) {
            toast({
                title: "Job Posted",
                description: `"${formData.role}" has been published successfully.`,
            });
            if (onJobCreated) onJobCreated();
            onOpenChange(false);
        } else {
             toast({
                title: "Error",
                description: result.error || "Failed to post job",
                variant: "destructive"
            });
        }
    } catch (err) {
        toast({
            title: "Error",
            description: "Something went wrong.",
            variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="h-5 w-5 text-accent" />
            Create Job Opening
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Job Role <span className="text-destructive">*</span></Label>
            <Input
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> About Role
            </Label>
            <Textarea
              name="aboutRole"
              value={formData.aboutRole}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities..."
              rows={3}
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <Label>Job Type</Label>
               <select 
                name="jobType"
                value={formData.jobType}
                // @ts-ignore
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
               >
                 <option value="Full-Time">Full-Time</option>
                 <option value="Internship">Internship</option>
                 <option value="Contract">Contract</option>
               </select>
            </div>
            <div>
              <Label>Location</Label>
               <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Remote, Pune, etc."
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Experience Required (Years)</Label>
              <Input
                type="number"
                name="experienceRequired"
                value={formData.experienceRequired}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="mt-1.5"
              />
            </div>
             <div>
              <Label>Openings</Label>
              <Input
                type="number"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                min={1}
                className="mt-1.5"
              />
            </div>
          </div>
          
           <div>
              <Label className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" /> Education Required
              </Label>
              <Input
                name="educationRequired"
                value={formData.educationRequired}
                onChange={handleChange}
                placeholder="e.g. Bachelor's in CS"
                className="mt-1.5"
              />
            </div>

          <div>
            <Label className="flex items-center gap-1">
              <Layers className="h-4 w-4" /> Skills Required
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillsList.map((skill) => (
                <Badge
                  key={skill}
                  variant={formData.skillsRequired.includes(skill) ? "accent" : "outline"}
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle className="h-4 w-4" />}
            {loading ? "Publishing..." : "Publish Job"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
