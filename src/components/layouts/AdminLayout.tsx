import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  BarChart3,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Building2, label: "Startups", href: "/admin/startups" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Shield, label: "Moderation", href: "/admin/moderation" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="flex-1 space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        const link = (
          <Link
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="h-5 w-5" />
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
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border sticky top-0 h-screen shrink-0">
        <div className="p-6">
          <Logo size="sm" />
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top navbar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-sidebar text-sidebar-foreground border-r-0">
                <div className="p-6 border-b border-sidebar-border">
                  <Logo size="sm" />
                </div>
                <div className="px-4 py-6">
                  <NavLinks isMobile />
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <Logo size="xs" />
            </div>
          </div>

          <div className="hidden lg:block flex-1" />

          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-destructive text-destructive-foreground text-sm">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/login">Sign out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
