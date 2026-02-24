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
import { Check, Rocket, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

const PLANS = [
  {
    name: "GROWTH",
    price: "$49/mo",
    icon: <Rocket className="h-5 w-5 text-blue-500" />,
    features: ["Unlimited job posts", "Full applicant access", "Interview Calendar", "Advanced Filtering"],
  },
  {
    name: "PRO",
    price: "$149/mo",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    features: ["AI Candidate Ranking", "Auto Shortlisting", "Featured Listings", "Advanced Analytics"],
  },
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {PLANS.map((plan) => (
            <Card key={plan.name} className="border-2 hover:border-primary transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-secondary rounded-lg">{plan.icon}</div>
                  <div className="text-right">
                    <span className="text-xl font-bold">{plan.price}</span>
                  </div>
                </div>
                <UICardTitle className="mt-2 text-xl font-bold">{plan.name}</UICardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
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
                  Upgrade Now
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
