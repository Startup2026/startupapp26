// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { authService } from "@/services/authService";
// import { useLocation } from 'react-router-dom';
// import { useAuth } from "@/contexts/AuthContext";

// export default function VerifyEmailPage() {
//   const [email, setEmail] = useState('');
//   const [token, setToken] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { state } = useLocation();
//   const { verifyEmail } = useAuth();

//   useEffect(() => {
//     const s: any = state || {};
//     if (s.email) setEmail(s.email);
//   }, [state]);

//   const handleVerify = async () => {
//     setLoading(true);
//     const res = await verifyEmail(email, token);
//     setLoading(false);
//     if (res.success) {
//       toast({ title: 'Email verified', description: 'Your account is now active.' });
      
//       // Handle onboarding redirection
//       if (res.onboardingStep === 'profile') {
//         navigate('/startup/create-profile');
//       } else if (res.onboardingStep === 'plan') {
//         navigate('/startup/select-plan');
//       } else {
//         navigate('/login'); // Fallback or student dashboard if we added logic for it
//       }
//     } else {
//       toast({ title: 'Verification failed', description: res.error || 'Invalid code or expired.', variant: 'destructive' });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-8">
//       <div className="w-full max-w-lg">
//         <h2 className="text-2xl font-bold">Verify your email</h2>
//         <p className="mt-4 text-muted-foreground">Enter the 6-digit code we sent to your email.</p>

//         <div className="mt-6 space-y-4">
//           <div>
//             <Label>Email</Label>
//             <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
//           </div>
//           <div>
//             <Label>Verification code</Label>
//             <Input value={token} onChange={(e) => setToken(e.target.value)} maxLength={6} />
//           </div>
//           <div className="flex gap-3">
//             <Button onClick={handleVerify} disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</Button>
//             <Button variant="secondary" onClick={() => navigate('/verify-pending')}>Back</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



























import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useLocation } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useLocation();
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const s: any = state || {};
    if (s.email) setEmail(s.email);
  }, [state]);

  const handleVerify = async () => {
    setLoading(true);
    const res = await verifyEmail(email, token);
    setLoading(false);
    
    if (res.success) {
      toast({ title: 'Email verified', description: 'Your account is now active.' });
      
      // Handle onboarding redirection
      if (res.onboardingStep === 'startup-verification') {
        navigate('/startup/verification');
      } else if (res.onboardingStep === 'profile') {
        navigate('/startup/create-profile');
      } else if (res.onboardingStep === 'plan') {
        navigate('/startup/select-plan');
      } else {
        navigate('/login');
      }
    } else {
      toast({ title: 'Verification failed', description: res.error || 'Invalid code or expired.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold">Verify your email</h2>
        <p className="mt-4 text-muted-foreground">Enter the 6-digit code we sent to your email.</p>

        <div className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div>
            <Label>Verification code</Label>
            <Input value={token} onChange={(e) => setToken(e.target.value)} maxLength={6} />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleVerify} disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</Button>
            <Button variant="secondary" onClick={() => navigate('/verify-pending')}>Back</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
