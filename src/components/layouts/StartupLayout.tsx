import { ReactNode, useState, useEffect } from "react";
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
  Clock,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { useSocket } from "@/contexts/SocketContext";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const { socket } = useSocket();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
       console.error("Logout failed", error);
    }
  };

  // Fetch unread count and recent notifications
  useEffect(() => {
    const fetchData = async () => {
      // Fetch unread count
      const countRes = await apiFetch<{ count: number }>("/notifications/unread-count");
      if (countRes.success && countRes.count !== undefined) {
        setUnreadCount(countRes.count);
      }

      // Fetch recent notifications (limit to 10)
      const notifRes = await apiFetch<any[]>("/notifications");
      if (notifRes.success && notifRes.data) {
        setNotifications(notifRes.data.slice(0, 10));
      }
    };
    fetchData();

    // Listen for custom events to refresh count (e.g., from notifications page)
    const handleRefresh = () => {
      fetchData();
    };
    
    window.addEventListener('notificationRead', handleRefresh);
    window.addEventListener('allNotificationsRead', handleRefresh);

    return () => {
      window.removeEventListener('notificationRead', handleRefresh);
      window.removeEventListener('allNotificationsRead', handleRefresh);
    };
  }, []);

  // Listen for new notifications via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: any) => {
      console.log("StartupLayout: Socket received notification", notification);
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [notification, ...prev].slice(0, 10));
    };

    socket.on("notification", handleNewNotification);
    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  const markAsRead = async (id: string) => {
    try {
      const res = await apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
      if (res.success) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        window.dispatchEvent(new CustomEvent('notificationRead', { detail: { id } }));
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign out</span>
          </Button>
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
                <div className="mt-auto p-4 border-t border-sidebar-border">
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-sidebar-foreground/70"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="lg:hidden flex items-center gap-2">
              <Logo size="xs" />
              <span className="text-lg font-bold">Wostup</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <Popover open={notifOpen} onOpenChange={setNotifOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0 -right-0 h-4 min-w-[1rem] flex items-center justify-center px-1 rounded-full bg-accent text-[10px] font-bold text-accent-foreground border-2 border-background">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[320px] p-0">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>
                <ScrollArea className="h-[350px]">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Bell className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">No notifications yet</p>
                      <p className="text-xs text-muted-foreground mt-1">We'll notify you when something important happens</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={cn(
                            "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative",
                            !notif.read && "bg-accent/5"
                          )}
                          onClick={() => markAsRead(notif._id)}
                        >
                          <div className="flex gap-3">
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                              notif.type === 'application_update' ? "bg-blue-100 text-blue-600" : "bg-accent/10 text-accent"
                            )}>
                              {notif.type === 'application_update' ? <Briefcase className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-xs font-semibold truncate", !notif.read && "text-primary")}>
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                            {!notif.read && (
                              <div className="h-2 w-2 rounded-full bg-accent absolute top-4 right-4" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <div className="p-3 border-t border-border bg-muted/20">
                  <Link 
                    to={user?.role === 'startup' ? "/startup/notifications" : "/student/notifications"} 
                    className="block text-center text-xs font-medium text-accent hover:underline"
                    onClick={() => setNotifOpen(false)}
                  >
                    View All Notifications
                  </Link>
                </div>
              </PopoverContent>
            </Popover>

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