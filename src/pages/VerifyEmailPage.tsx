import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerification } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // Try to get email from state or local storage
  useEffect(() => {
    // Check location state first (passed from register)
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // Check stored user
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.email) setEmail(user.email);
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
    }
  }, [location]);

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the full 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Assuming backend verifyEmail accepts OTP as token
    const result = await verifyEmail(email, otp);

    if (result.success) {
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified.",
      });

      if (result.onboardingStep === 'startup-verification') {
         navigate('/startup/create-profile');
      } else if (result.onboardingStep === 'profile') {
         // Student flow
         navigate('/student/create-profile');
      } else if (result.onboardingStep === 'incubator-profile') {
          // Incubator flow
          navigate('/incubator/create-profile');
      } else {
         // Default or completed onboarding
         navigate('/login');
      }
    } else {
      toast({
        title: "Verification Failed",
        description: result.error || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "We need your email address to resend the code.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    const result = await resendVerification(email);
    
    if (result.success) {
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      });
    } else {
      toast({
        title: "Failed to Resend",
        description: result.error || "Could not resend verification code.",
        variant: "destructive",
      });
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-accent/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {email ? (
              <>We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span></>
            ) : (
              "Please enter the verification code sent to your email."
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 flex flex-col items-center">
          <div className="space-y-4">
            {!email ? (
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-center"
              />
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Verifying {email}</span>
                <Button variant="link" size="sm" onClick={() => setEmail("")} className="h-auto p-0 text-primary">Change</Button>
              </div>
            )}
            <div className="flex justify-center w-full py-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          </div>
          
          <div className="text-sm text-center">
             <Button 
               variant="link" 
               className="text-muted-foreground hover:text-primary p-0 h-auto font-normal"
               onClick={handleResend}
               disabled={isResending}
             >
               {isResending ? (
                 <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Resending...</>
               ) : (
                 "Didn't receive a code? Resend"
               )}
             </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full" 
            onClick={handleVerify} 
            disabled={isLoading || otp.length < 6}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
            ) : (
              "Verify Email"
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Need help? <a href="mailto:support@stack.com" className="hover:text-primary underline">Contact Support</a></p>
      </div>
    </div>
  );
}
