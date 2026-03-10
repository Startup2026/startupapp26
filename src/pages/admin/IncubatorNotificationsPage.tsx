import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Check, Clock, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/contexts/SocketContext";
import { cn } from "@/lib/utils";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "application_update" | "interview";
  read: boolean;
  createdAt: string;
}

export default function IncubatorNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { socket } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
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
  }, [socket]);

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
      console.error("Error fetching incubator notifications", error);
      toast({
        title: "Error",
        description: "Network error. Please retry.",
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
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
        window.dispatchEvent(new CustomEvent("notificationRead"));
      }
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await apiFetch("/notifications/read-all", { method: "PUT" });
      if (response.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast({ title: "All caught up", description: "All notifications marked as read." });
        window.dispatchEvent(new CustomEvent("allNotificationsRead"));
      }
    } catch (error) {
      console.error("Error clearing notifications", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "application_update":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "interview":
        return <Bell className="h-5 w-5 text-accent" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Live alerts</p>
            <h1 className="text-3xl font-bold">Incubator Notifications</h1>
            <p className="text-muted-foreground">
              Track startup activity, payouts, and approvals without refreshing the page.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={notifications.every((n) => n.read)}>
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="bg-muted rounded-full p-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold">No notifications yet</p>
                <p className="text-muted-foreground">
                  When startups engage or payouts change, you'll see it here instantly.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification._id}
                className={cn(
                  "transition-all hover:shadow-md cursor-pointer",
                  notification.read ? "bg-card" : "bg-accent/10 border-l-4 border-l-accent"
                )}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <CardContent className="p-5 flex gap-4">
                  <div className="mt-1 flex-shrink-0">{getIcon(notification.type)}</div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className={cn("font-semibold", notification.read && "text-foreground/70")}>{notification.title}</h3>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className={cn("text-sm", notification.read ? "text-muted-foreground" : "text-foreground")}>{notification.message}</p>
                    {notification.read && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Check className="h-3 w-3" />
                        Read
                      </span>
                    )}
                  </div>
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-accent mt-2" />}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
