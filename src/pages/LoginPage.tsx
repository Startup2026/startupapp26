import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type UserRole = "student" | "startup" | "admin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Welcome back!",
      description: `Logged in as ${role}`,
    });

    // Navigate based on role
    if (role === "student") {
      navigate("/student/dashboard");
    } else if (role === "startup") {
      navigate("/startup/dashboard");
    } else {
      navigate("/admin/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding section */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <Logo size="lg" />
          <h1 className="mt-12 text-5xl font-bold leading-tight">
            Connect with
            <br />
            <span className="text-accent">innovative startups</span>
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-md">
            PitchIt bridges the gap between ambitious students and groundbreaking
            startups. Find your next opportunity or discover fresh talent.
          </p>
          
          <div className="mt-12 flex gap-8">
            <div>
              <div className="text-4xl font-bold text-accent">500+</div>
              <div className="text-sm text-primary-foreground/70">Active Startups</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">10K+</div>
              <div className="text-sm text-primary-foreground/70">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">2K+</div>
              <div className="text-sm text-primary-foreground/70">Jobs Posted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right login form section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  inputSize="lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  inputSize="lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New to PitchIt?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
