import { useState, useEffect } from "react";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Clock, AlertTriangle, Info, CheckCircle, XCircle, Briefcase, UserCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/contexts/SocketContext";
import { cn } from "@/lib/utils";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'application_update' | 'interview';
  read: boolean;
  createdAt: string;
}

export default function StartupNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { socket } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    console.log("StartupNotificationsPage: Socket active, listening for events...");

    const handleNotification = (notification: Notification) => {
      console.log("StartupNotificationsPage: Notification received", notification);
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === notification._id);
        return exists ? prev : [notification, ...prev];
      });
    };

    socket.on("notification", handleNotification);
    socket.on("new_notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("new_notification", handleNotification);
    };
  }, [socket, toast]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<Notification[]>("/notifications");
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load notifications.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Network error.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        window.dispatchEvent(new CustomEvent('notificationRead'));
      }
    } catch (error) {
        console.error("Error marking as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
        const response = await apiFetch("/notifications/read-all", { method: "PUT" });
        if(response.success){
            setNotifications(prev => prev.map(n => ({...n, read: true})));
            toast({
                title: "All cleared",
                description: "All notifications marked as read",
            });
            window.dispatchEvent(new CustomEvent('allNotificationsRead'));
        }
    } catch(error){
        console.error("failed to mark all as read");
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error": return <XCircle className="h-5 w-5 text-red-500" />;
      case "application_update": return <Briefcase className="h-5 w-5 text-blue-500" />;
      case "interview": return <UserCheck className="h-5 w-5 text-accent" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <StartupLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Startup Notifications</h1>
            <p className="text-muted-foreground">
              Manage alerts for applicants, interviews, and your job updates.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={notifications.every(n => n.read)}>
            <Check className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
             Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted p-4 rounded-full mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No alerts today</h3>
                <p className="text-muted-foreground mt-1 max-w-sm">
                  We'll ping you here when candidates apply or respond to your interview requests.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification._id} 
                className={cn(
                  "transition-all hover:shadow-md cursor-pointer",
                  !notification.read 
                    ? "bg-accent/[0.03] border-l-4 border-l-accent" 
                    : "bg-card" 
                )}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                        <h4 className={cn(
                          "font-bold text-base",
                          !notification.read ? "text-foreground" : "text-foreground/70"
                        )}>
                            {notification.title}
                        </h4>
                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      !notification.read ? "text-foreground/90" : "text-muted-foreground"
                    )}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </StartupLayout>
  );
}
