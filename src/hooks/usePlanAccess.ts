import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { startupProfileService, StartupProfile } from "@/services/startupProfileService";
import { PLAN_FEATURES, FeatureKey, PlanName, normalizePlanName } from "@/config/planFeatures";

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
          
          // Note: All profiles default to "FREE" plan, so we don't need to redirect if plan is missing
          // The plan selection is now more of a choice than a requirement for dashboard access
        } else {
            const status = (res as any).status;
            const errorMsg = typeof (res as any).error === "string" ? (res as any).error.toLowerCase() : "";
            const isMissingProfile = status === 404 || errorMsg.includes("profile not found");

            if (isMissingProfile && window.location.pathname !== "/startup/create-profile") {
              navigate("/startup/create-profile");
            } else if (!isMissingProfile) {
              console.warn("usePlanAccess: profile fetch failed but will not redirect", res);
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
    const plan = normalizePlanName(profile.subscriptionPlan);
    const features = PLAN_FEATURES[plan];
    const value = (features as any)[featureKey];
    return value !== false && value !== 0;
  }, [profile]);

  const getFeatureValue = useCallback((featureKey: FeatureKey) => {
    if (!profile) return null;
    const plan = normalizePlanName(profile.subscriptionPlan);
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
    plan: normalizePlanName(profile?.subscriptionPlan),
    hasAccess,
    getFeatureValue,
    checkAccessAndShowModal,
    isUpgradeModalOpen,
    triggeredFeature,
    closeUpgradeModal,
    refreshProfile: fetchProfile
  };
}
