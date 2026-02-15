import { StartupLayout } from "@/components/layouts/StartupLayout";
import { AdvancedJobAnalytics } from "@/components/startup/AdvancedJobAnalytics";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { UpgradeModal } from "@/components/startup/UpgradeModal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const AdvancedAnalysisPage = () => {
  const { getFeatureValue, loading } = usePlanAccess();
  const navigate = useNavigate();

  if (loading) return null;

  // Access check: Advanced analysis requires "advanced" level for jobAnalysis
  const hasAdvancedAccess = getFeatureValue("jobAnalysis") === "advanced";

  return (
    <StartupLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
            <p className="text-muted-foreground">Deep statistical insights into your hiring pipeline and candidate pool.</p>
          </div>
        </div>

        {hasAdvancedAccess ? (
          <AdvancedJobAnalytics />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-3xl border border-dashed text-center space-y-4">
            <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-accent" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-xl font-bold">Pro Feature Locked</h2>
              <p className="text-muted-foreground">
                Statistical hiring velocity and interview yield metrics are available on Pro and Enterprise plans.
              </p>
            </div>
            <Button onClick={() => navigate("/startup/select-plan")}>
              Upgrade to Pro
            </Button>
          </div>
        )}
      </div>
    </StartupLayout>
  );
};

export default AdvancedAnalysisPage;
