import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle as UICardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Rocket, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

const PLANS = [
  {
    name: "SPRINT_3MO",
    title: "Sprint · 3 Months",
    price: "₹999",
    billing: "One-time · 3 months",
    icon: <Rocket className="h-5 w-5 text-blue-500" />,
  },
  {
    name: "BUILDER_6MO",
    title: "Builder · 6 Months",
    price: "₹1,999",
    billing: "Most popular · 6 months",
    icon: <Zap className="h-5 w-5 text-amber-500" />,
  },
  {
    name: "PARTNER_12MO",
    title: "Partner · 12 Months",
    price: "₹2,999",
    billing: "Year-long hiring",
    icon: <Shield className="h-5 w-5 text-purple-500" />,
  },
];

const SHARED_FEATURES = [
  "All platform features included",
  "Advanced analytics",
  "Bulk email outreach",
  "Advanced job analysis",
  "Social recruiter suite",
  "Interview scheduler",
  "Priority support",
];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, featureName }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Upgrade your plan
          </DialogTitle>
          <DialogDescription>
            {featureName ? (
              <>
                The <span className="font-semibold text-primary">{featureName}</span> feature is not available on your current plan.
              </>
            ) : (
              "Get more features for your startup by upgrading to a premium plan."
            )}
          </DialogDescription>
        </DialogHeader>

        <Card className="mt-2">
          <CardHeader>
            <UICardTitle className="text-base">Included in all paid plans</UICardTitle>
            <CardDescription>
              Same full access in every plan. Only duration and price differ.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SHARED_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {PLANS.map((plan) => (
            <Card key={plan.name} className="border-2 hover:border-primary transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-secondary rounded-lg">{plan.icon}</div>
                  <div className="text-right">
                    <span className="text-xl font-bold">{plan.price}</span>
                    <p className="text-xs text-muted-foreground">{plan.billing}</p>
                  </div>
                </div>
                <UICardTitle className="mt-2 text-xl font-bold">{plan.title}</UICardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Includes full shared feature bundle.</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => {
                    onClose();
                    navigate("/startup/select-plan");
                  }}
                >
                  Choose Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-col items-center">
          <p className="text-xs text-muted-foreground mb-4">
            Need a custom plan? <span className="text-primary cursor-pointer">Contact sales</span>
          </p>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
