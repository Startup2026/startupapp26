import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  User,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  UserCheck,
  UserPlus,
  BarChart3,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getStoredUser } from "@/lib/api";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/startup/dashboard" },
  { icon: Briefcase, label: "Jobs", href: "/startup/jobs" },
  // { icon: Users, label: "Applicants", href: "/startup/applicants" },
  // New Sections Added Below
  { icon: UserCheck, label: "Shortlisted", href: "/startup/shortlisted" },
  { icon: UserPlus, label: "Selected", href: "/startup/selected" },
  { icon: BarChart3, label: "Analysis", href: "/startup/analysis" },
  { icon: TrendingUp, label: "Social Analysis", href: "/startup/social-media-analysis" },
  { icon: Calendar, label: "Interviews", href: "/startup/interviews" },
  // ---
  // { icon: MessageSquare, label: "Updates", href: "/startup/updates" },
  { icon: User, label: "Profile", href: "/startup/profile" },
  { icon: Settings, label: "Settings", href: "/startup/settings" },
];

// ... rest of your component logic remains the same

export function StartupLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const user = getStoredUser();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="flex-1 space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        const link = (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "text-accent")} />
            <span>{item.label}</span>
            {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
          </Link>
        );

        return isMobile ? (
          <SheetClose asChild key={item.href}>
            {link}
          </SheetClose>
        ) : (
          <div key={item.href}>{link}</div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      <aside className="hidden lg:flex lg:w-64 flex-col bg-sidebar border-r border-sidebar-border sticky top-0 h-screen shrink-0">
        <div className="p-6 flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-xl font-bold tracking-tight text-sidebar-foreground">Wostup</span>
        </div>
        <div className="flex-1 px-4 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-sidebar-border">
          <Link to="/login">
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </Button>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-r-0">
                <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
                  <Logo size="sm" />
                  <span className="text-xl font-bold text-sidebar-foreground">Wostup</span>
                </div>
                <div className="px-4 py-6">
                  <NavLinks isMobile />
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="lg:hidden flex items-center gap-2">
              <Logo size="xs" />
              <span className="text-lg font-bold">Wostup</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent border-2 border-background" />
            </Button>

            <Avatar className="h-8 w-8 ring-2 ring-accent/20">
              <AvatarFallback className="bg-accent text-accent-foreground text-xs uppercase font-bold">
                {user?.username?.substring(0, 2) || "ST"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background/50">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}