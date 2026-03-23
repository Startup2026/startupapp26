import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { startupDashboardService } from "@/services/startupDashboardService";
import { toast } from "@/hooks/use-toast";

const RecruiterPlanPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePlanSelection = async (hasPlan: boolean) => {
    setLoading(true);
    try {
      await startupDashboardService.setRecruiterPlan({
        hasRecruiterPlan: hasPlan,
      });
      toast({
        title: "Success",
        description: "Your preference has been saved.",
      });
      if (hasPlan) {
        navigate("/startup/dashboard"); // This will now show the toggle
      } else {
        navigate("/dashboard"); // The regular startup dashboard
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save your preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recruiter Plan</CardTitle>
          <CardDescription>
            Do you want to enable the recruiter plan to access advanced hiring
            features and a dedicated startup page?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-around">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handlePlanSelection(true)}
              disabled={loading}
            >
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Yes, I want it
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handlePlanSelection(false)}
              disabled={loading}
            >
              <XCircle className="mr-2 h-5 w-5 text-red-500" />
              No, maybe later
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">
            You can change this setting later from your profile.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecruiterPlanPage;
