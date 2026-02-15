import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Rocket, Zap, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { toast } from "@/hooks/use-toast";
import { startupProfileService } from "@/services/startupProfileService";

const PLANS = [
  {
    name: "FREE",
    price: "$0",
    description: "Perfect for getting started",
    icon: <Star className="h-6 w-6 text-slate-400" />,
    features: [
      "2 Active Jobs", 
      "5 Interviews / month", 
      "Basic Analytics",
      "No Bulk Email",
      "No Job Analysis",
      "No Social Recruiter"
    ],
    recommended: false
  },
  {
    name: "GROWTH",
    price: "$49/mo",
    description: "For growing startups",
    icon: <Rocket className="h-6 w-6 text-blue-500" />,
    features: [
      "10 Active Jobs", 
      "50 Interviews / month", 
      "Advanced Analytics",
      "Bulk Email Support",
      "Basic Job Analysis",
      "No Social Recruiter"
    ],
    recommended: true
  },
  {
    name: "PRO",
    price: "$149/mo",
    description: "Advanced hiring tools",
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    features: [
      "25 Active Jobs", 
      "200 Interviews / month", 
      "Full Suite Analytics",
      "Bulk Email Support",
      "Advanced Job Analysis",
      "Social Recruiter Tools"
    ],
    recommended: false
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    description: "Built for scale",
    icon: <ShieldCheck className="h-6 w-6 text-purple-500" />,
    features: [
      "Unlimited Active Jobs", 
      "Unlimited Interviews", 
      "Custom Analytics",
      "Priority Bulk Email",
      "Advanced Job Analysis",
      "Social Recruiter Suite"
    ],
    recommended: false
  }
];

export default function SelectPlanPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const handleSelectPlan = async (planName: string) => {
    setIsSubmitting(planName);
    try {
      const result = await startupProfileService.selectPlan(planName);
      if (result.success) {
        toast({
          title: "Plan Selected!",
          description: `Your startup is now on the ${planName} plan.`,
        });
        navigate("/startup/dashboard");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update plan. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <div className="mb-12">
        <Logo size="lg" />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Select your plan</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose the best plan for your startup's hiring needs. All premium plans include a 30-day free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {PLANS.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col relative ${plan.recommended ? 'border-primary shadow-lg scale-105 z-10' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Recommended
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-secondary`}>
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-muted-foreground ml-1">/month</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12" 
                variant={plan.recommended ? "default" : "outline"}
                disabled={isSubmitting !== null}
                onClick={() => handleSelectPlan(plan.name)}
              >
                {isSubmitting === plan.name ? "Processing..." : `Choose ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>All plans are billed annually. Taxes may apply.</p>
        <Button 
          variant="link" 
          onClick={() => handleSelectPlan("FREE")} 
          disabled={isSubmitting !== null}
          className="mt-4"
        >
          {isSubmitting === "FREE" ? "Assigning Free Plan..." : "Skip for now (Assign Free plan)"}
        </Button>
      </div>
    </div>
  );
}
