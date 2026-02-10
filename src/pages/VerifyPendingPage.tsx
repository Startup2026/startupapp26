import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyPendingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = useAuth();

  const state: any = location.state || {};
  const email = state.email || "";
  const [cooldown, setCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const startCooldown = () => {
    setCooldown(60);
    const iv = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(iv);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!email) return toast({ title: 'Email missing', description: 'Please retry registration to resend verification.', variant: 'destructive' });
    if (cooldown > 0) return;
    setIsSending(true);
    const res = await auth.resendVerification(email);
    setIsSending(false);
    if (res.success) {
      toast({ title: 'Verification sent', description: 'Check your inbox.' });
      startCooldown();
    } else {
      toast({ title: 'Unable to resend', description: res.error || 'Please try again later.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold">Verify your email</h2>
        <p className="mt-4 text-muted-foreground">A verification code was sent to <strong>{email || 'your email'}</strong>. Enter the 6-digit code in the app to activate your account. The code expires in 24 hours.</p>

        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate('/login')}>Back to Sign in</Button>
          <Button onClick={() => navigate('/verify-email', { state: { email } })}>Enter code</Button>
          <Button onClick={handleResend} disabled={cooldown > 0 || isSending} variant={cooldown > 0 ? 'secondary' : 'default'}>
            {cooldown > 0 ? `Resend (${cooldown}s)` : isSending ? 'Sending...' : 'Resend code'}
          </Button>
        </div>
      </div>
    </div>
  );
}
