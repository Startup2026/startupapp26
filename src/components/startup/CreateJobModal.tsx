import { useState } from "react";
import { Briefcase, FileText, GraduationCap, Layers, CheckCircle } from "lucide-react";
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

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface JobFormData {
  title: string;
  description: string;
  experienceRequired: string;
  educationRequired: string;
  skillsRequired: string[];
}

const skillsList = [
  "React", "Node.js", "MongoDB", "Express", "Python", "Java", "AWS", "Docker",
  "TypeScript", "PostgreSQL", "GraphQL", "Kubernetes"
];

export function CreateJobModal({ open, onOpenChange }: CreateJobModalProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    experienceRequired: "",
    educationRequired: "",
    skillsRequired: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Job Created:", formData);
    toast({
      title: "Job Posted",
      description: `"${formData.title}" has been published successfully.`,
    });
    onOpenChange(false);
    setFormData({ title: "", description: "", experienceRequired: "", educationRequired: "", skillsRequired: [] });
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

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <Label>Job Title <span className="text-destructive">*</span></Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> Job Description
            </Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={4}
              className="mt-1.5"
            />
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

          <Button type="submit" variant="hero" className="w-full gap-2">
            <CheckCircle className="h-4 w-4" />
            Publish Job
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
