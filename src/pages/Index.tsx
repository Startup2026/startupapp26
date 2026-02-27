import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Ghost,
  UserX,
  AlertTriangle,
  BadgeCheck,
  CheckCircle,
  Globe,
  MessageSquare,
  Rocket,
  Sparkles,
  Users,
  Briefcase,
  Eye,
  Star,
  Crown,
  Clock,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Gift,
  Lock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { useEffect, useRef, useState } from "react";

/* ─── Intersection observer for scroll animations ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Fade-in wrapper ─── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const Index = () => {

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20 overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-2xl border-b border-border/40">
        <div className="container mx-auto px-5 md:px-8 h-16 md:h-18 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="sm" />
            <div className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-muted-foreground">
              <a href="#problem" className="hover:text-foreground transition-colors">Why Wostup</a>
              <a href="#solution" className="hover:text-foreground transition-colors">What's Live</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="font-medium text-sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-accent text-accent-foreground rounded-full px-5 font-semibold text-sm hover:scale-[1.02] transition-transform shadow-md shadow-accent/20">
                Get Early Access
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-5 md:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-accent/12 via-accent/4 to-transparent rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative">
          {/* Early Access Badge */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent mb-8 shadow-sm">
              <Rocket className="h-3.5 w-3.5" />
              Early Access — MVP 1 Live
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 text-foreground">
              Verified Startup Hiring.{" "}
              <br className="hidden sm:block" />
              <span className="gradient-text">Built for Serious Builders.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Wostup verifies startups before they hire — so students apply with confidence.
              No more fake listings. No more ghosting.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/register?role=startup">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-8 rounded-xl font-bold text-base shadow-lg shadow-accent/20 transition-all hover:scale-[1.02]">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Post a Job
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register?role=student">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-base border-2 hover:bg-accent/5 hover:border-accent/40 bg-background/50 backdrop-blur-sm">
                  <Users className="h-5 w-5 mr-2" />
                  Apply to Verified Startups
                </Button>
              </Link>
            </div>

            <p className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1.5 opacity-80">
              <Clock className="h-3.5 w-3.5" />
              Trust Score launching in Phase 2
            </p>
          </FadeIn>

          {/* Floating Preview Cards */}
          <FadeIn delay={500} className="mt-16 md:mt-24 relative">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Verified Startup Card */}
              <Card className="w-full sm:w-72 border-border/60 shadow-xl hover:-translate-y-1 transition-transform duration-500">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <BadgeCheck className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-foreground">NexaTech Labs</p>
                      <p className="text-xs text-muted-foreground font-medium">Series A · SaaS</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">3 open roles</span>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Score Preview */}
              <Card className="w-full sm:w-64 border-border/60 shadow-xl hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden bg-background/50 backdrop-blur-sm">
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[9px] font-bold uppercase tracking-wider">
                  Phase 2
                </div>
                <CardContent className="p-5 text-left">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Student Trust Score</p>
                  <div className="flex items-end gap-1.5 mb-3">
                    <span className="text-3xl font-bold text-muted-foreground/30">—</span>
                    <span className="text-xs text-muted-foreground mb-1 font-medium">/100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-muted-foreground/10 rounded-full w-1/3 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. PROBLEM SECTION
      ═══════════════════════════════════════════ */}
      <section id="problem" className="py-16 md:py-24 px-5 md:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-semibold mb-6">
                <AlertTriangle className="h-3.5 w-3.5" />
                The Problem
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Why current hiring platforms <span className="text-destructive">fail</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Students and startups both lose — here's what we're fixing first.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldAlert,
                title: "Fake or Unclear Startups",
                desc: "Students can't tell real companies from scams. No verification, no transparency, no trust.",
                color: "text-destructive",
                bgIcon: "bg-destructive/10",
                border: "hover:border-destructive/50",
              },
              {
                icon: Ghost,
                title: "Low Response Rates",
                desc: "Apply to 20 jobs, hear back from 1. Both sides ghost — wasting weeks of effort.",
                color: "text-warning",
                bgIcon: "bg-warning/10",
                border: "hover:border-warning/50",
              },
              {
                icon: UserX,
                title: "Random Hiring Platforms",
                desc: "Generic platforms dump unqualified applicants on startups and irrelevant jobs on students.",
                color: "text-muted-foreground",
                bgIcon: "bg-secondary",
                border: "hover:border-foreground/20",
              },
            ].map((card, idx) => (
              <FadeIn key={idx} delay={idx * 100}>
                <Card className={`h-full border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${card.border}`}>
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-xl ${card.bgIcon} flex items-center justify-center mb-4`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. MVP SOLUTION SECTION
      ═══════════════════════════════════════════ */}
      <section id="solution" className="py-16 md:py-24 px-5 md:px-8 bg-background">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold mb-6">
                <Zap className="h-3.5 w-3.5" />
                MVP 1 — Live Now
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                What's live in <span className="gradient-text">MVP 1</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                The foundation of trust-first hiring — available right now.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: ShieldCheck,
                title: "Startup Verification",
                desc: "Every startup is verified before posting a single job. Legal docs, team, domain — all checked.",
              },
              {
                icon: Briefcase,
                title: "Clean Job Dashboard",
                desc: "Browse real, verified opportunities with clear details. No spam, no clutter.",
              },
              {
                icon: MessageSquare,
                title: "Direct Interaction",
                desc: "Startups and students communicate directly — no middlemen, no delays.",
              },
              {
                icon: Target,
                title: "Curated Applications",
                desc: "Limited, quality-focused applications ensure startups see real candidates only.",
              },
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 80}>
                <Card className="h-full border-border/50 hover:border-accent/50 transition-colors group">
                  <div className="flex p-6 gap-5">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                      <item.icon className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>

          {/* Coming Soon banner */}
          <FadeIn delay={400}>
            <div className="rounded-2xl border border-dashed border-accent/30 bg-accent/5 p-6 flex flex-col sm:flex-row items-center gap-6 max-w-2xl mx-auto text-center sm:text-left">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold flex items-center justify-center sm:justify-start gap-3 mb-1">
                  Trust Score System
                  <span className="px-2.5 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-black uppercase tracking-wider">Phase 2</span>
                </p>
                <p className="text-muted-foreground text-sm">Students will earn credibility scores based on responsiveness and reliability.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. EARLY ADOPTER SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-5 md:px-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 blur-[100px] opacity-40" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold mb-6 backdrop-blur-sm border border-white/10">
                <Crown className="h-3.5 w-3.5" />
                Exclusive
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Why join early?
              </h2>
              <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto leading-relaxed">
                Early adopters shape the platform — and get rewarded for it.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Star,
                title: "Featured as Early Verified Startup",
                desc: "Your profile gets premium visibility as one of the first verified companies.",
              },
              {
                icon: Eye,
                title: "Priority Applicant Visibility",
                desc: "Early students are surfaced first to startups — be seen before the crowd.",
              },
              {
                icon: Sparkles,
                title: "Shape the Trust System",
                desc: "Give feedback that directly shapes how Trust Scores work in Phase 2.",
              },
              {
                icon: Gift,
                title: "Lifetime Early Adopter Perks",
                desc: "Founding members get exclusive benefits as the platform scales.",
              },
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 100}>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group h-full">
                  <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-primary-foreground/60 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. PRICING SECTION
      ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-20 md:py-32 px-5 md:px-8 bg-background relative overflow-hidden">
        {/* Background glow for pricing */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-16 md:mb-24">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold mb-6">
                <Rocket className="h-3.5 w-3.5" />
                MVP 1 Early Access
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Simple pricing for <span className="gradient-text">early believers</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Lock in early-adopter rates. We're building for the long term, and we want you with us from day one.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            
            {/* 1. STUDENT */}
            <FadeIn delay={0}>
              <Card className="flex flex-col h-full border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-8">
                  <div className="inline-flex p-2.5 rounded-xl bg-secondary mb-5 w-fit">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-2">Student</CardTitle>
                  <CardDescription className="text-base min-h-[48px]">
                    Build your career profile and access verified startup jobs.
                  </CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">₹0</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mt-2">For ambitious builders only.</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {[
                      "Apply to verified startups",
                      "Profile visibility to startups",
                      "Limited applications per week",
                      "Early access to Trust Score",
                    ].map((f) => (
                      <li key={f} className="flex gap-3 text-sm text-foreground/80">
                        <div className="mt-0.5">
                           {f.includes("Trust Score") ? (
                             <Clock className="h-4 w-4 text-warning" />
                           ) : (
                             <CheckCircle className="h-4 w-4 text-primary" />
                           )}
                        </div>
                        <span>
                          {f} {f.includes("Trust Score") && <span className="text-[10px] uppercase font-bold text-warning ml-1">(Coming Soon)</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/register?role=student" className="w-full">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold text-sm">
                      Start Applying
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </FadeIn>

            {/* 2. STARTUP - Early Builder (Recommended) */}
            <FadeIn delay={100}>
              <Card className="flex flex-col h-full border-primary ring-2 ring-primary ring-offset-2 shadow-2xl relative md:-mt-8 z-10 bg-card">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md whitespace-nowrap">
                  Early Access Offer
                </div>
                <CardHeader className="pb-8">
                  <div className="inline-flex p-2.5 rounded-xl bg-accent/10 mb-5 w-fit">
                    <BadgeCheck className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-2 text-accent">Early Builder</CardTitle>
                  <CardDescription className="text-base min-h-[48px]">
                    Everything you need to hire your founding team.
                  </CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">₹999</span>
                    <span className="text-muted-foreground ml-1 font-medium">/month</span>
                  </div>
                  <p className="text-xs font-medium text-accent mt-2">Special pricing. Will increase after launch.</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {[
                      "Startup verification badge",
                      "Up to 5 active job posts",
                      "100 applicants per job",
                      "Interview scheduling dashboard",
                      "Basic hiring analytics",
                      "Early adopter badge on profile",
                    ].map((f) => (
                      <li key={f} className="flex gap-3 text-sm font-semibold text-foreground">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/register?role=startup" className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg transition-transform hover:scale-[1.02] text-sm">
                      Start Hiring
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </FadeIn>

            {/* 3. GROWTH */}
            <FadeIn delay={200}>
              <Card className="flex flex-col h-full border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-8">
                  <div className="inline-flex p-2.5 rounded-xl bg-secondary mb-5 w-fit">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-2">Growth</CardTitle>
                  <CardDescription className="text-base min-h-[48px]">
                    Advanced tools for teams scaling rapidly.
                  </CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">₹2,999</span>
                    <span className="text-muted-foreground ml-1 font-medium">/month</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mt-2">Billed annually.</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {[
                      "Up to 15 active jobs",
                      "Unlimited applicants",
                      "Advanced candidate filters",
                      "Bulk messaging tools",
                      "Job performance insights",
                      "Featured job placement",
                    ].map((f) => (
                      <li key={f} className="flex gap-3 text-sm text-foreground/80">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/register?role=startup" className="w-full">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold text-sm">
                      Upgrade to Growth
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </FadeIn>
          </div>

          {/* Early Access Benefits - Subtle Section Below */}
          <FadeIn delay={300}>
            <div className="mt-20 max-w-4xl mx-auto">
              <div className="rounded-2xl bg-secondary/30 border border-border/50 p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                       <Crown className="h-4 w-4 text-warning" />
                       Why join Early Access?
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                      We're building this platform with you. Early adopters get lifetime benefits.
                    </p>
                  </div>
                  
                  <div className="h-px w-full md:w-px md:h-16 bg-border" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                    {[
                      { l: "Lock in lowest pricing", i: Star },
                      { l: "Get featured as founding startup", i: Rocket },
                      { l: "Shape future Trust Score system", i: Shield },
                    ].map((b, i) => (
                       <div key={i} className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border shadow-sm">
                           <b.i className="h-4 w-4 text-foreground" />
                         </div>
                         <span className="text-sm font-medium">{b.l}</span>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. ROADMAP SECTION
      ═══════════════════════════════════════════ */}
      <section id="roadmap" className="py-20 md:py-32 px-5 md:px-8 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                The <span className="gradient-text">Roadmap</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                Where we are and where we're going — full transparency for our community.
              </p>
            </div>
          </FadeIn>

          <div className="relative pl-8 md:pl-0">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-border to-transparent hidden md:block" />
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:hidden" />

            <div className="space-y-12">
              {[
                {
                  phase: "Phase 1",
                  title: "Verified Hiring",
                  status: "live",
                  desc: "Startup verification, job postings, curated applications, direct messaging.",
                },
                {
                  phase: "Phase 2",
                  title: "Trust Score System",
                  status: "next",
                  desc: "Student credibility scores, response tracking, reliability metrics.",
                },
                {
                  phase: "Phase 3",
                  title: "Smart Matching Engine",
                  status: "planned",
                  desc: "AI-powered matching between verified startups and trusted students.",
                },
                {
                  phase: "Phase 4",
                  title: "Hiring Analytics",
                  status: "planned",
                  desc: "Deep insights into hiring funnels, candidate quality, and conversion rates.",
                },
              ].map((item, idx) => (
                <FadeIn key={idx} delay={idx * 100}>
                  <div className="relative md:pl-24">
                    {/* Dot/Icon */}
                    <div className={`absolute left-[-1.5rem] md:left-0 top-0 z-10 h-10 w-10 md:h-16 md:w-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                      item.status === "live"
                        ? "bg-accent text-accent-foreground ring-4 ring-background"
                        : item.status === "next"
                        ? "bg-background border-2 border-accent text-accent ring-4 ring-background"
                        : "bg-muted text-muted-foreground ring-4 ring-background"
                    }`}>
                      {item.status === "live" ? (
                        <CheckCircle className="h-5 w-5 md:h-8 md:w-8" />
                      ) : item.status === "next" ? (
                        <Zap className="h-5 w-5 md:h-8 md:w-8" />
                      ) : (
                        <Clock className="h-5 w-5 md:h-8 md:w-8" />
                      )}
                    </div>

                    <Card className="ml-6 md:ml-0 border-border/50 hover:border-accent/30 transition-all duration-300">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.phase}</span>
                            {item.status === "live" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-wider">Live</span>
                            )}
                            {item.status === "next" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-black uppercase tracking-wider">Up Next</span>
                            )}
                          </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-base">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-5 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
            <div className="bg-primary text-primary-foreground rounded-[2.5rem] px-8 md:px-20 py-16 md:py-24 relative overflow-hidden shadow-2xl shadow-primary/20 text-center">
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                  Ready to build properly?
                </h2>
                <p className="text-primary-foreground/70 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed font-medium">
                  Join Wostup MVP 1 today. Be part of the platform that's making hiring honest again.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto min-w-[200px] bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-8 rounded-xl font-bold text-base shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] hover:-translate-y-1">
                      Get Started for Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-xs text-primary-foreground/40 mt-4 sm:mt-0 sm:absolute sm:-bottom-12">No credit card required</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="py-12 md:py-16 px-5 md:px-8 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2 space-y-4">
              <Logo size="sm" />
              <p className="text-muted-foreground max-w-xs leading-relaxed text-sm">
                The verified hiring platform where startups and students build trust before they connect.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Platform</h4>
              <div className="space-y-2.5 text-sm text-muted-foreground">
                <a href="#solution" className="block hover:text-foreground transition-colors">What's Live</a>
                <a href="#pricing" className="block hover:text-foreground transition-colors">Pricing</a>
                <a href="#roadmap" className="block hover:text-foreground transition-colors">Roadmap</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Company</h4>
              <div className="space-y-2.5 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">About</a>
                <a href="#" className="block hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="block hover:text-foreground transition-colors">Terms</a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2026 Wostup. All rights reserved.</p>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <Globe className="h-3.5 w-3.5" />
              </div>
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <MessageSquare className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
