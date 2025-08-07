import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PremiumFeature {
  id: string;
  name: string;
  usageCount: number;
  maxFreeUsage: number;
  lastUsed: string;
}

interface UsePremiumReturn {
  isPremium: boolean;
  canUseFeature: (featureId: string) => boolean;
  consumeFeature: (featureId: string) => Promise<boolean>;
  getFeatureUsage: (featureId: string) => Promise<PremiumFeature | null>;
  resetFeatureUsage: (featureId: string) => Promise<void>;
  subscriptionStatus: "free" | "trial" | "premium";
  trialDaysLeft: number;
}

const PREMIUM_FEATURES = {
  AI_CHAT: { id: "ai_chat", name: "AI Chat", maxFreeUsage: 5 },
  OFFLINE_MAPS: { id: "offline_maps", name: "Offline Maps", maxFreeUsage: 3 },
  NAVIGATION: { id: "navigation", name: "Navigation", maxFreeUsage: 5 },
};

const STORAGE_KEYS = {
  PREMIUM_STATUS: "premium_status",
  FEATURE_USAGE: "feature_usage",
  TRIAL_START: "trial_start_date",
  SUBSCRIPTION_TYPE: "subscription_type",
};

export const usePremium = (): UsePremiumReturn => {
  const { user } = useAppStore();
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "free" | "trial" | "premium"
  >("free");
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [featureUsage, setFeatureUsage] = useState<
    Record<string, PremiumFeature>
  >({});

  const loadPremiumStatus = useCallback(async () => {
    try {
      const trialStart = await AsyncStorage.getItem(STORAGE_KEYS.TRIAL_START);
      const subscriptionType = await AsyncStorage.getItem(
        STORAGE_KEYS.SUBSCRIPTION_TYPE
      );

      if (subscriptionType === "premium") {
        setIsPremium(true);
        setSubscriptionStatus("premium");
      } else if (trialStart) {
        const trialStartDate = new Date(trialStart);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysLeft = Math.max(0, 7 - daysDiff);

        if (daysLeft > 0) {
          setIsPremium(true);
          setSubscriptionStatus("trial");
          setTrialDaysLeft(daysLeft);
        } else {
          setIsPremium(true);
          setSubscriptionStatus("free");
          setTrialDaysLeft(0);
        }
      } else {
        // First time user - start trial
        const now = new Date().toISOString();
        await AsyncStorage.setItem(STORAGE_KEYS.TRIAL_START, now);
        setIsPremium(true);
        setSubscriptionStatus("trial");
        setTrialDaysLeft(7);
      }
    } catch (error) {
      console.error("Error loading premium status:", error);
      setIsPremium(false);
      setSubscriptionStatus("free");
    }
  }, []);

  const loadFeatureUsage = useCallback(async () => {
    try {
      const usage = await AsyncStorage.getItem(STORAGE_KEYS.FEATURE_USAGE);
      if (usage) {
        const parsedUsage = JSON.parse(usage);
        setFeatureUsage(parsedUsage);
        console.log("Loaded feature usage:", parsedUsage);
      } else {
        console.log("No stored feature usage found");
      }
    } catch (error) {
      console.error("Error loading feature usage:", error);
    }
  }, []);

  const saveFeatureUsage = useCallback(
    async (usage: Record<string, PremiumFeature>) => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.FEATURE_USAGE,
          JSON.stringify(usage)
        );
        setFeatureUsage(usage);
        console.log("Saved feature usage:", usage);
      } catch (error) {
        console.error("Error saving feature usage:", error);
      }
    },
    []
  );

  useEffect(() => {
    loadPremiumStatus();
    loadFeatureUsage();
  }, [user, loadPremiumStatus, loadFeatureUsage]);

  const canUseFeature = useCallback(
    (featureId: string): boolean => {
      console.log("canUseFeature called for:", featureId);
      console.log("isPremium:", isPremium);

      if (isPremium) {
        console.log("User is premium, can use feature");
        return true;
      }

      const feature = Object.values(PREMIUM_FEATURES).find(
        (f) => f.id === featureId
      );
      if (!feature) {
        console.log("Feature not found:", featureId);
        return false;
      }

      const usage = featureUsage[featureId];
      console.log("Current feature usage:", usage);

      if (!usage) {
        console.log("No usage record found, can use feature");
        return true;
      }

      // Check if it's a new day
      const today = new Date().toDateString();
      const lastUsedDate = new Date(usage.lastUsed).toDateString();
      console.log("Today:", today);
      console.log("Last used:", lastUsedDate);

      if (today !== lastUsedDate) {
        console.log("New day, resetting usage count");
        return true;
      }

      const canUse = usage.usageCount < feature.maxFreeUsage;
      console.log(
        `Usage: ${usage.usageCount}/${feature.maxFreeUsage}, can use: ${canUse}`
      );
      return canUse;
    },
    [isPremium, featureUsage]
  );

  const consumeFeature = useCallback(
    async (featureId: string): Promise<boolean> => {
      console.log("useFeature called for:", featureId);

      if (isPremium) {
        console.log("User is premium, feature used successfully");
        return true;
      }

      const feature = Object.values(PREMIUM_FEATURES).find(
        (f) => f.id === featureId
      );
      if (!feature) {
        console.log("Feature not found:", featureId);
        return false;
      }

      const today = new Date().toISOString();
      const todayString = new Date().toDateString();

      let currentUsage = featureUsage[featureId];
      console.log("Current usage before increment:", currentUsage);

      if (!currentUsage) {
        currentUsage = {
          id: featureId,
          name: feature.name,
          usageCount: 0,
          maxFreeUsage: feature.maxFreeUsage,
          lastUsed: today,
        };
        console.log("Created new usage record:", currentUsage);
      }

      // Check if it's a new day and reset if needed
      const lastUsedDate = new Date(currentUsage.lastUsed).toDateString();
      if (todayString !== lastUsedDate) {
        console.log("New day detected, resetting usage count");
        currentUsage.usageCount = 0;
      }

      // Check if user has exceeded limit
      if (currentUsage.usageCount >= feature.maxFreeUsage) {
        console.log(
          `Usage limit exceeded: ${currentUsage.usageCount}/${feature.maxFreeUsage}`
        );
        return false;
      }

      // Increment usage count
      currentUsage.usageCount += 1;
      currentUsage.lastUsed = today;
      console.log("Updated usage:", currentUsage);

      const updatedUsage = {
        ...featureUsage,
        [featureId]: currentUsage,
      };

      await saveFeatureUsage(updatedUsage);
      console.log(
        "Feature used successfully, new count:",
        currentUsage.usageCount
      );
      return true;
    },
    [isPremium, featureUsage, saveFeatureUsage]
  );

  const getFeatureUsage = useCallback(
    async (featureId: string): Promise<PremiumFeature | null> => {
      const usage = featureUsage[featureId];
      console.log("getFeatureUsage for", featureId, ":", usage);
      return usage || null;
    },
    [featureUsage]
  );

  const resetFeatureUsage = useCallback(
    async (featureId: string): Promise<void> => {
      const updatedUsage = { ...featureUsage };
      delete updatedUsage[featureId];
      await saveFeatureUsage(updatedUsage);
    },
    [featureUsage, saveFeatureUsage]
  );

  return {
    isPremium,
    canUseFeature,
    consumeFeature,
    getFeatureUsage,
    resetFeatureUsage,
    subscriptionStatus,
    trialDaysLeft,
  };
};

export { PREMIUM_FEATURES };
