// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { useToast } from "@/hooks/use-toast";
// // import { authService } from "@/services/authService";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// // export default function StartupVerificationPage() {
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();
// //   const { toast } = useToast();

// //   const [formData, setFormData] = useState({
// //     legalName: '',
// //     brandName: '',
// //     companyType: '',
// //     yearOfIncorporation: new Date().getFullYear(),
// //     registeredCity: '',
// //     registeredState: '',
// //     cin: '',
// //     gstNumber: '',
// //     startupIndiaId: '',
// //     websiteUrl: '',
// //     founderName: '',
// //     founderLinkedIn: '',
// //     companyEmail: '',
// //     founderPhone: '',
// //     teamSize: '',
// //     activeRoles: '',
// //     businessCategory: '',
// //   });

// //   const handleChange = (field: string, value: string | number) => {
// //     setFormData(prev => ({ ...prev, [field]: value }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     // Validation
// //     if (!formData.legalName || !formData.companyType || !formData.registeredCity || 
// //         !formData.registeredState || !formData.founderName || !formData.founderLinkedIn || 
// //         !formData.companyEmail || !formData.founderPhone || !formData.teamSize || 
// //         !formData.activeRoles || !formData.businessCategory) {
// //       toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
// //       return;
// //     }

// //     setLoading(true);
// //     const res = await authService.submitStartupVerification(formData as any);
// //     setLoading(false);

// //     if (res.success) {
// //       toast({ title: 'Submitted!', description: 'Your startup verification is under review.' });
// //       navigate('/startup/verification-pending');
// //     } else {
// //       toast({ title: 'Submission failed', description: res.error || 'Please try again.', variant: 'destructive' });
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-12 px-4">
// //       <div className="max-w-4xl mx-auto">
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="text-3xl">Startup Verification</CardTitle>
// //             <CardDescription>Help us verify your startup to access all features</CardDescription>
// //           </CardHeader>
// //           <CardContent>
// //             <form onSubmit={handleSubmit} className="space-y-8">
              
// //               {/* Core Company Details */}
// //               <div className="space-y-4">
// //                 <h3 className="text-xl font-semibold flex items-center gap-2">
// //                   🏢 Core Company Details
// //                 </h3>
                
// //                 <div className="grid md:grid-cols-2 gap-4">
// //                   <div>
// //                     <Label>Startup Legal Name *</Label>
// //                     <Input value={formData.legalName} onChange={(e) => handleChange('legalName', e.target.value)} required />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Brand / Operating Name (if different)</Label>
// //                     <Input value={formData.brandName} onChange={(e) => handleChange('brandName', e.target.value)} />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Company Type *</Label>
// //                     <Select value={formData.companyType} onValueChange={(val) => handleChange('companyType', val)}>
// //                       <SelectTrigger>
// //                         <SelectValue placeholder="Select type" />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         <SelectItem value="Private Limited">Private Limited</SelectItem>
// //                         <SelectItem value="LLP">LLP</SelectItem>
// //                         <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
                  
// //                   <div>
// //                     <Label>Year of Incorporation *</Label>
// //                     <Input type="number" value={formData.yearOfIncorporation} onChange={(e) => handleChange('yearOfIncorporation', parseInt(e.target.value))} required />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Registered City *</Label>
// //                     <Input value={formData.registeredCity} onChange={(e) => handleChange('registeredCity', e.target.value)} required />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Registered State (India) *</Label>
// //                     <Input value={formData.registeredState} onChange={(e) => handleChange('registeredState', e.target.value)} required />
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Legal & Authenticity Proof */}
// //               <div className="space-y-4">
// //                 <h3 className="text-xl font-semibold flex items-center gap-2">
// //                   🧾 Legal & Authenticity Proof
// //                 </h3>
                
// //                 <div className="grid md:grid-cols-2 gap-4">
// //                   <div>
// //                     <Label>CIN / LLPIN</Label>
// //                     <Input value={formData.cin} onChange={(e) => handleChange('cin', e.target.value)} placeholder="Optional" />
// //                   </div>
                  
// //                   <div>
// //                     <Label>GST Number</Label>
// //                     <Input value={formData.gstNumber} onChange={(e) => handleChange('gstNumber', e.target.value)} placeholder="Optional but preferred" />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Startup India Recognition ID</Label>
// //                     <Input value={formData.startupIndiaId} onChange={(e) => handleChange('startupIndiaId', e.target.value)} placeholder="If available" />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Official Company Website URL</Label>
// //                     <Input type="url" value={formData.websiteUrl} onChange={(e) => handleChange('websiteUrl', e.target.value)} placeholder="https://example.com" />
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Founder Verification */}
// //               <div className="space-y-4">
// //                 <h3 className="text-xl font-semibold flex items-center gap-2">
// //                   👤 Founder Verification
// //                 </h3>
                
// //                 <div className="grid md:grid-cols-2 gap-4">
// //                   <div>
// //                     <Label>Founder Full Name *</Label>
// //                     <Input value={formData.founderName} onChange={(e) => handleChange('founderName', e.target.value)} required />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Founder LinkedIn Profile URL *</Label>
// //                     <Input type="url" value={formData.founderLinkedIn} onChange={(e) => handleChange('founderLinkedIn', e.target.value)} placeholder="https://linkedin.com/in/..." required />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Official Company Email *</Label>
// //                     <Input type="email" value={formData.companyEmail} onChange={(e) => handleChange('companyEmail', e.target.value)} placeholder="Domain-based email preferred" required />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Founder Contact Number *</Label>
// //                     <Input type="tel" value={formData.founderPhone} onChange={(e) => handleChange('founderPhone', e.target.value)} placeholder="+91 XXXXXXXXXX" required />
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Operational Credibility */}
// //               <div className="space-y-4">
// //                 <h3 className="text-xl font-semibold flex items-center gap-2">
// //                   📊 Operational Credibility
// //                 </h3>
                
// //                 <div className="grid md:grid-cols-2 gap-4">
// //                   <div>
// //                     <Label>Team Size *</Label>
// //                     <Input value={formData.teamSize} onChange={(e) => handleChange('teamSize', e.target.value)} placeholder="e.g., 5-10" required />
// //                   </div>
                  
// //                   <div>
// //                     <Label>Active Hiring Role(s) *</Label>
// //                     <Input value={formData.activeRoles} onChange={(e) => handleChange('activeRoles', e.target.value)} placeholder="e.g., Frontend Developer, Designer" required />
// //                   </div>
                  
// //                   <div className="md:col-span-2">
// //                     <Label>Business Category / Industry *</Label>
// //                     <Input value={formData.businessCategory} onChange={(e) => handleChange('businessCategory', e.target.value)} placeholder="e.g., FinTech, EdTech, SaaS" required />
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="flex gap-4">
// //                 <Button type="submit" disabled={loading} className="w-full">
// //                   {loading ? 'Submitting...' : 'Submit for Verification'}
// //                 </Button>
// //               </div>
// //             </form>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // }
































// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { authService } from "@/services/authService";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// export default function StartupVerificationPage() {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     legalName: '',
//     brandName: '',
//     companyType: '',
//     yearOfIncorporation: new Date().getFullYear(),
//     registeredCity: '',
//     registeredState: '',
//     cin: '',
//     gstNumber: '',
//     startupIndiaId: '',
//     websiteUrl: '',
//     founderName: '',
//     founderLinkedIn: '',
//     companyEmail: '',
//     founderPhone: '',
//     teamSize: '',
//     activeRoles: '',
//     businessCategory: '',
//   });

//   const handleChange = (field: string, value: string | number) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.legalName || !formData.companyType || !formData.registeredCity ||
//         !formData.registeredState || !formData.founderName || !formData.founderLinkedIn ||
//         !formData.companyEmail || !formData.founderPhone || !formData.teamSize ||
//         !formData.activeRoles || !formData.businessCategory) {
//       toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
//       return;
//     }

//     setLoading(true);
//     const res = await authService.submitStartupVerification(formData as any);
//     setLoading(false);

//     if (res.success) {
//       toast({ title: 'Submitted!', description: 'Your startup verification is under review.' });
//       navigate('/startup/verification-pending');
//     } else {
//       toast({ title: 'Submission failed', description: res.error || 'Please try again.', variant: 'destructive' });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <Card className="shadow-xl border-teal-200">
//           <CardHeader className="bg-teal-600 text-white rounded-t-xl">
//             <CardTitle className="text-3xl">Startup Verification</CardTitle>
//             <CardDescription className="text-teal-100">
//               Help us verify your startup to unlock all platform features
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="p-8">
//             <form onSubmit={handleSubmit} className="space-y-10">

//               {/* Core Company Details */}
//               <SectionTitle title="🏢 Core Company Details" />

//               <div className="grid md:grid-cols-2 gap-6">
//                 <FormField label="Startup Legal Name *">
//                   <Input value={formData.legalName} onChange={(e) => handleChange('legalName', e.target.value)} required />
//                 </FormField>

//                 <FormField label="Brand / Operating Name">
//                   <Input value={formData.brandName} onChange={(e) => handleChange('brandName', e.target.value)} />
//                 </FormField>

//                 <FormField label="Company Type *">
//                   <Select value={formData.companyType} onValueChange={(val) => handleChange('companyType', val)}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Private Limited">Private Limited</SelectItem>
//                       <SelectItem value="LLP">LLP</SelectItem>
//                       <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </FormField>

//                 <FormField label="Year of Incorporation *">
//                   <Input type="number" value={formData.yearOfIncorporation}
//                     onChange={(e) => handleChange('yearOfIncorporation', parseInt(e.target.value))} />
//                 </FormField>

//                 <FormField label="Registered City *">
//                   <Input value={formData.registeredCity}
//                     onChange={(e) => handleChange('registeredCity', e.target.value)} />
//                 </FormField>

//                 <FormField label="Registered State (India) *">
//                   <Input value={formData.registeredState}
//                     onChange={(e) => handleChange('registeredState', e.target.value)} />
//                 </FormField>
//               </div>

//               {/* Legal Proof */}
//               <SectionTitle title="🧾 Legal & Authenticity Proof" />

//               <div className="grid md:grid-cols-2 gap-6">
//                 <FormField label="CIN / LLPIN">
//                   <Input value={formData.cin} onChange={(e) => handleChange('cin', e.target.value)} />
//                 </FormField>

//                 <FormField label="GST Number (Optional)">
//                   <Input value={formData.gstNumber} onChange={(e) => handleChange('gstNumber', e.target.value)} />
//                 </FormField>

//                 <FormField label="Startup India Recognition ID">
//                   <Input value={formData.startupIndiaId}
//                     onChange={(e) => handleChange('startupIndiaId', e.target.value)} />
//                 </FormField>

//                 <FormField label="Official Company Website URL">
//                   <Input type="url" value={formData.websiteUrl}
//                     onChange={(e) => handleChange('websiteUrl', e.target.value)} />
//                 </FormField>
//               </div>

//               {/* Founder Verification */}
//               <SectionTitle title="👤 Founder Verification" />

//               <div className="grid md:grid-cols-2 gap-6">
//                 <FormField label="Founder Full Name *">
//                   <Input value={formData.founderName}
//                     onChange={(e) => handleChange('founderName', e.target.value)} />
//                 </FormField>

//                 <FormField label="Founder LinkedIn URL *">
//                   <Input type="url" value={formData.founderLinkedIn}
//                     onChange={(e) => handleChange('founderLinkedIn', e.target.value)} />
//                 </FormField>

//                 <FormField label="Official Company Email *">
//                   <Input type="email" value={formData.companyEmail}
//                     onChange={(e) => handleChange('companyEmail', e.target.value)} />
//                 </FormField>

//                 <FormField label="Founder Contact Number *">
//                   <Input type="tel" value={formData.founderPhone}
//                     onChange={(e) => handleChange('founderPhone', e.target.value)} />
//                 </FormField>
//               </div>

//               {/* Operational Credibility */}
//               <SectionTitle title="📊 Operational Credibility" />

//               <div className="grid md:grid-cols-2 gap-6">
//                 <FormField label="Team Size *">
//                   <Input value={formData.teamSize}
//                     onChange={(e) => handleChange('teamSize', e.target.value)} />
//                 </FormField>

//                 <FormField label="Active Hiring Roles *">
//                   <Input value={formData.activeRoles}
//                     onChange={(e) => handleChange('activeRoles', e.target.value)} />
//                 </FormField>

//                 <div className="md:col-span-2">
//                   <FormField label="Business Category / Industry *">
//                     <Input value={formData.businessCategory}
//                       onChange={(e) => handleChange('businessCategory', e.target.value)} />
//                   </FormField>
//                 </div>
//               </div>

//               <Button type="submit"
//                 className="w-full bg-teal-600 hover:bg-teal-700 text-white"
//                 disabled={loading}>
//                 {loading ? "Submitting..." : "Submit for Verification"}
//               </Button>

//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// /* ---------- Reusable Components ---------- */

// function SectionTitle({ title }: { title: string }) {
//   return (
//     <h3 className="text-xl font-semibold text-teal-700 border-b pb-2">
//       {title}
//     </h3>
//   );
// }

// function FormField({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="space-y-2">
//       <Label className="text-teal-700 font-medium">{label}</Label>
//       {children}
//     </div>
//   );
// }














import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function StartupVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    legalName: '',
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
    
    // Reset OTP verification if phone changes
    if (field === 'founderPhone') {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp('');
    }
  };

  const handleSendOTP = async () => {
    if (!formData.founderPhone || formData.founderPhone.length < 10) {
      toast({ title: 'Invalid phone', description: 'Please enter a valid phone number', variant: 'destructive' });
      return;
    }

    setSendingOtp(true);
    const res = await authService.sendOTP(formData.founderPhone);
    setSendingOtp(false);

    if (res.success) {
      setOtpSent(true);
      toast({ 
        title: 'OTP Sent', 
        description: res.developmentOTP 
          ? `Development OTP: ${res.developmentOTP}` 
          : 'Check your phone for the OTP' 
      });
    } else {
      toast({ title: 'Failed to send OTP', description: res.error, variant: 'destructive' });
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter a 6-digit OTP', variant: 'destructive' });
      return;
    }

    setVerifyingOtp(true);
    const res = await authService.verifyOTP(formData.founderPhone, otp);
    setVerifyingOtp(false);

    if (res.success) {
      setOtpVerified(true);
      toast({ title: 'Phone Verified', description: 'Your phone number has been verified successfully' });
    } else {
      toast({ title: 'Verification Failed', description: res.error, variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVerified) {
      toast({ title: 'Phone not verified', description: 'Please verify your phone number first', variant: 'destructive' });
      return;
    }

    if (!formData.legalName || !formData.companyType || !formData.registeredCity ||
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
      toast({ title: 'Submitted!', description: 'Your startup verification is under review.' });
      navigate('/startup/verification-pending');
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

              {/* Core Company Details */}
              <SectionTitle title="🏢 Core Company Details" />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Startup Legal Name *">
                  <Input value={formData.legalName} onChange={(e) => handleChange('legalName', e.target.value)} required />
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

              {/* Legal Proof */}
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

              {/* Founder Verification */}
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
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        type="tel" 
                        value={formData.founderPhone}
                        onChange={(e) => handleChange('founderPhone', e.target.value)} 
                        placeholder="+91 XXXXXXXXXX"
                        disabled={otpVerified}
                      />
                      {!otpVerified && (
                        <Button 
                          type="button"
                          onClick={handleSendOTP}
                          disabled={sendingOtp || otpSent}
                          variant="outline"
                          className="whitespace-nowrap"
                        >
                          {sendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : otpSent ? 'Resend' : 'Send OTP'}
                        </Button>
                      )}
                      {otpVerified && (
                        <Button type="button" disabled variant="outline" className="text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {otpSent && !otpVerified && (
                      <div className="flex gap-2">
                        <Input 
                          type="text" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                        />
                        <Button 
                          type="button"
                          onClick={handleVerifyOTP}
                          disabled={verifyingOtp}
                        >
                          {verifyingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                        </Button>
                      </div>
                    )}
                  </div>
                </FormField>
              </div>

              {/* Operational Credibility */}
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
                disabled={loading || !otpVerified}
              >
                {loading ? "Submitting..." : "Submit for Verification"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

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