import { ReactNode, useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  User,
  BarChart3,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  TrendingUp,
  Rss,
  Bookmark,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { formatDistanceToNow } from "date-fns";

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Building2, label: "Startups", href: "/admin/startups" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Shield, label: "Moderation", href: "/admin/moderation" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

const incubatorNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/incubator/dashboard" },
  { icon: TrendingUp, label: "Trending", href: "/incubator/trending" },
  { icon: Rss, label: "Feed", href: "/incubator/feed" },
  { icon: Bookmark, label: "Saved", href: "/incubator/saved" },
  { icon: User, label: "Profile", href: "/incubator/profile" },
  { icon: BarChart3, label: "Social Analysis", href: "/incubator/social-analysis" },
  { icon: Bell, label: "Notifications", href: "/incubator/notifications" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    // If the user is an incubator admin but their profile is not completed
    if (user?.role === 'incubator_admin' && !user.profileCompleted && location.pathname !== '/incubator/create-profile') {
      navigate('/incubator/create-profile');
    }
  }, [user, location.pathname, navigate]);
  
  const navItems = user?.role === 'incubator_admin' ? incubatorNavItems : adminNavItems;

  const fetchNotifications = useCallback(async () => {
    if (user?.role !== 'incubator_admin') return;
    try {
      const [countRes, notifRes] = await Promise.all([
        apiFetch<{ count: number }>('/notifications/unread-count'),
        apiFetch<any[]>('/notifications'),
      ]);

      if (countRes.success && typeof countRes.count === 'number') {
        setUnreadCount(countRes.count);
      }

      if (notifRes.success && notifRes.data) {
        setNotifications(notifRes.data.slice(0, 10));
      }
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  }, [user?.role]);

  useEffect(() => {
    if (user?.role !== 'incubator_admin') return;
    fetchNotifications();

    const refresh = () => fetchNotifications();
    window.addEventListener('notificationRead', refresh);
    window.addEventListener('allNotificationsRead', refresh);

    return () => {
      window.removeEventListener('notificationRead', refresh);
      window.removeEventListener('allNotificationsRead', refresh);
    };
  }, [fetchNotifications, user?.role]);

  useEffect(() => {
    if (!socket || user?.role !== 'incubator_admin') return;

    const handleNewNotification = (notification: any) => {
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === notification._id);
        if (exists) return prev;
        return [notification, ...prev].slice(0, 10);
      });
    };

    socket.on('notification', handleNewNotification);
    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, user?.role]);

  const renderNotificationTrigger = () => {
    if (user?.role !== 'incubator_admin') {
      return (
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
        </Button>
      );
    }

    return (
      <Popover
        open={notifOpen}
        onOpenChange={(openState) => {
          setNotifOpen(openState);
          if (openState) {
            fetchNotifications();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1 min-w-[1.1rem] h-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center border-2 border-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
            )}
          </div>
          <ScrollArea className="h-[360px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-3 opacity-60" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setNotifOpen(false);
                      navigate('/incubator/notifications');
                    }}
                  >
                    <p className="text-sm font-semibold line-clamp-1">{notif.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{notif.message}</p>
                    <div className="text-[10px] text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
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
                navigate('/incubator/notifications');
              }}
            >
              View All
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

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

        <div className="flex-1 min-h-0 px-4 overflow-y-auto">
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
              <SheetContent side="left" className="w-[280px] p-0 bg-sidebar text-sidebar-foreground border-r-0 flex h-full flex-col">
                <div className="p-6 border-b border-sidebar-border">
                  <Logo size="sm" />
                </div>
                <div className="flex-1 min-h-0 px-4 py-6 overflow-y-auto">
                  <NavLinks isMobile />
                </div>
                <div className="p-4 border-t border-sidebar-border shrink-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <Logo size="xs" />
            </div>
          </div>

          <div className="hidden lg:block flex-1" />

          <div className="flex items-center gap-4 ml-auto">
            {renderNotificationTrigger()}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-destructive text-destructive-foreground text-sm">
                      {user?.role === 'incubator_admin' ? 'IA' : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.role === 'incubator_admin' ? 'Incubator Admin' : 'Platform Admin'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Sign out
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
