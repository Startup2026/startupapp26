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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent mb-8">
              <Rocket className="h-3.5 w-3.5" />
              Early Access — MVP 1 Live
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              Verified Startup Hiring.{" "}
              <br className="hidden sm:block" />
              <span className="gradient-text">Built for Serious Builders.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Wostup verifies startups before they hire — so students apply with confidence.
              No more fake listings. No more ghosting.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
              <Link to="/register?role=startup">
                <Button size="lg" className="w-full sm:w-auto group bg-accent text-accent-foreground h-13 px-8 rounded-2xl font-semibold text-sm hover:scale-[1.02] transition-all shadow-lg shadow-accent/20">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Post a Job
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/register?role=student">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-13 px-8 rounded-2xl font-semibold text-sm border-2 border-border hover:bg-accent/5 hover:border-accent/30">
                  <Users className="h-4 w-4 mr-2" />
                  Apply to Verified Startups
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Clock className="h-3 w-3" />
              Trust Score launching in Phase 2
            </p>
          </FadeIn>

          {/* Floating Preview Cards */}
          <FadeIn delay={500} className="mt-14 md:mt-20 relative">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              {/* Verified Startup Card */}
              <div className="glass rounded-2xl p-5 shadow-lg w-full sm:w-64 text-left hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <BadgeCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">NexaTech Labs</p>
                    <p className="text-[11px] text-muted-foreground">Series A · SaaS</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                  <span className="text-[11px] text-muted-foreground">3 open roles</span>
                </div>
              </div>

              {/* Trust Score Preview */}
              <div className="glass rounded-2xl p-5 shadow-lg w-full sm:w-56 text-left hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[9px] font-bold uppercase tracking-wider">
                  Coming Soon
                </div>
                <p className="text-[11px] font-medium text-muted-foreground mb-2">Student Trust Score</p>
                <div className="flex items-end gap-1.5 mb-3">
                  <span className="text-2xl font-bold text-muted-foreground/40">—</span>
                  <span className="text-[11px] text-muted-foreground mb-0.5">/100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-muted-foreground/20 rounded-full w-1/3 animate-pulse" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. PROBLEM SECTION
      ═══════════════════════════════════════════ */}
      <section id="problem" className="py-16 md:py-24 px-5 md:px-8 bg-card">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold mb-5">
                <AlertTriangle className="h-3.5 w-3.5" />
                The Problem
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
                Why current hiring platforms <span className="text-destructive">fail</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                Students and startups both lose — here's what we're fixing first.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: ShieldAlert,
                title: "Fake or Unclear Startups",
                desc: "Students can't tell real companies from scams. No verification, no transparency, no trust.",
                color: "text-destructive",
                bg: "bg-destructive/5 border-destructive/10",
              },
              {
                icon: Ghost,
                title: "Low Response Rates",
                desc: "Apply to 20 jobs, hear back from 1. Both sides ghost — wasting weeks of effort.",
                color: "text-warning",
                bg: "bg-warning/5 border-warning/10",
              },
              {
                icon: UserX,
                title: "Random Hiring Platforms",
                desc: "Generic platforms dump unqualified applicants on startups and irrelevant jobs on students.",
                color: "text-muted-foreground",
                bg: "bg-muted border-border",
              },
            ].map((card, idx) => (
              <FadeIn key={idx} delay={idx * 100}>
                <div className={`p-6 md:p-7 rounded-2xl border ${card.bg} hover:shadow-md hover:-translate-y-1 transition-all duration-300 group h-full`}>
                  <div className={`h-11 w-11 rounded-xl ${card.bg} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. MVP SOLUTION SECTION
      ═══════════════════════════════════════════ */}
      <section id="solution" className="py-16 md:py-24 px-5 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-5">
                <Zap className="h-3.5 w-3.5" />
                MVP 1 — Live Now
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
                What's live in <span className="gradient-text">MVP 1</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                The foundation of trust-first hiring — available right now.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
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
                <div className="flex gap-4 p-5 md:p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-all group h-full">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <item.icon className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Coming Soon banner */}
          <FadeIn delay={400}>
            <div className="rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 p-5 md:p-6 flex items-center gap-4 max-w-lg mx-auto">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-bold text-sm flex items-center gap-2">
                  Trust Score System
                  <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold uppercase">Phase 2</span>
                </p>
                <p className="text-muted-foreground text-xs">Students will earn credibility scores based on responsiveness and reliability.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. EARLY ADOPTER SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-5 md:px-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/8 blur-[100px] opacity-40" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-semibold mb-5">
                <Crown className="h-3.5 w-3.5" />
                Exclusive
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
                Why join early?
              </h2>
              <p className="text-primary-foreground/60 text-base md:text-lg max-w-lg mx-auto">
                Early adopters shape the platform — and get rewarded for it.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
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
                <div className="p-5 md:p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all group h-full">
                  <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-primary-foreground/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. PRICING SECTION
      ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-16 md:py-24 px-5 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
                Simple, MVP-honest <span className="gradient-text">pricing</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
                Start free. Scale when you're ready.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
            {/* Student - Free */}
            <FadeIn delay={0}>
              <div className="p-6 md:p-8 rounded-2xl border border-border bg-card hover:shadow-md transition-all h-full flex flex-col">
                <div className="mb-6">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Student</h3>
                  <p className="text-muted-foreground text-sm">For students applying to startups</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Free</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Apply to verified startups",
                    "Early trust score access (when live)",
                    "Limited applications per week",
                    "Build your profile",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register?role=student" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-2 hover:bg-accent/5 hover:border-accent/30">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Startup - Early Access (highlighted) */}
            <FadeIn delay={100}>
              <div className="p-6 md:p-8 rounded-2xl border-2 border-accent bg-card shadow-lg shadow-accent/10 hover:shadow-xl transition-all h-full flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
                  Recommended
                </div>
                <div className="mb-6">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Briefcase className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Startup — Early Access</h3>
                  <p className="text-muted-foreground text-sm">Verified hiring for early-stage teams</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Free</span>
                  <span className="text-muted-foreground text-sm ml-1.5">during beta</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Startup verification badge",
                    "Post up to 3 jobs",
                    "View curated applicants",
                    "Early adopter badge",
                    "Direct messaging",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register?role=startup" className="w-full">
                  <Button className="w-full h-12 rounded-xl font-semibold bg-accent text-accent-foreground hover:scale-[1.02] transition-transform shadow-md shadow-accent/20">
                    Get Verified Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Startup Pro - Coming Soon */}
            <FadeIn delay={200}>
              <div className="p-6 md:p-8 rounded-2xl border border-border bg-muted/30 hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[9px] font-bold uppercase tracking-wider">
                  Coming Soon
                </div>
                <div className="mb-6">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                    <Crown className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-muted-foreground">Startup Pro</h3>
                  <p className="text-muted-foreground/70 text-sm">For scaling teams</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-muted-foreground">TBD</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Unlimited job posts",
                    "Advanced candidate filters",
                    "Trust score analytics",
                    "Featured placement",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4 flex-shrink-0 mt-0.5 opacity-40" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full h-12 rounded-xl font-semibold" disabled>
                  Coming Soon
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. ROADMAP SECTION
      ═══════════════════════════════════════════ */}
      <section id="roadmap" className="py-16 md:py-24 px-5 md:px-8 bg-card">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
                The <span className="gradient-text">roadmap</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
                Where we are and where we're going — full transparency.
              </p>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 md:left-8 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6 md:space-y-8">
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
                  <div className="flex gap-4 md:gap-6 items-start pl-1">
                    {/* Dot */}
                    <div className={`relative z-10 h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.status === "live"
                        ? "bg-accent text-accent-foreground shadow-md shadow-accent/25"
                        : item.status === "next"
                        ? "bg-accent/10 text-accent border-2 border-accent/30"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {item.status === "live" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : item.status === "next" ? (
                        <Zap className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.phase}</span>
                        {item.status === "live" && (
                          <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase">Live</span>
                        )}
                        {item.status === "next" && (
                          <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold uppercase">Up Next</span>
                        )}
                      </div>
                      <h3 className="font-bold text-base md:text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
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
      <section className="py-14 md:py-20 px-5 md:px-8">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
            <div className="bg-primary text-primary-foreground rounded-3xl px-6 md:px-14 py-12 md:py-16 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-accent/15 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
              <div className="relative z-10 text-center">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3 leading-tight">
                  Build with the early builders.
                </h2>
                <p className="text-primary-foreground/60 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  Join Wostup MVP 1 today. Be part of the platform that's making hiring honest.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground h-13 px-8 rounded-2xl font-semibold hover:scale-[1.03] transition-transform shadow-lg shadow-accent/20 group">
                      Join MVP 1 — It's Free
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
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
