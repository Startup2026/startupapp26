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
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle,
  Star,
  Globe,
  MessageSquare,
  Award,
  Sparkles,
  Rocket,
  Eye,
  Handshake,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useEffect, useRef, useState } from "react";

/* ─── Animated counter hook ─── */
function useCountUp(end: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return value;
}

/* ─── Intersection observer hook ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const Index = () => {
  const statsSection = useInView(0.3);
  const stat1 = useCountUp(500, 1800, statsSection.inView);
  const stat2 = useCountUp(12000, 2000, statsSection.inView);
  const stat3 = useCountUp(95, 1500, statsSection.inView);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20 overflow-x-hidden">

      {/* ═══════ NAVBAR ═══════ */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/70 backdrop-blur-2xl border-b border-border/50">
        <div className="container mx-auto px-6 md:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo size="sm" />
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-muted-foreground">
              <a href="#problem" className="hover:text-foreground transition-colors">Why Wostup</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#verification" className="hover:text-foreground transition-colors">Verification</a>
              <a href="#stats" className="hover:text-foreground transition-colors">Proof</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-semibold text-sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-accent text-accent-foreground rounded-full px-6 h-11 font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════ 1. HERO SECTION ═══════ */}
      <section className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 md:px-8 overflow-hidden">
        {/* Animated gradient bg */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-br from-accent/15 via-accent/5 to-transparent rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Left copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent mb-8 animate-fade-in">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Hiring Platform
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6 animate-slide-up">
                Hire with <span className="gradient-text">trust</span>,
                <br />not guesswork.
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Wostup verifies every startup before they post jobs and builds trust scores for every student — so both sides know they're dealing with the real deal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Link to="/register?role=startup">
                  <Button size="lg" className="group bg-accent text-accent-foreground h-14 px-8 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all shadow-lg shadow-accent/25">
                    I'm a Startup
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/register?role=student">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl font-bold text-sm border-2 border-border hover:bg-accent/5 hover:border-accent/30">
                    I'm a Student
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: floating cards */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg relative h-[380px] md:h-[420px] animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {/* Glow */}
              <div className="absolute inset-0 bg-accent/8 rounded-[3rem] blur-[60px]" />

              {/* Verified Startup card */}
              <div className="absolute top-6 left-4 md:left-0 glass rounded-2xl p-5 shadow-lg animate-slide-up w-64" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <BadgeCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">NexaTech Labs</p>
                    <p className="text-xs text-muted-foreground">Series A · SaaS</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </div>
                  <span className="text-xs text-muted-foreground">3 open roles</span>
                </div>
              </div>

              {/* Trust Score card */}
              <div className="absolute bottom-8 right-4 md:right-0 glass rounded-2xl p-5 shadow-lg animate-slide-up w-56" style={{ animationDelay: "0.55s" }}>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Student Trust Score</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-bold text-accent">87</span>
                  <span className="text-xs text-muted-foreground mb-1">/100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "87%" }} />
                </div>
              </div>

              {/* Match card */}
              <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-4 glass rounded-2xl px-4 py-3 shadow-lg animate-slide-up flex items-center gap-2" style={{ animationDelay: "0.65s" }}>
                <Handshake className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold">98% Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 2. PROBLEM SECTION ═══════ */}
      <section id="problem" className="py-20 md:py-28 px-6 md:px-8 bg-card">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold mb-6">
              <AlertTriangle className="h-3.5 w-3.5" />
              The Hiring Trust Crisis
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              The real cost of <span className="text-destructive">unverified</span> hiring
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Students waste time on fake listings. Startups get ghosted by applicants. Both sides lose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldAlert,
                title: "Fake Startups",
                desc: "Students can't tell real opportunities from scams — leading to wasted effort, stolen data, and broken trust.",
                color: "text-destructive",
                bg: "bg-destructive/5 border-destructive/10",
              },
              {
                icon: UserX,
                title: "Random Applicants",
                desc: "Startups get flooded with unqualified or spam applications — making it impossible to find real talent.",
                color: "text-warning",
                bg: "bg-warning/5 border-warning/10",
              },
              {
                icon: Ghost,
                title: "Ghosting Epidemic",
                desc: "After interviews, both sides go silent. No follow-ups, no closure — just wasted time for everyone.",
                color: "text-muted-foreground",
                bg: "bg-muted border-border",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl border ${card.bg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className={`h-12 w-12 rounded-xl ${card.bg} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 3. SOLUTION SECTION ═══════ */}
      <section className="py-20 md:py-28 px-6 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6">
              <ShieldCheck className="h-3.5 w-3.5" />
              The Wostup Solution
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Trust built into <span className="gradient-text">every layer</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We verify startups before they post and score students so you always know who you're dealing with.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Startup Verification */}
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <BadgeCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Startup Verification</h3>
                  <p className="text-sm text-muted-foreground">Every company is vetted</p>
                </div>
              </div>
              {/* Mockup */}
              <div className="glass rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold">NT</div>
                    <div>
                      <p className="font-semibold text-sm">NexaTech Labs</p>
                      <p className="text-xs text-muted-foreground">Applied for verification</p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["Legal Docs", "Team Verified", "Domain Check"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-accent font-medium">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Trust Score */}
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Student Trust Score</h3>
                  <p className="text-sm text-muted-foreground">Earn credibility over time</p>
                </div>
              </div>
              {/* Mockup */}
              <div className="glass rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex" alt="" className="h-10 w-10 rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Alex Rivera</p>
                      <p className="text-xs text-muted-foreground">CS · MIT · 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">87<span className="text-sm text-muted-foreground font-normal">/100</span></p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Profile Completeness", val: 95 },
                    { label: "Response Rate", val: 92 },
                    { label: "Interview Attendance", val: 78 },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{m.label}</span>
                        <span className="font-semibold">{m.val}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${m.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 4. HOW IT WORKS ═══════ */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 md:px-8 bg-card">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Three steps to <span className="gradient-text">trusted hiring</span>
            </h2>
            <p className="text-muted-foreground text-lg">Simple for startups. Simple for students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Users,
                title: "Create Your Profile",
                desc: "Sign up as a startup or student. Showcase your mission or your skills in minutes.",
              },
              {
                step: "02",
                icon: ShieldCheck,
                title: "Get Verified / Build Trust",
                desc: "Startups submit docs for verification. Students build trust scores through activity and responsiveness.",
              },
              {
                step: "03",
                icon: Handshake,
                title: "Match & Hire",
                desc: "Browse verified opportunities or vetted talent. Connect, interview, and hire — with confidence.",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="relative p-8 rounded-2xl bg-background border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="absolute top-6 right-6 text-5xl font-bold text-muted/50 select-none">{s.step}</span>
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <s.icon className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 5. SOCIAL PROOF / STATS ═══════ */}
      <section id="stats" className="py-20 md:py-24 px-6 md:px-8 bg-primary text-primary-foreground relative overflow-hidden" ref={statsSection.ref}>
        <div className="absolute inset-0 bg-accent/10 opacity-40 blur-[100px]" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Numbers don't lie</h2>
            <p className="text-primary-foreground/60 text-lg">Real traction from real users on a real platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              { value: stat1, suffix: "+", label: "Verified Startups" },
              { value: stat2.toLocaleString(), suffix: "+", label: "Interviews Conducted" },
              { value: stat3, suffix: "%", label: "Response Rate" },
            ].map((s, idx) => (
              <div key={idx}>
                <div className="text-5xl md:text-6xl font-bold text-accent tracking-tight mb-2">
                  {typeof s.value === "number" ? s.value : s.value}{s.suffix}
                </div>
                <div className="text-sm font-medium text-primary-foreground/50 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 6. VERIFICATION HIGHLIGHT ═══════ */}
      <section id="verification" className="py-20 md:py-28 px-6 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6">
                <Shield className="h-3.5 w-3.5" />
                Verification Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Every startup earns the <span className="gradient-text">Verified</span> badge
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Before posting a single job, startups go through our multi-step verification. We check legal registration, team authenticity, and domain ownership — so students never apply to fake companies.
              </p>
              <ul className="space-y-4">
                {[
                  "Legal entity & registration check",
                  "Founder identity verification",
                  "Domain & website authenticity",
                  "Ongoing monitoring for compliance",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-[15px] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Badge component preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/10 rounded-[3rem] blur-[40px]" />
                <div className="relative glass rounded-3xl p-10 flex flex-col items-center text-center space-y-6 max-w-xs shadow-xl">
                  <div className="h-20 w-20 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                    <ShieldCheck className="h-10 w-10 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">Verified by Wostup</p>
                    <p className="text-sm text-muted-foreground">This startup has passed all verification checks and is safe to apply to.</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {["Legal ✓", "Team ✓", "Domain ✓"].map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 7. FINAL CTA ═══════ */}
      <section className="py-16 md:py-20 px-6 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-primary text-primary-foreground rounded-3xl px-8 md:px-16 py-16 md:py-20 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
                Build Trust. <br className="md:hidden" />
                <span className="text-accent">Get Hired Smarter.</span>
              </h2>
              <p className="text-primary-foreground/60 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Stop wasting time on unverified platforms. Join the ecosystem where trust is the standard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-accent text-accent-foreground h-14 px-10 rounded-2xl font-bold hover:scale-[1.03] transition-transform shadow-lg shadow-accent/25 group">
                    Get Started — It's Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-16 px-6 md:px-8 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2 space-y-4">
              <Logo size="sm" />
              <p className="text-muted-foreground max-w-xs leading-relaxed text-sm">
                The verified hiring platform where startups and students build trust before they connect.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Platform</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a href="#how-it-works" className="block hover:text-foreground transition-colors">How it Works</a>
                <a href="#verification" className="block hover:text-foreground transition-colors">Verification</a>
                <Link to="/register" className="block hover:text-foreground transition-colors">Get Started</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Company</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">About</a>
                <a href="#" className="block hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="block hover:text-foreground transition-colors">Terms</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2026 Wostup. All rights reserved.</p>
            <div className="flex gap-4">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <Globe className="h-4 w-4" />
              </div>
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
