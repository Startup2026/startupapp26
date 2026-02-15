import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  FileText,
  User,
  Bell,
  LogOut,
  ChevronRight,
  Rss,
  TrendingUp,
  Bookmark,
  Menu,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getStoredUser, apiFetch } from "@/lib/api";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Settings } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
  { icon: Briefcase, label: "Jobs", href: "/student/jobs" },
  { icon: TrendingUp, label: "Trending", href: "/student/TrendingJobs" },
  { icon: Building2, label: "Startups", href: "/student/startups" },
  { icon: Rss, label: "Feed", href: "/student/feed" },
  { icon: Bookmark, label: "Saved", href: "/student/saved" },
  { icon: FileText, label: "Applications", href: "/student/applications" },
  { icon: Bell, label: "Notifications", href: "/student/notifications" },
];

export function StudentLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const { socket } = useSocket();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
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

    // Listen for custom events to refresh count
    const handleNotificationRead = () => {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };
    
    const handleAllRead = () => {
      setUnreadCount(0);
    };

    window.addEventListener('notificationRead', handleNotificationRead);
    window.addEventListener('allNotificationsRead', handleAllRead);

    return () => {
      window.removeEventListener('notificationRead', handleNotificationRead);
      window.removeEventListener('allNotificationsRead', handleAllRead);
    };
  }, []);

  // Listen for new notifications via socket
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: any) => {
      console.log("StudentLayout: Socket received notification", notification);
      setUnreadCount((prev) => prev + 1);
      
      // Add to notifications list at the top
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === notification._id);
        if (exists) return prev;
        // Keep only top 10
        return [notification, ...prev].slice(0, 10);
      });
      
      // Toast is now handled globally in SocketContext, 
      // but we could leave it here or remove it to avoid duplicates.
      // The user wants the COUNTER to update, which we handle above with setUnreadCount.
    };

    // Register listener for both event names
    socket.on("notification", handleNotification);
    socket.on("new_notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("new_notification", handleNotification);
    };
  }, [socket]);

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
      <aside className="hidden lg:flex lg:w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border sticky top-0 h-screen shrink-0">
        <div className="p-6">
          <Logo size="sm" variant="light" />
        </div>
        <div className="flex-1 px-4 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-sidebar-border space-y-1">
          <Link to="/student/profile">
            <Button variant="ghost" className={cn(
              "w-full justify-start gap-3 transition-all duration-200",
              location.pathname === "/student/profile" 
                ? "bg-sidebar-accent text-sidebar-primary shadow-sm" 
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}>
              <User className={cn("h-5 w-5", location.pathname === "/student/profile" && "text-accent")} />
              <span>Profile</span>
            </Button>
          </Link>
          <Link to="/student/settings">
            <Button variant="ghost" className={cn(
              "w-full justify-start gap-3 transition-all duration-200",
              location.pathname === "/student/settings" 
                ? "bg-sidebar-accent text-sidebar-primary shadow-sm" 
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}>
              <Settings className={cn("h-5 w-5", location.pathname === "/student/settings" && "text-accent")} />
              <span>Settings</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={handleLogout}
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
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-accent/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-sidebar text-sidebar-foreground border-r-0">
                <div className="p-6 border-b border-sidebar-border">
                  <Logo size="sm" variant="light" />
                </div>
                <div className="px-4 py-6 flex flex-col h-[calc(100vh-80px)]">
                  <NavLinks isMobile />
                  <div className="mt-auto pt-6 border-t border-sidebar-border space-y-1">
                    <Link to="/student/profile" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className={cn(
                        "w-full justify-start gap-3 transition-all duration-200 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                        location.pathname === "/student/profile" && "bg-sidebar-accent text-sidebar-primary shadow-sm"
                      )}>
                        <User className={cn("h-5 w-5", location.pathname === "/student/profile" && "text-accent")} />
                        <span>Profile</span>
                      </Button>
                    </Link>
                    <Link to="/student/settings" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className={cn(
                        "w-full justify-start gap-3 transition-all duration-200 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                        location.pathname === "/student/settings" && "bg-sidebar-accent text-sidebar-primary shadow-sm"
                      )}>
                        <Settings className={cn("h-5 w-5", location.pathname === "/student/settings" && "text-accent")} />
                        <span>Settings</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 text-destructive hover:bg-destructive/5 hover:text-destructive"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign out</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="lg:hidden">
              <Logo size="xs" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <Popover open={notifOpen} onOpenChange={(open) => {
              setNotifOpen(open);
              if (open) {
                // Refresh notifications when opening dropdown to ensure correct read status
                apiFetch<any[]>("/notifications").then(res => {
                  if (res.success && res.data) {
                    setNotifications(res.data.slice(0, 10));
                  }
                });
                apiFetch<{ count: number }>("/notifications/unread-count").then(res => {
                   if (res.success && res.count !== undefined) setUnreadCount(res.count);
                });
              }
            }}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-9 w-9"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center border-2 border-background">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
                  )}
                </div>
                <ScrollArea className="h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={cn(
                            "p-4 transition-colors cursor-pointer border-b last:border-0",
                            // Unread: Accent background
                            !notif.read && "bg-accent/10 hover:bg-accent/15",
                            // Read: Standard background, clean hover
                            notif.read && "bg-background hover:bg-muted/50"
                          )}
                          onClick={() => {
                            setNotifOpen(false);
                            navigate("/student/notifications");
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn("mt-1 shrink-0", !notif.read ? "text-accent" : "text-muted-foreground")}>
                              <Bell className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-semibold line-clamp-1", notif.read && "font-medium text-foreground/80")}>
                                {notif.title}
                              </p>
                              <p className={cn("text-xs line-clamp-2 mt-1", notif.read ? "text-muted-foreground" : "text-foreground/90")}>
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </p>
                                {notif.read && (
                                  <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                                    Read
                                  </span>
                                )}
                              </div>
                            </div>
                            {!notif.read && (
                              <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-2 animate-pulse" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <div className="p-2 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-sm"
                    onClick={() => {
                      setNotifOpen(false);
                      navigate("/student/notifications");
                    }}
                  >
                    View All Notifications
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 lg:gap-3 px-1 lg:px-3 hover:bg-accent/10">
                  <Avatar className="h-8 w-8 ring-2 ring-accent/20">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs uppercase font-bold">
                      {user?.username?.substring(0, 2) || "JD"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-semibold truncate max-w-[120px]">
                    {user?.username || "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border mt-1 shadow-lg">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/student/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Student Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/student/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-medium"
                  onClick={handleLogout}
                >
                  <div className="flex w-full items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}