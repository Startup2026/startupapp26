import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await authService.forgotPassword(email);

      if (result.success) {
        setMessage("If an account with that email exists, a password reset link has been sent.");
        toast({
          title: "Check your email",
          description: "A password reset link has been sent to your email address.",
        });
      } else {
        throw new Error(result.error || result.message || "Something went wrong");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <Logo />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Forgot Your Password?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No worries! Enter your email address below and we'll send you a
            link to reset your password.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>

        {message && (
          <div className="text-center text-sm text-green-600">{message}</div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
