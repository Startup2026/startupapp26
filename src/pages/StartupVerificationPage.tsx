





import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function StartupVerificationPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: '',
    brandName: '',
    companyType: '',
    yearOfIncorporation: new Date().getFullYear(),
    registeredCity: '',
    registeredState: '',
    cin: '',
    gstNumber: '',
    startupIndiaId: '',
    websiteUrl: '',
    founderName: '',
    founderLinkedIn: '',
    companyEmail: '',
    founderPhone: '',
    teamSize: '',
    activeRoles: '',
    businessCategory: '',
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.companyType || !formData.registeredCity ||
        !formData.registeredState || !formData.founderName || !formData.founderLinkedIn ||
        !formData.companyEmail || !formData.founderPhone || !formData.teamSize ||
        !formData.activeRoles || !formData.businessCategory) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const res = await authService.submitStartupVerification(formData as any);
    setLoading(false);

    if (res.success) {
      toast({ title: 'Submitted!', description: 'Your startup verification is under review. Please sign in again.' });
      navigate('/login');
    } else {
      toast({ title: 'Submission failed', description: res.error || 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-teal-200">
          <CardHeader className="bg-teal-600 text-white rounded-t-xl">
            <CardTitle className="text-3xl">Startup Verification</CardTitle>
            <CardDescription className="text-teal-100">
              Help us verify your startup to unlock all platform features
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-10">

              <SectionTitle title="🏢 Core Company Details" />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Startup Legal Name *">
                  <Input value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} required />
                </FormField>

                <FormField label="Brand / Operating Name">
                  <Input value={formData.brandName} onChange={(e) => handleChange('brandName', e.target.value)} />
                </FormField>

                <FormField label="Company Type *">
                  <Select value={formData.companyType} onValueChange={(val) => handleChange('companyType', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Private Limited">Private Limited</SelectItem>
                      <SelectItem value="LLP">LLP</SelectItem>
                      <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Year of Incorporation *">
                  <Input type="number" value={formData.yearOfIncorporation}
                    onChange={(e) => handleChange('yearOfIncorporation', parseInt(e.target.value))} />
                </FormField>

                <FormField label="Registered City *">
                  <Input value={formData.registeredCity}
                    onChange={(e) => handleChange('registeredCity', e.target.value)} />
                </FormField>

                <FormField label="Registered State (India) *">
                  <Input value={formData.registeredState}
                    onChange={(e) => handleChange('registeredState', e.target.value)} />
                </FormField>
              </div>

              <SectionTitle title="🧾 Legal & Authenticity Proof" />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="CIN / LLPIN">
                  <Input value={formData.cin} onChange={(e) => handleChange('cin', e.target.value)} />
                </FormField>

                <FormField label="GST Number (Optional)">
                  <Input value={formData.gstNumber} onChange={(e) => handleChange('gstNumber', e.target.value)} />
                </FormField>

                <FormField label="Startup India Recognition ID">
                  <Input value={formData.startupIndiaId}
                    onChange={(e) => handleChange('startupIndiaId', e.target.value)} />
                </FormField>

                <FormField label="Official Company Website URL">
                  <Input type="url" value={formData.websiteUrl}
                    onChange={(e) => handleChange('websiteUrl', e.target.value)} />
                </FormField>
              </div>

              <SectionTitle title="👤 Founder Verification" />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Founder Full Name *">
                  <Input value={formData.founderName}
                    onChange={(e) => handleChange('founderName', e.target.value)} />
                </FormField>

                <FormField label="Founder LinkedIn URL *">
                  <Input type="url" value={formData.founderLinkedIn}
                    onChange={(e) => handleChange('founderLinkedIn', e.target.value)} />
                </FormField>

                <FormField label="Official Company Email *">
                  <Input type="email" value={formData.companyEmail}
                    onChange={(e) => handleChange('companyEmail', e.target.value)} />
                </FormField>

                <FormField label="Founder Contact Number *">
                  <Input 
                    type="tel" 
                    value={formData.founderPhone}
                    onChange={(e) => handleChange('founderPhone', e.target.value)} 
                    placeholder="+91 XXXXXXXXXX"
                  />
                </FormField>
              </div>

              <SectionTitle title="📊 Operational Credibility" />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Team Size *">
                  <Input value={formData.teamSize}
                    onChange={(e) => handleChange('teamSize', e.target.value)} />
                </FormField>

                <FormField label="Active Hiring Roles *">
                  <Input value={formData.activeRoles}
                    onChange={(e) => handleChange('activeRoles', e.target.value)} />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Business Category / Industry *">
                    <Input value={formData.businessCategory}
                      onChange={(e) => handleChange('businessCategory', e.target.value)} />
                  </FormField>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                disabled={loading}
              >
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : "Submit for Verification"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-xl font-semibold text-teal-700 border-b pb-2">
      {title}
    </h3>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-teal-700 font-medium">{label}</Label>
      {children}
    </div>
  );
}