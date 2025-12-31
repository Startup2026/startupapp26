import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    label: "Total Startups",
    value: "524",
    change: "+12",
    trend: "up",
    icon: Building2,
    color: "bg-accent/10 text-accent",
  },
  {
    label: "Total Students",
    value: "12,847",
    change: "+234",
    trend: "up",
    icon: Users,
    color: "bg-success/10 text-success",
  },
  {
    label: "Active Job Posts",
    value: "1,892",
    change: "+67",
    trend: "up",
    icon: Briefcase,
    color: "bg-warning/10 text-warning",
  },
  {
    label: "Applications Today",
    value: "342",
    change: "-12",
    trend: "down",
    icon: Activity,
    color: "bg-destructive/10 text-destructive",
  },
];

const recentActivity = [
  { id: 1, action: "New startup registered", entity: "CloudNine", type: "startup", time: "2 min ago" },
  { id: 2, action: "Job post flagged", entity: "Marketing Role at XYZ", type: "moderation", time: "15 min ago" },
  { id: 3, action: "New student signup", entity: "John Doe", type: "user", time: "30 min ago" },
  { id: 4, action: "Startup verified", entity: "TechFlow AI", type: "verification", time: "1 hour ago" },
  { id: 5, action: "Job post approved", entity: "Frontend Dev at ABC", type: "approval", time: "2 hours ago" },
];

const pendingVerifications = [
  { id: 1, name: "InnovateTech", domain: "SaaS", submitted: "2 days ago" },
  { id: 2, name: "GreenGrow", domain: "AgriTech", submitted: "3 days ago" },
  { id: 3, name: "MediCare Plus", domain: "HealthTech", submitted: "5 days ago" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Platform overview and management
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-3xl font-bold mt-4">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.entity}</p>
                    </div>
                    <Badge
                      variant={
                        activity.type === "moderation"
                          ? "warning"
                          : activity.type === "verification"
                          ? "success"
                          : "muted"
                      }
                    >
                      {activity.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground hidden md:block">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Pending verifications */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingVerifications.map((startup) => (
                  <div
                    key={startup.id}
                    className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center font-semibold text-accent">
                        {startup.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold">{startup.name}</h4>
                        <Badge variant="accent" className="text-xs mt-1">
                          {startup.domain}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Submitted {startup.submitted}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
