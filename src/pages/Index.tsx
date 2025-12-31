import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Users,
  Zap,
  Shield,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

const features = [
  {
    icon: Building2,
    title: "500+ Verified Startups",
    description: "Connect with vetted, high-growth startups across all domains",
  },
  {
    icon: Briefcase,
    title: "2,000+ Job Listings",
    description: "Find internships and full-time roles tailored to your skills",
  },
  {
    icon: Shield,
    title: "Trusted Platform",
    description: "Every startup is verified to ensure quality opportunities",
  },
  {
    icon: Zap,
    title: "Direct Applications",
    description: "Apply directly to founders, no middleman involved",
  },
];

const stats = [
  { value: "10K+", label: "Students" },
  { value: "500+", label: "Startups" },
  { value: "2K+", label: "Jobs Posted" },
  { value: "95%", label: "Placement Rate" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 animate-fade-in">
            <Zap className="h-4 w-4" />
            Connecting talent with innovation
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight animate-slide-up">
            Where{" "}
            <span className="gradient-text">students</span>{" "}
            meet{" "}
            <span className="gradient-text">startups</span>
          </h1>

          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            PitchIt bridges the gap between ambitious students seeking opportunities
            and innovative startups looking for fresh talent.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/register">
              <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why choose PitchIt?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We're not just a job board. We're a community connecting the next
              generation of talent with tomorrow's leading companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="interactive"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-12 md:p-16 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Ready to start your journey?
                  </h2>
                  <p className="mt-4 text-primary-foreground/80 text-lg">
                    Join thousands of students already connecting with innovative
                    startups. Your dream job is just a click away.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
                  <Link to="/register">
                    <Button
                      size="xl"
                      className="gap-2 w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Join as Student
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="xl"
                      variant="outline"
                      className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Join as Startup
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2024 PitchIt. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
