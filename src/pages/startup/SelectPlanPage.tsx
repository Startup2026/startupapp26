import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Rocket, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { toast } from "@/hooks/use-toast";
import { startupProfileService } from "@/services/startupProfileService";
import { paymentService } from "@/services/paymentService";
import type { PlanName } from "@/config/planFeatures";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PricingPlan = {
  name: PlanName;
  displayName: string;
  durationLabel: string;
  durationMonths?: number;
  totalPriceINR: number;
  effectiveMonthlyINR?: number;
  description: string;
  icon: React.ReactNode;
  recommended?: boolean;
};

const SHARED_FEATURES = [
  "All platform features included",
  "Advanced analytics",
  "Bulk email outreach",
  "Advanced job analysis",
  "Social recruiter suite",
  "Interview scheduler",
  "Priority support",
];

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const PLANS: PricingPlan[] = [
  {
    name: "SPRINT_3MO",
    displayName: "Sprint · 3 Months",
    durationLabel: "3-Month Hiring Cycle",
    durationMonths: 3,
    totalPriceINR: 999,
    effectiveMonthlyINR: 333,
    description: "Full platform access for short-term hiring cycles.",
    icon: <Rocket className="h-6 w-6 text-blue-500" />,
    recommended: false,
  },
  {
    name: "BUILDER_6MO",
    displayName: "Builder · 6 Months",
    durationLabel: "Most Popular",
    durationMonths: 6,
    totalPriceINR: 1999,
    effectiveMonthlyINR: 333,
    description: "Full platform access for medium-term hiring cycles.",
    icon: <Zap className="h-6 w-6 text-amber-500" />,
    recommended: true,
  },
  {
    name: "PARTNER_12MO",
    displayName: "Partner · 12 Months",
    durationLabel: "12-Month Hiring Cycle",
    durationMonths: 12,
    totalPriceINR: 2999,
    effectiveMonthlyINR: 250,
    description: "Full platform access for long-term hiring cycles.",
    icon: <ShieldCheck className="h-6 w-6 text-purple-500" />,
    recommended: false,
  },
];

const RAZORPAY_SCRIPT_ID = "razorpay-checkout-js";

const loadRazorpayScript = async () => {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  const existing = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise<boolean>((resolve) => {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
    });
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = RAZORPAY_SCRIPT_ID;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function SelectPlanPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const handleSelectPlan = async (planName: PlanName) => {
    setIsSubmitting(planName);
    try {
      const selectedPlan = PLANS.find((plan) => plan.name === planName);
      if (!selectedPlan) {
        throw new Error("Unknown plan selected");
      }

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
        toast({
          title: "Unable to load Razorpay",
          description: "Please check your network and try again.",
          variant: "destructive",
        });
        return;
      }

      const orderResponse = await paymentService.createOrder(planName);
      if ((orderResponse as any).error) {
        throw new Error((orderResponse as any).error);
      }

      const order = orderResponse;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_KEY_PLACEHOLDER",
        amount: order.amount,
        currency: order.currency,
        name: "Wostup",
        description: `${selectedPlan.displayName} (${selectedPlan.durationLabel})`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              toast({
                title: "Payment Successful!",
                description: "Your plan has been activated. Redirecting to dashboard...",
              });
              await refreshUser();

              // This page is only used by startups; send them to startup dashboard
              setTimeout(() => {
                navigate("/startup/dashboard");
              }, 500);
            } else {
              toast({
                title: "Payment Verification Failed",
                description: verifyResponse.error || "Please contact support.",
                variant: "destructive",
              });
            }
          } catch (verifyError) {
            console.error("Verification error", verifyError);
            toast({
              title: "Error",
              description: "Payment verification failed.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: "Startup User",
          email: "startup@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", (response: any) => {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
      });
      rzp1.open();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again later.",
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
          One shared feature bundle. Pick the duration and price that fits your hiring cycle.
        </p>
      </div>

      <Card className="max-w-4xl w-full mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Included in all paid plans</CardTitle>
          <CardDescription>
            Every startup plan has the same full access. Only duration and price change.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SHARED_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
        {PLANS.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col relative ${plan.recommended ? 'border-primary shadow-lg scale-105 z-10' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Best Value
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-secondary`}>
                  {plan.icon}
                </div>
                {plan.durationLabel && (
                  <span className="text-xs font-semibold uppercase tracking-wide bg-muted px-2 py-1 rounded-full">
                    {plan.durationLabel}
                  </span>
                )}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.displayName}</CardTitle>
              <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
              <div className="mt-4 space-y-1">
                <div className="text-3xl font-bold">{formatINR(plan.totalPriceINR)}</div>
                {plan.effectiveMonthlyINR && (
                  <p className="text-xs text-muted-foreground">
                    Effective {formatINR(plan.effectiveMonthlyINR)}/month
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Includes the full shared startup feature bundle.
              </p>
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

      <div className="mt-12 text-center text-sm text-muted-foreground space-y-2">
        <p>All paid plans are pre-paid in INR. GST is added at checkout.</p>
        <p>Need a custom hiring pod? Drop us a note at founders@wostup.com.</p>
        <div>
          <Button 
            variant="link" 
            onClick={() => handleSelectPlan("FREE")} 
            disabled={isSubmitting !== null}
            className="mt-2"
          >
            {isSubmitting === "FREE" ? "Processing..." : "Skip for now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
