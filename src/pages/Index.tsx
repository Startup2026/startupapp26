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
  Check,
  Star,
  Globe,
  Rocket,
  Search,
  MessageSquare,
  Award,
  Sparkles,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

const testimonials = [
  {
    quote: "Wostup helped us find our core engineering team in weeks, not months. The quality of student talent is unmatched.",
    author: "Sarah Chen",
    role: "Founder, NexaTech",
    avatar: "SC"
  },
  {
    quote: "The advanced analytics gave us insights into our hiring funnel we've never had before. Truly game-changing.",
    author: "Marc Veras",
    role: "HR Lead, CloudScale",
    avatar: "MV"
  },
  {
    quote: "As a student, Wostup gave me direct access to founders. I landed my dream internship within 3 applications.",
    author: "Alex Rivera",
    role: "CS Student, MIT",
    avatar: "AR"
  }
];

const steps = [
  {
    title: "Create your profile",
    desc: "Showcase your skills or your startup's vision with our rich profile builder.",
    icon: Users
  },
  {
    title: "Connect & Discover",
    desc: "Browse vetted opportunities or discover top student talent using smart filters.",
    icon: Search
  },
  {
    title: "Hire or Get Hired",
    desc: "Direct communication and streamlined applications make the process effortless.",
    icon: Briefcase
  }
];

const features = [
  {
    icon: Building2,
    title: "500+ Vetted Startups",
    description: "Every company on our platform undergoes a rigorous verification process to ensure transparency and trust.",
  },
  {
    icon: Briefcase,
    title: "2,000+ Premium Roles",
    description: "Access exclusive internships and full-time positions from high-growth ventures across the globe.",
  },
  {
    icon: TrendingUp,
    title: "Mathematical Analytics",
    description: "Eliminate guesswork with deep statistical insights into candidate yield, hiring velocity, and skill density.",
  },
  {
    icon: Globe,
    title: "Social Ecosystem",
    description: "Build your employer brand or professional portfolio within a community-driven social recruiter framework.",
  },
];

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Ideal for startups just beginning their talent discovery journey.",
    features: [
      "2 Active Job Postings",
      "5 Interviews / Month",
      "Standard Dashboard Access",
      "Community Support"
    ],
    buttonText: "Start Free",
    popular: false
  },
  {
    name: "Growth",
    price: "49",
    description: "Comprehensive tools for scaling teams with precision and speed.",
    features: [
      "10 Active Job Postings",
      "50 Interviews / Month",
      "Advanced Statistical Suite",
      "Social Recruitment Tools",
      "Priority Email Support"
    ],
    buttonText: "Get Started",
    popular: true
  },
  {
    name: "Pro",
    price: "99",
    description: "The ultimate solution for professional hiring and brand building.",
    features: [
      "25 Active Job Postings",
      "200 Interviews / Month",
      "Full Data Export Rights",
      "Custom Brand Integration",
      "Dedicated Account Success"
    ],
    buttonText: "Join Pro",
    popular: false
  }
];

const stats = [
  { value: "12K+", label: "Active Students" },
  { value: "650+", label: "Verified Startups" },
  { value: "3.5K+", label: "Total Hires" },
  { value: "98%", label: "Satisfaction Rate" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-accent/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-2xl border-b border-black/5 animate-fade-in">
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Logo size="sm" />
            <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-[0.1em] text-black/50">
              <a href="#how-it-works" className="hover:text-black transition-all">How it works</a>
              <a href="#features" className="hover:text-black transition-all">Ecosystem</a>
              <a href="#pricing" className="hover:text-black transition-all">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-bold text-[13px] tracking-widest uppercase hover:bg-black/5 px-6">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-black text-white rounded-full px-8 h-12 font-bold text-[13px] tracking-widest uppercase hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-2xl shadow-black/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="relative pt-[180px] pb-32 px-8 overflow-hidden bg-white">
        {/* Modern Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-accent/5 to-transparent opacity-50 rounded-full blur-[120px]" />
        
        <div className="container mx-auto max-w-7xl relative">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/5 border border-black/5 text-[12px] font-black uppercase tracking-[0.2em] mb-10 animate-fade-in shadow-inner">
                <Sparkles className="h-4 w-4 text-accent fill-accent" />
                Next Generation Talent Hub
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-black leading-[0.95] tracking-[-0.04em] mb-10 animate-slide-up">
                Where great <br />
                <span className="text-accent underline decoration-8 decoration-accent/20 underline-offset-[-2px]">minds</span> meet <br />
                innovation.
              </h1>

              <p className="text-xl md:text-2xl text-black/60 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                The premium network connecting the world's most ambitious students with high-growth startups changing the future.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Link to="/register">
                  <Button size="xl" className="group bg-black text-white h-16 px-10 rounded-2xl text-[14px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-2xl">
                    Join the waitlist
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                  </Button>
                </Link>
                <div className="flex items-center gap-3 ml-4">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-black/10 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-lg">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-black/40">12k+ Joiners</p>
                </div>
              </div>
            </div>

            {/* Abstract Visual Component */}
            <div className="flex-1 w-full max-w-[600px] h-[500px] relative animate-fade-in delay-300">
               <div className="absolute inset-0 bg-accent/10 rounded-[4rem] rotate-3 blur-2xl" />
               <Card className="absolute inset-0 bg-white border-black/5 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden flex flex-col p-10">
                  <div className="h-2 w-full bg-black/5 rounded-full mb-8" />
                  <div className="flex gap-4 mb-8">
                     <div className="h-14 w-14 rounded-2xl bg-accent animate-pulse shadow-xl shadow-accent/20" />
                     <div className="flex-1 space-y-3">
                        <div className="h-4 w-[60%] bg-black/10 rounded-lg" />
                        <div className="h-3 w-[40%] bg-black/5 rounded-lg" />
                     </div>
                  </div>
                  <div className="space-y-6 flex-1">
                     <div className="h-[120px] w-full bg-black/5 rounded-3xl" />
                     <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 w-full bg-accent/5 rounded-2xl border border-accent/10" />
                        <div className="h-20 w-full bg-black/5 rounded-2xl" />
                     </div>
                  </div>
                  <div className="pt-8 flex justify-between items-center">
                     <div className="h-3 w-20 bg-black/5 rounded-lg" />
                     <div className="h-10 w-24 bg-black rounded-xl translate-y-4" />
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-y border-black/5">
         <div className="container mx-auto px-8">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-12">Trusted by founders worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-40 grayscale contrast-125">
               <div className="flex items-center gap-2 font-black text-2xl italic">NEXA</div>
               <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">CLOUDSCALE.</div>
               <div className="flex items-center gap-2 font-black text-2xl">HYPER_</div>
               <div className="flex items-center gap-2 font-black text-2xl lowercase tracking-widest italic">orbit</div>
               <div className="flex items-center gap-2 font-black text-2xl">Z-CORP</div>
            </div>
         </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 bg-[#fafafa]">
         <div className="container mx-auto px-8">
            <div className="text-center mb-24">
               <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">The Ecosystem built for speed.</h2>
               <p className="text-black/50 text-xl font-medium">Simple steps to 10x your growth potential.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
               {steps.map((step, idx) => (
                  <div key={idx} className="relative group p-8 rounded-[3rem] bg-white border border-black/[0.03] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2">
                     <div className="h-16 w-16 bg-black rounded-2xl flex items-center justify-center text-white mb-10 group-hover:rotate-6 transition-transform">
                        <step.icon className="h-7 w-7" />
                     </div>
                     <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                     <p className="text-black/60 font-medium leading-relaxed">{step.desc}</p>
                     <div className="absolute top-8 right-8 text-[40px] font-black text-black/[0.02] leading-none select-none">0{idx+1}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Statistics section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-accent/20 opacity-30 blur-[100px]" />
         <div className="container mx-auto px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
               {stats.map((stat, idx) => (
                  <div key={idx}>
                     <div className="text-6xl md:text-7xl font-black mb-2 tracking-tighter text-accent italic">{stat.value}</div>
                     <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{stat.label}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mb-24">
            <div className="inline-block px-4 py-1.5 mb-8 text-[11px] font-black tracking-[0.3em] text-accent bg-accent/5 rounded-full uppercase border border-accent/10">
              The Architecture
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-black mb-8 leading-[0.9] tracking-tighter">
              Professional tools for <br />professional results.
            </h2>
            <p className="text-xl text-black/50 font-medium max-w-2xl leading-relaxed">
              We've redesigned the recruitment interface from the ground up to focus on what matters: real data, real connections, and real growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-12 bg-[#fafafa] border border-black/[0.03] rounded-[3.5rem] hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-500"
              >
                <div className="h-20 w-20 rounded-3xl bg-white border border-black/5 flex items-center justify-center mb-10 group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm">
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black mb-5 tracking-tight">{feature.title}</h3>
                <p className="text-black/60 text-lg font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[#111] text-white">
         <div className="container mx-auto px-8">
            <div className="flex flex-col lg:flex-row gap-20">
               <div className="flex-1">
                  <Quote className="h-16 w-16 text-accent opacity-50 mb-10" strokeWidth={3} />
                  <h2 className="text-5xl md:text-6xl font-black leading-[0.95] mb-12">Voices of the <br /> <span className="italic">new wave.</span></h2>
                  <div className="h-1 w-24 bg-accent" />
               </div>
               <div className="flex-[1.5] space-y-8">
                  {testimonials.map((t, idx) => (
                     <div key={idx} className="p-10 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/10 transition-colors">
                        <p className="text-2xl font-medium leading-relaxed mb-8">"{t.quote}"</p>
                        <div className="flex items-center gap-5">
                           <div className="h-12 w-12 rounded-full bg-accent text-black font-black flex items-center justify-center text-sm">{t.avatar}</div>
                           <div>
                              <div className="font-black text-sm uppercase tracking-widest">{t.author}</div>
                              <div className="text-accent text-[11px] font-bold uppercase tracking-widest mt-1">{t.role}</div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="py-32 px-8 bg-white overflow-hidden relative">
        <div className="container mx-auto">
          <div className="text-center mb-24">
             <div className="inline-block px-4 py-1.5 mb-8 text-[11px] font-black tracking-[0.3em] text-black/40 bg-black/5 rounded-full uppercase">
                The Investment
             </div>
             <h2 className="text-5xl md:text-7xl font-black text-black mb-8 leading-[0.95] tracking-tighter">
                Scale without limits.
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1240px] mx-auto">
             {plans.map((plan, idx) => (
                <div 
                  key={plan.name} 
                  className={`flex flex-col p-12 rounded-[3.5rem] border-2 transition-all duration-500 hover:-translate-y-2 ${
                    plan.popular ? 'border-accent bg-white shadow-[0_50px_100px_-20px_rgba(255,107,38,0.15)] z-10' : 'border-black/5 bg-[#fafafa]'
                  }`}
                >
                   <div className="mb-10">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-black/40 mb-3">{plan.name}</h4>
                      <div className="flex items-baseline gap-1">
                         <span className="text-6xl font-black tracking-[-0.05em] italic">${plan.price}</span>
                         <span className="text-black/30 font-black text-[12px] uppercase tracking-widest">/mo</span>
                      </div>
                   </div>
                   <p className="text-[15px] font-medium text-black/50 mb-10 leading-relaxed">{plan.description}</p>
                   <div className="space-y-5 flex-1 mb-12">
                      {plan.features.map(f => (
                         <div key={f} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-accent" />
                            <span className="text-[13px] font-bold text-black/60 uppercase tracking-widest">{f}</span>
                         </div>
                      ))}
                   </div>
                   <Link to="/register" className="w-full">
                      <Button className={`w-full h-16 rounded-[1.5rem] font-black uppercase text-[12px] tracking-widest transition-all duration-300 ${
                         plan.popular ? 'bg-black text-white hover:scale-[1.02]' : 'bg-transparent text-black border-2 border-black/10 hover:bg-black/5'
                      }`}>
                         {plan.buttonText}
                      </Button>
                   </Link>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-8 bg-white">
        <div className="container mx-auto">
          <div className="bg-black text-white rounded-[4rem] px-8 md:px-24 py-24 md:py-32 relative overflow-hidden shadow-[0_60px_100px_-30px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 leading-[0.85]">
                 Build your legacy<br />
                 <span className="italic text-accent">today.</span>
              </h2>
              <p className="text-white/60 text-xl font-medium mb-16 leading-relaxed max-w-2xl mx-auto">
                Join the exclusive ecosystem of elite students and visionary startups. The future of work is here.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link to="/register" className="w-full sm:w-auto">
                   <Button size="xl" className="w-full sm:w-auto bg-accent text-black h-20 px-14 rounded-[2rem] font-black uppercase tracking-widest text-[14px] hover:scale-105 transition-transform shadow-3xl shadow-accent/20">
                      Join the movement
                   </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                   <Button size="xl" variant="outline" className="w-full sm:w-auto h-20 px-14 rounded-[2rem] border-white/20 text-white hover:bg-white/5 font-black uppercase tracking-widest text-[14px]">
                      Contact Sales
                   </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 bg-white border-t border-black/5">
        <div className="container mx-auto max-w-[1240px]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-32">
             <div className="lg:col-span-2 space-y-10">
                <Logo size="md" />
                <p className="text-black/40 text-xl font-medium max-w-sm leading-relaxed">
                   Redefining the relationship between human potential and organizational ambition.
                </p>
                <div className="flex gap-5">
                   <div className="h-14 w-14 rounded-2xl bg-[#fafafa] border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 cursor-pointer text-black/50">
                      <Globe className="h-6 w-6" />
                   </div>
                   <div className="h-14 w-14 rounded-2xl bg-[#fafafa] border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 cursor-pointer text-black/50">
                      <Star className="h-6 w-6" />
                   </div>
                   <div className="h-14 w-14 rounded-2xl bg-[#fafafa] border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 cursor-pointer text-black/50">
                      <MessageSquare className="h-6 w-6" />
                   </div>
                </div>
             </div>
             
             <div>
                <h4 className="font-black uppercase tracking-[0.3em] text-[10px] mb-10 text-black/30">Platform</h4>
                <div className="space-y-6 text-sm font-bold uppercase tracking-widest text-black/80">
                   <a href="#" className="block hover:text-accent transition-colors">The Ecosystem</a>
                   <a href="#" className="block hover:text-accent transition-colors">Startups</a>
                   <a href="#" className="block hover:text-accent transition-colors">Talent Core</a>
                   <a href="#" className="block hover:text-accent transition-colors">Analytics Suite</a>
                </div>
             </div>
             
             <div>
                <h4 className="font-black uppercase tracking-[0.3em] text-[10px] mb-10 text-black/30">Network</h4>
                <div className="space-y-6 text-sm font-bold uppercase tracking-widest text-black/80">
                   <a href="#" className="block hover:text-accent transition-colors">Global Events</a>
                   <a href="#" className="block hover:text-accent transition-colors">Alumni Support</a>
                   <a href="#" className="block hover:text-accent transition-colors">Press Inquiries</a>
                   <a href="#" className="block hover:text-accent transition-colors">Legal Hub</a>
                </div>
             </div>
          </div>
          
          <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-accent" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
                   © 2026 Wostup Inc. / Global Talent Standard
                </p>
             </div>
             <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
                <a href="#" className="hover:text-black transition-colors">Security Strategy</a>
                <a href="#" className="hover:text-black transition-colors">Data Protocol</a>
                <a href="#" className="hover:text-black transition-colors">Terms of Impact</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


