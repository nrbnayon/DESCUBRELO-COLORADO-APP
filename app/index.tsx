// app/index.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAppStore } from "@/store/useAppStore";
import { SplashScreen } from "@/components/SplashScreen"; // Adjust path as needed
import { OnboardingCarousel } from "@/components/OnboardingCarousel"; // Adjust path as needed

export default function IndexScreen() {
  const {
    isAuthenticated,
    isLoading,
    hasSeenOnboarding,
    setHasSeenOnboarding,
  } = useAppStore();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Wait for store to rehydrate before making navigation decisions
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // User is authenticated, go directly to main app
        router.replace("/(main)" as any);
      } else {
        // User is not authenticated
        if (!hasSeenOnboarding) {
          // New user - show splash then onboarding
          setShowSplash(true);
        } else {
          // Returning user who has seen onboarding - go to sign in
          router.replace("/(auth)/sign-in");
        }
      }
    }, 100); // Small delay to ensure store is ready

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, hasSeenOnboarding]);

  const handleSplashFinish = () => {
    setShowSplash(false);
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    } else {
      router.replace("/(auth)/sign-in");
    }
  };

  const handleOnboardingFinish = () => {
    setHasSeenOnboarding(true);
    setShowOnboarding(false);
    router.replace("/(auth)/sign-in");
  };

  // Show loading while store is rehydrating
  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 16 }}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Show splash screen for new users
  if (showSplash && !isAuthenticated) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Show onboarding for new users after splash
  if (showOnboarding && !isAuthenticated && !hasSeenOnboarding) {
    return <OnboardingCarousel onFinish={handleOnboardingFinish} />;
  }

  // Default loading state while navigation is happening
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}
