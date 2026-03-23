import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Globe, Linkedin, Twitter, Github, Users, MapPin, Calendar, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/Logo";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { startupProfileService } from "@/services/startupProfileService";
import { normalizePlanName } from "@/config/planFeatures";

const industries = [
  "FinTech",
  "EdTech",
  "HealthTech",
  "AI/ML",
  "SaaS",
  "E-Commerce",
  "Web3",
  "ClimateTech",
  "DeepTech",
  "Other",
] as const;

const stages = ["Idea", "MVP", "Early Traction", "Growth", "Scaling"] as const;

type Industry = (typeof industries)[number];
type Stage = (typeof stages)[number];

type LeadershipMember = {
  user: string;
  role: string;
};

interface StartupProfileFormData {
  startupName: string;
  tagline: string;
  aboutus: string;
  productOrService: string;
  cultureAndValues: string;
  industry: Industry;
  stage: Stage;
  website: string;
  profilepic: string;
  linkedin: string;
  twitter: string;
  github: string;
  foundedYear: string;
  teamSize: string;
  numberOfEmployees: string;
  city: string;
  country: string;
  hiring: boolean;
  leadershipTeam: LeadershipMember[];
  brandName: string;
  companyType: string;
  registeredCity: string;
  registeredState: string;
  cin: string;
  gstNumber: string;
  llpin: string;
  udyamNumber: string;
  startupIndiaId: string;
  founderPhone: string;
  founderEmail: string;
  legally_registered: boolean;
  registration_type: string;
  year_of_incorporation: string;
  team_size_range: string;
  primary_business_model: string;
  owns_proprietary_product: boolean;
  product_url: string;
  revenue_model: string;
  primarily_service_based: boolean;
  product_description: string;
  incubator_claimed: boolean;
  incubationCode: string;
  affiliatedIncubatorName: string;
  incubatorVerified: boolean;
  wantsRecruiterPlan: boolean;
}

const CURRENT_YEAR = new Date().getFullYear().toString();

const CreateStartupProfilePage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StartupProfileFormData>({
    startupName: "",
    tagline: "",
    aboutus: "",
    productOrService: "",
    cultureAndValues: "",
    industry: industries[0],
    stage: stages[0],
    website: "",
    profilepic: "",
    linkedin: "",
    twitter: "",
    github: "",
    foundedYear: CURRENT_YEAR,
    teamSize: "",
    numberOfEmployees: "",
    city: "",
    country: "",
    hiring: false,
    leadershipTeam: [{ user: "", role: "" }],
    brandName: "",
    companyType: "",
    registeredCity: "",
    registeredState: "",
    cin: "",
    gstNumber: "",
    llpin: "",
    udyamNumber: "",
    startupIndiaId: "",
    founderPhone: "",
    founderEmail: "",
    legally_registered: false,
    registration_type: "",
    year_of_incorporation: CURRENT_YEAR,
    team_size_range: "",
    primary_business_model: "",
    owns_proprietary_product: false,
    product_url: "",
    revenue_model: "",
    primarily_service_based: false,
    product_description: "",
    incubator_claimed: false,
    incubationCode: "",
    affiliatedIncubatorName: "",
    incubatorVerified: false,
    wantsRecruiterPlan: false,
  });

  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const res = await startupProfileService.getMyProfile();
        if (res.success && res.data) {
          const p = res.data;
          const incubatorRef = (p as any).incubatorId;
          const affiliatedIncubatorName = typeof incubatorRef === "object" && incubatorRef
            ? incubatorRef.name || ""
            : (p as any).incubator || "";
          setExistingProfileId(p._id);
          
          setFormData(prev => ({
            ...prev,
            startupName: p.startupName || prev.startupName,
            tagline: p.tagline || prev.tagline,
            aboutus: p.aboutus || prev.aboutus,
            productOrService: p.productOrService || prev.productOrService,
            cultureAndValues: p.cultureAndValues || prev.cultureAndValues,
            industry: (p.industry as any) || prev.industry,
            stage: (p.stage as any) || prev.stage,
            website: p.website || prev.website,
            profilepic: p.profilepic || prev.profilepic,
            linkedin: p.socialLinks?.linkedin || prev.linkedin,
            twitter: p.socialLinks?.twitter || prev.twitter,
            github: p.socialLinks?.github || prev.github,
            foundedYear: p.foundedYear ? p.foundedYear.toString() : prev.foundedYear,
            teamSize: p.teamSize ? p.teamSize.toString() : prev.teamSize,
            numberOfEmployees: p.numberOfEmployees ? p.numberOfEmployees.toString() : prev.numberOfEmployees,
            city: p.location?.city || prev.city,
            country: p.location?.country || prev.country,
            hiring: p.hiring ?? prev.hiring,
            leadershipTeam: p.leadershipTeam?.length 
              ? p.leadershipTeam.map(m => ({ user: m.user || "", role: m.role || "" }))
              : prev.leadershipTeam,
            
            // Map other fields similarly 
            // Note: If backend doesn't return these fields (e.g. eligibility data), 
            // the user will have to re-enter them if they are required.
            // But we can try to map what we have.
             
             // Verification fields might be part of the profile or separate
             // If they are in profile model, map them:
             brandName: (p as any).brandName || prev.brandName,
             companyType: (p as any).companyType || prev.companyType,
             registeredCity: (p as any).registeredCity || prev.registeredCity,
             registeredState: (p as any).registeredState || prev.registeredState,
             cin: (p as any).cin || prev.cin,
             gstNumber: (p as any).gstNumber || prev.gstNumber,
             llpin: (p as any).llpin || prev.llpin,
             udyamNumber: (p as any).udyamNumber || prev.udyamNumber,
             startupIndiaId: (p as any).startupIndiaId || prev.startupIndiaId,
             founderPhone: (p as any).founderPhone || prev.founderPhone,
             founderEmail: (p as any).founderEmail || prev.founderEmail,

             // Eligibility
             legally_registered: (p as any).legally_registered ?? prev.legally_registered,
             registration_type: (p as any).registration_type || prev.registration_type,
             year_of_incorporation: (p as any).year_of_incorporation ? (p as any).year_of_incorporation.toString() : prev.year_of_incorporation,
             team_size_range: (p as any).team_size_range || prev.team_size_range,
             primary_business_model: (p as any).primary_business_model || prev.primary_business_model,
             owns_proprietary_product: (p as any).owns_proprietary_product ?? prev.owns_proprietary_product,
             product_url: (p as any).product_url || prev.product_url,
             revenue_model: (p as any).revenue_model || prev.revenue_model,
             primarily_service_based: (p as any).primarily_service_based ?? prev.primarily_service_based,
             product_description: (p as any).product_description || prev.product_description,

             // Incubation
             incubator_claimed: (p as any).incubator_claimed ?? prev.incubator_claimed,
             incubationCode: prev.incubationCode,
             affiliatedIncubatorName,
             incubatorVerified: (p as any).incubator_verified ?? prev.incubatorVerified,
             wantsRecruiterPlan: (p as any).hasRecruiterPlan ?? prev.wantsRecruiterPlan,
          }));
        }
      } catch (err) {
        // Ignore error if profile not found (404)
        console.log("No existing profile found or error fetching", err);
      }
    };

    fetchExistingProfile();
  }, []);

  const handleLeaderChange = (index: number, key: "user" | "role", value: string) => {
    setFormData((prev) => ({
      ...prev,
      leadershipTeam: prev.leadershipTeam.map((member, idx) =>
        idx === index ? { ...member, [key]: value } : member
      ),
    }));
  };

  const addLeader = () => {
    setFormData((prev) => ({
      ...prev,
      leadershipTeam: [...prev.leadershipTeam, { user: "", role: "" }],
    }));
  };

  const removeLeader = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      leadershipTeam: prev.leadershipTeam.filter((_, idx) => idx !== index),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasLockedIncubator = formData.incubatorVerified && !!formData.affiliatedIncubatorName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
    setIsSubmitting(true);

    try {
      const toNumber = (value: string) => (value ? Number(value) : undefined);
      const { affiliatedIncubatorName } = formData;

      if (formData.incubator_claimed && !hasLockedIncubator && !formData.incubationCode.trim()) {
        toast({
          title: "Incubation code required",
          description: "Enter the incubation code sent to your company through Wostup mail.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const profileData = {
        userId: user?._id || "",
        startupName: formData.startupName,
        tagline: formData.tagline,
        aboutus: formData.aboutus,
        productOrService: formData.productOrService,
        cultureAndValues: formData.cultureAndValues,
        industry: formData.industry,
        stage: formData.stage,
        website: formData.website,
        profilepic: formData.profilepic,
        socialLinks: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          github: formData.github,
        },
        foundedYear: toNumber(formData.foundedYear),
        teamSize: toNumber(formData.teamSize),
        numberOfEmployees: toNumber(formData.numberOfEmployees),
        location: {
          city: formData.city || undefined,
          country: formData.country || undefined,
        },
        hiring: formData.hiring,
        leadershipTeam: formData.leadershipTeam
          .map((member) => ({
            user: member.user.trim() || undefined,
            role: member.role.trim() || undefined,
          }))
          .filter((member) => member.user || member.role),
        // Verification fields
        brandName: formData.brandName || undefined,
        companyType: formData.companyType || undefined,
        registeredCity: formData.registeredCity || undefined,
        registeredState: formData.registeredState || undefined,
        cin: formData.companyType === "LLP" ? formData.llpin : formData.cin || undefined,
        gstNumber: formData.gstNumber || undefined,
        startupIndiaId: formData.startupIndiaId || undefined,
        founderPhone: formData.founderPhone || undefined,
        founderEmail: formData.founderEmail || undefined,

        // Eligibility Data
        legally_registered: formData.legally_registered,
        registration_type: formData.registration_type || undefined,
        year_of_incorporation: toNumber(formData.year_of_incorporation),
        team_size_range: formData.team_size_range || undefined,
        primary_business_model: formData.primary_business_model || undefined,
        owns_proprietary_product: formData.owns_proprietary_product,
        product_url: formData.product_url || undefined,
        revenue_model: formData.revenue_model || undefined,
        primarily_service_based: formData.primarily_service_based,
        product_description: formData.product_description || undefined,

        // Incubation Data
        incubator_claimed: formData.incubator_claimed,
        incubationCode: formData.incubator_claimed ? formData.incubationCode.trim() || undefined : undefined,
        affiliatedIncubatorName,
        incubatorVerified: formData.incubatorVerified,
        wantsRecruiterPlan: formData.wantsRecruiterPlan,
      };

      console.log("Submitting Profile Data:", {
        original: formData,
        constructed: profileData,
        incubationCodePayload: profileData.incubationCode,
      });

      let result;
      if (existingProfileId) {
        // Use update logic
        const updatePayload = {
          ...profileData,
          // Remove userId from update payload if not allowed
          userId: undefined 
        };
        // For existing profiles, we call update
        result = await startupProfileService.updateProfile(existingProfileId, updatePayload as any); // Type assertion if needed
      } else {
        result = await startupProfileService.createProfile(profileData);
      }

      if (result.success) {
        await refreshUser();
        const approval = result.data?.approval_status || result.data?.profile?.approval_status;
        const status = result.data?.eligibility_status || result.data?.profile?.eligibility_status;
        const currentPlan = normalizePlanName(result.data?.subscriptionPlan || result.data?.profile?.subscriptionPlan);
        
        if (approval === 'Approved') {
           toast({
             title: existingProfileId ? "Profile Updated & Verified!" : "Profile Created & Verified!",
             description: "Your startup meets our eligibility criteria. Proceeding to the next step.",
             duration: 6000
           });
           
           if (currentPlan === 'FREE') {
              navigate("/startup/select-plan");
           } else {
              navigate("/startup/dashboard");
           }
        } else if (approval === 'Pending') {
           toast({
             title: "Verification Pending",
             description: "Your documents are currently being verified (CIN/GSTN). Redirecting to home while we process.",
             variant: "default",
             duration: 8000
           });
           // Redirect to home page as requested if not immediately verified
           setTimeout(() => navigate("/"), 3000);
        } else if (approval === 'Rejected') {
           toast({
             title: "Verification Rejected",
             description: "Your startup verification was rejected. Please contact support or re-check your details. Redirecting to home.",
             variant: "destructive",
             duration: 8000
           });
           setTimeout(() => navigate("/"), 3000);
        } else {
           if (status === 'Needs Manual Review') {
             toast({
               title: "Under Review",
               description: "Based on your information, our team will perform a manual review. Redirecting to home while we process.",
               duration: 8000
             });
             setTimeout(() => navigate("/"), 3000);
           } else if (status === 'Not Eligible') {
             toast({
               title: "Not Eligible",
               description: "Sorry, your startup does not meet our minimum eligibility criteria. Redirecting to home.",
               variant: "destructive",
               duration: 8000
             });
             setTimeout(() => navigate("/"), 3000);
             return;
           } else {
             toast({
               title: existingProfileId ? "Profile Updated" : "Profile Submitted",
               description: "Your profile has been saved and is pending admin approval. Redirecting to home.",
               duration: 8000
             });
             setTimeout(() => navigate("/"), 3000);
           }
        }
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
          <h1 className="text-3xl font-bold text-foreground">
            {existingProfileId ? "Complete Your Verification" : "Set Up Your Startup Profile"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {existingProfileId 
              ? "Update your details to verify your startup and access features."
              : "Tell us about your startup to attract the best talent"
            }
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
                  <Label htmlFor="profilepic">Logo URL</Label>
                  <Input
                    id="profilepic"
                    name="profilepic"
                    type="url"
                    value={formData.profilepic}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutus">About Us <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="aboutus"
                    name="aboutus"
                    value={formData.aboutus}
                    onChange={handleChange}
                    placeholder="Tell us about your startup, mission, and vision..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productOrService">Product or Service</Label>
                  <Textarea
                    id="productOrService"
                    name="productOrService"
                    value={formData.productOrService}
                    onChange={handleChange}
                    placeholder="What do you build or provide?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cultureAndValues">Culture and Values</Label>
                  <Textarea
                    id="cultureAndValues"
                    name="cultureAndValues"
                    value={formData.cultureAndValues}
                    onChange={handleChange}
                    placeholder="Share your team culture and values"
                    rows={3}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                    <Input
                      id="numberOfEmployees"
                      name="numberOfEmployees"
                      type="number"
                      value={formData.numberOfEmployees}
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

            {/* Verification Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Verification Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyType">Company Type</Label>
                  <Select
                    value={formData.companyType}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, companyType: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Private Limited Company">Private Limited Company</SelectItem>
                      <SelectItem value="Public Limited Company">Public Limited Company</SelectItem>
                      <SelectItem value="LLP">LLP</SelectItem>
                      <SelectItem value="Partnership Firm">Partnership Firm</SelectItem>
                      <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="One Person Company">One Person Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleChange}
                      placeholder="Trading name if different"
                    />
                  </div>
                  
                  {(formData.companyType === "Private Limited Company" || formData.companyType === "Public Limited Company" || formData.companyType === "One Person Company") && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="cin">CIN (Corporate Identification Number) <span className="text-destructive">*</span></Label>
                      <Input
                        id="cin"
                        name="cin"
                        value={formData.cin}
                        onChange={handleChange}
                        placeholder="U12345KA2..."
                        required
                      />
                    </div>
                  )}

                  {formData.companyType === "LLP" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="llpin">LLPIN (LLP Identification Number) <span className="text-destructive">*</span></Label>
                      <Input
                        id="llpin"
                        name="llpin"
                        value={formData.llpin}
                        onChange={handleChange}
                        placeholder="AAA-1234"
                        required
                      />
                    </div>
                  )}

                  {(formData.companyType === "Partnership Firm" || formData.companyType === "Sole Proprietorship") && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="gstNumber">GST Number {formData.companyType === "Sole Proprietorship" ? "" : <span className="text-destructive">*</span>}</Label>
                      <Input
                        id="gstNumber"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        placeholder="22AAAAA0000A1Z5"
                        required={formData.companyType !== "Sole Proprietorship"}
                      />
                    </div>
                  )}
                  
                  {formData.companyType === "Sole Proprietorship" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="udyamNumber">Udyam Registration Number {formData.gstNumber ? "" : <span className="text-destructive">*</span>}</Label>
                      <Input
                        id="udyamNumber"
                        name="udyamNumber"
                        value={formData.udyamNumber}
                        onChange={handleChange}
                        placeholder="UDYAM-XX-00-0000000"
                        required={!formData.gstNumber}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startupIndiaId">Startup India ID (Optional)</Label>
                    <Input
                      id="startupIndiaId"
                      name="startupIndiaId"
                      value={formData.startupIndiaId}
                      onChange={handleChange}
                      placeholder="DIPP..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registeredCity">Registered City</Label>
                    <Input
                      id="registeredCity"
                      name="registeredCity"
                      value={formData.registeredCity}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registeredState">Registered State</Label>
                    <Input
                      id="registeredState"
                      name="registeredState"
                      value={formData.registeredState}
                      onChange={handleChange}
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="founderEmail">Founder Email</Label>
                    <Input
                      id="founderEmail"
                      name="founderEmail"
                      type="email"
                      value={formData.founderEmail}
                      onChange={handleChange}
                      placeholder="For verification contact"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="founderPhone">Founder Phone</Label>
                    <Input
                      id="founderPhone"
                      name="founderPhone"
                      type="tel"
                      value={formData.founderPhone}
                      onChange={handleChange}
                    />
                  </div>
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
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="linkedin.com/company/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" /> Twitter
                    </Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      type="url"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub
                    </Label>
                    <Input
                      id="github"
                      name="github"
                      type="url"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="github.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leadership Team */}
            <Card>
              <CardHeader>
                <CardTitle>Leadership Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.leadershipTeam.map((member, index) => (
                  <div key={`leader-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-3 space-y-2">
                      <Label htmlFor={`leader-user-${index}`}>Leader User ID</Label>
                      <Input
                        id={`leader-user-${index}`}
                        value={member.user}
                        onChange={(e) => handleLeaderChange(index, "user", e.target.value)}
                        placeholder="User ID"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor={`leader-role-${index}`}>Role</Label>
                      <Input
                        id={`leader-role-${index}`}
                        value={member.role}
                        onChange={(e) => handleLeaderChange(index, "role", e.target.value)}
                        placeholder="e.g., CEO"
                      />
                    </div>
                    <div className="md:col-span-5 flex justify-end">
                      {formData.leadershipTeam.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeLeader(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={addLeader}>
                  Add Leader
                </Button>
              </CardContent>
            </Card>

            {/* Eligibility Questionnaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Eligibility Questionnaire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="legally_registered"
                    checked={formData.legally_registered}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, legally_registered: !!checked }))}
                  />
                  <Label htmlFor="legally_registered" className="cursor-pointer">Is your startup legally registered?</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_type">Registration Type</Label>
                  <Select
                    value={formData.registration_type}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, registration_type: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Registration Type" /></SelectTrigger>
                    <SelectContent>
                      {['Private Limited', 'LLP', 'Sole Proprietorship', 'Partnership', 'Public Limited', 'Other'].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year_of_incorporation">Year of Incorporation</Label>
                  <Input
                    id="year_of_incorporation"
                    name="year_of_incorporation"
                    type="number"
                    value={formData.year_of_incorporation}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team_size_range">Team Size Range</Label>
                  <Select
                    value={formData.team_size_range}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, team_size_range: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Team Size" /></SelectTrigger>
                    <SelectContent>
                      {['1-10', '11-50', '51-200', '201-500', '500+'].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary_business_model">Primary Business Model</Label>
                  <Select
                    value={formData.primary_business_model}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, primary_business_model: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Business Model" /></SelectTrigger>
                    <SelectContent>
                      {['SaaS', 'Marketplace', 'AI', 'Mobile App', 'Deep Tech', 'Hardware', 'E-Commerce', 'Other'].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="owns_proprietary_product"
                    checked={formData.owns_proprietary_product}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, owns_proprietary_product: !!checked }))}
                  />
                  <Label htmlFor="owns_proprietary_product" className="cursor-pointer">Do you own a proprietary product/service?</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_url">Product URL</Label>
                  <Input id="product_url" name="product_url" type="url" value={formData.product_url} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue_model">Revenue Model</Label>
                  <Select
                    value={formData.revenue_model}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, revenue_model: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Revenue Model" /></SelectTrigger>
                    <SelectContent>
                      {['Subscription', 'Licensing', 'Transaction Fees', 'Client Contracts', 'Hourly Billing', 'Ad-Based', 'Other'].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="primarily_service_based"
                    checked={formData.primarily_service_based}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, primarily_service_based: !!checked }))}
                  />
                  <Label htmlFor="primarily_service_based" className="cursor-pointer">Is your startup primarily service-based?</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_description">Product Description</Label>
                  <Textarea id="product_description" name="product_description" value={formData.product_description} onChange={handleChange} rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Recruiter Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Recruiter Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="wantsRecruiterPlan"
                    checked={formData.wantsRecruiterPlan}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, wantsRecruiterPlan: !!checked }))}
                  />
                    <Label htmlFor="wantsRecruiterPlan" className="cursor-pointer">
                      I want to opt-in for the Recruiter Plan to access advanced hiring features.
                    </Label>
                  </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  {existingProfileId ? "Update & Verify Profile" : "Complete Profile"}
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateStartupProfilePage;
