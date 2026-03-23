import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { startupProfileService } from "@/services/startupProfileService";
import { useToast } from "@/hooks/use-toast";

interface DashboardToggleProps {
  initialDashboard: 'hiring' | 'startuppage';
  hasRecruiterPlan: boolean;
}

export const DashboardToggle = ({ initialDashboard, hasRecruiterPlan }: DashboardToggleProps) => {
  const [dashboardType, setDashboardType] = useState(initialDashboard);
  const [isToggling, setIsToggling] = useState(false);
  const { toast } = useToast();

  if (!hasRecruiterPlan) {
    return null;
  }

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const result = await startupProfileService.toggleDashboard();
      if (result.success) {
        setDashboardType(result.data.dashboardType);
        toast({
          title: "Dashboard Switched",
          description: `You are now viewing the ${result.data.dashboardType} dashboard.`,
        });
        // You might want to reload the page or navigate to show the correct dashboard content
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to switch dashboards.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dashboard-toggle"
        checked={dashboardType === 'startuppage'}
        onCheckedChange={handleToggle}
        disabled={isToggling}
      />
      <Label htmlFor="dashboard-toggle">
        {dashboardType === 'startuppage' ? 'Startup Page Dashboard' : 'Hiring Dashboard'}
      </Label>
    </div>
  );
};