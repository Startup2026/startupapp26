import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Edit2,
  Save,
  Plus,
  X,
  Github,
  Linkedin,
  Globe,
  Loader2,
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { studentProfileService, StudentProfile } from "@/services/studentProfileService";
import { useAuth } from "@/contexts/AuthContext";
import { calculateProfileCompletion } from "@/lib/utils";

const initialProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  college: "",
  degree: "",
  graduationYear: "",
  skills: [] as string[],
  interests: [] as string[],
  experience: [] as { id: number; title: string; company: string; duration: string }[],
  links: {
    github: "",
    linkedin: "",
    portfolio: "",
  },
  profilepic: "",
  resume: "",
  _id: "",
};

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(initialProfile);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profilepicFile, setProfilepicFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const mapApiProfile = (apiProfile: StudentProfile) => ({
    firstName: apiProfile.firstName || "",
    lastName: apiProfile.lastName || "",
    email: apiProfile.email || "",
    phone: apiProfile.phone || "",
    location: apiProfile.location || "",
    bio: apiProfile.bio || "",
    college: apiProfile.education?.[0]?.institution || "",
    degree: `${apiProfile.education?.[0]?.degree || ""} ${apiProfile.education?.[0]?.field || ""}`.trim(),
    graduationYear: apiProfile.education?.[0]?.endYear || "",
    skills: apiProfile.skills || [],
    interests: apiProfile.interests || [],
    experience: (apiProfile.experience || []).map((exp: any, idx: number) => ({
      id: idx,
      title: exp.title || "",
      company: exp.company || "",
      duration: exp.duration || "",
    })),
    links: {
      github: apiProfile.githubUrl || "",
      linkedin: apiProfile.linkedinUrl || "",
      portfolio: apiProfile.portfolioUrl || "",
    },
    profilepic: apiProfile.profilepic || "",
    resume: apiProfile.resumeUrl || "",
    _id: apiProfile._id,
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const result = await studentProfileService.getMyProfile();
        if (result.success && result.data) {
          const mappedProfile = mapApiProfile(result.data);
          setProfile(mappedProfile);
          setEditedProfile(mappedProfile);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const currentProfile = isEditing ? editedProfile : profile;

  // Calculate profile completion
  const completionPercentage = calculateProfileCompletion(currentProfile);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = new FormData();
      updateData.append("firstName", editedProfile.firstName);
      updateData.append("lastName", editedProfile.lastName);
      updateData.append("email", editedProfile.email);
      updateData.append("phone", editedProfile.phone);
      updateData.append("location", editedProfile.location);
      updateData.append("bio", editedProfile.bio);
      updateData.append("githubUrl", editedProfile.links.github);
      updateData.append("linkedinUrl", editedProfile.links.linkedin);
      updateData.append("portfolioUrl", editedProfile.links.portfolio);
      updateData.append("skills", JSON.stringify(editedProfile.skills));
      updateData.append("interests", JSON.stringify(editedProfile.interests));
      updateData.append(
        "experience",
        JSON.stringify(editedProfile.experience.map(({ id, ...rest }) => rest))
      );
      updateData.append(
        "education",
        JSON.stringify([
          {
            institution: editedProfile.college,
            degree: editedProfile.degree.split(" ")[0] || "",
            field: editedProfile.degree.split(" ").slice(1).join(" ") || "",
            startYear: "",
            endYear: editedProfile.graduationYear,
          },
        ])
      );
      if (profilepicFile) updateData.append("profilepic", profilepicFile);
      if (resumeFile) updateData.append("resume", resumeFile);

      const result = await studentProfileService.updateMyProfile(updateData);
      
      if (result.success) {
        if (result.data) {
          const mappedProfile = mapApiProfile(result.data);
          setProfile(mappedProfile);
          setEditedProfile(mappedProfile);
        } else {
          setProfile(editedProfile);
        }
        setProfilepicFile(null);
        setResumeFile(null);
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been saved successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !editedProfile.skills.includes(newSkill)) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((s) => s !== skill),
    });
  };

  const addInterest = () => {
    if (newInterest && !editedProfile.interests.includes(newInterest)) {
      setEditedProfile({
        ...editedProfile,
        interests: [...editedProfile.interests, newInterest],
      });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setEditedProfile({
      ...editedProfile,
      interests: editedProfile.interests.filter((i) => i !== interest),
    });
  };

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal details and preferences
            </p>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => {
                setEditedProfile(profile);
                setIsEditing(true);
              }}
              className="mt-4 md:mt-0"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile completion and avatar */}
          <div className="space-y-6">
            {/* Profile completion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent">{completionPercentage}%</span>
                    <span className="text-sm text-muted-foreground">
                      {completionPercentage === 100 ? "Complete!" : "Keep going!"}
                    </span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                  {completionPercentage < 100 && (
                    <p className="text-xs text-muted-foreground">
                      Complete your profile to get better job recommendations
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Avatar section */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-accent">
                    {currentProfile.firstName?.[0] || ""}
                    {currentProfile.lastName?.[0] || ""}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">
                  {currentProfile.firstName} {currentProfile.lastName}
                </h3>
                <p className="text-muted-foreground">{currentProfile.college}</p>
                {isEditing && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="profilepic" className="text-sm">Profile Photo</Label>
                    <Input
                      id="profilepic"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilepicFile(e.target.files?.[0] || null)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resume</CardTitle>
              </CardHeader>
              <CardContent>
                {currentProfile.resume ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <FileText className="h-8 w-8 text-accent" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{currentProfile.resume.split('/').pop()}</p>
                        <p className="text-xs text-muted-foreground">Current resume on file</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a 
                        href={currentProfile.resume.startsWith('http') ? currentProfile.resume : `http://localhost:3000${currentProfile.resume}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No resume uploaded</p>
                )}
                {isEditing && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="resume" className="text-sm">Resume</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Github className="h-4 w-4" /> GitHub
                      </Label>
                      <Input
                        value={editedProfile.links.github}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            links: { ...editedProfile.links, github: e.target.value },
                          })
                        }
                        placeholder="github.com/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </Label>
                      <Input
                        value={editedProfile.links.linkedin}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            links: { ...editedProfile.links, linkedin: e.target.value },
                          })
                        }
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Portfolio
                      </Label>
                      <Input
                        value={editedProfile.links.portfolio}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            links: { ...editedProfile.links, portfolio: e.target.value },
                          })
                        }
                        placeholder="yourwebsite.com"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {currentProfile.links.github && (
                      <a
                        href={`https://${currentProfile.links.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        {currentProfile.links.github}
                      </a>
                    )}
                    {currentProfile.links.linkedin && (
                      <a
                        href={`https://${currentProfile.links.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                        {currentProfile.links.linkedin}
                      </a>
                    )}
                    {currentProfile.links.portfolio && (
                      <a
                        href={`https://${currentProfile.links.portfolio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        {currentProfile.links.portfolio}
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column - Main profile details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.firstName}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, firstName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{currentProfile.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.lastName}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, lastName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{currentProfile.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, email: e.target.value })
                      }
                    />
                  ) : (
                    <p className="font-medium">{currentProfile.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.phone}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{currentProfile.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Location
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.location}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, location: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{currentProfile.location}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground">{currentProfile.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>College/University</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.college}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, college: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{currentProfile.college}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.graduationYear}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, graduationYear: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{currentProfile.graduationYear}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.degree}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, degree: e.target.value })
                      }
                    />
                  ) : (
                    <p className="font-medium">{currentProfile.degree}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className={`px-3 py-1.5 ${isEditing ? "pr-2" : ""}`}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    />
                    <Button variant="outline" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests (Domains)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="accent"
                      className={`px-3 py-1.5 ${isEditing ? "pr-2" : ""}`}
                    >
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => removeInterest(interest)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Add an interest..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                    />
                    <Button variant="outline" onClick={addInterest}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience
                </CardTitle>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Experience
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {currentProfile.experience.length > 0 ? (
                  <div className="space-y-4">
                    {currentProfile.experience.map((exp) => (
                      <div key={exp.id} className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-muted-foreground">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">{exp.duration}</p>
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">
                    No experience added yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
