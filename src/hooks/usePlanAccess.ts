import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { startupProfileService, StartupProfile } from "@/services/startupProfileService";
import { PLAN_FEATURES, FeatureKey, PlanName } from "@/config/planFeatures";

export function usePlanAccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [triggeredFeature, setTriggeredFeature] = useState<string | undefined>();

  const fetchProfile = useCallback(async () => {
    if (user?.role === "startup") {
      try {
        const res = await startupProfileService.getMyProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          
          // Also check if plan is selected
          if (!res.data.subscriptionPlan && window.location.pathname !== "/startup/select-plan") {
            navigate("/startup/select-plan");
          }
        } else if ((res as any).status === 403 || (res as any).error?.includes("profile not found")) {
            // Redirect to profile creation if blocked
            if (window.location.pathname !== "/startup/create-profile") {
              navigate("/startup/create-profile");
            }
        }
      } catch (error) {
        console.error("Error fetching startup profile:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const hasAccess = useCallback((featureKey: FeatureKey): boolean => {
    if (!profile) return false;
    const plan = (profile.subscriptionPlan as PlanName) || "FREE";
    const features = PLAN_FEATURES[plan];
    const value = (features as any)[featureKey];
    return value !== false && value !== 0;
  }, [profile]);

  const getFeatureValue = useCallback((featureKey: FeatureKey) => {
    if (!profile) return null;
    const plan = (profile.subscriptionPlan as PlanName) || "FREE";
    return (PLAN_FEATURES[plan] as any)[featureKey];
  }, [profile]);

  const checkAccessAndShowModal = useCallback((featureKey: FeatureKey, featureDisplayName?: string): boolean => {
    const access = hasAccess(featureKey);
    if (!access) {
      setTriggeredFeature(featureDisplayName || featureKey);
      setIsUpgradeModalOpen(true);
    }
    return access;
  }, [hasAccess]);

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
    setTriggeredFeature(undefined);
  };

  return {
    profile,
    loading,
    plan: (profile?.subscriptionPlan as PlanName) || "FREE",
    hasAccess,
    getFeatureValue,
    checkAccessAndShowModal,
    isUpgradeModalOpen,
    triggeredFeature,
    closeUpgradeModal,
    refreshProfile: fetchProfile
  };
}
