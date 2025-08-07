// app\index.tsx
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { SplashScreen } from "@/components/SplashScreen";
import { OnboardingCarousel } from "@/components/OnboardingCarousel";
import { WelcomeScreen } from "@/components/WelcomeScreen";

type AppState = "splash" | "onboarding" | "welcome" | "authenticated";

export default function IndexScreen() {
  const { isAuthenticated, hasSeenOnboarding, setHasSeenOnboarding } =
    useAppStore();
  const [appState, setAppState] = useState<AppState>("splash");

  useEffect(() => {
    // Determine initial state based on user status
    if (isAuthenticated) {
      setAppState("authenticated");
    } else if (hasSeenOnboarding) {
      setAppState("welcome");
    } else {
      setAppState("splash");
    }
  }, [isAuthenticated, hasSeenOnboarding]);

  useEffect(() => {
    if (appState === "authenticated") {
      router.replace("/(main)/home" as any);
    }
  }, [appState]);

  const handleSplashFinish = () => {
    setAppState("onboarding");
  };

  const handleOnboardingFinish = () => {
    setHasSeenOnboarding(true);
    setAppState("welcome");
  };

  const handleCreateAccount = () => {
    router.push("/(auth)/language-select" as any);
  };

  const handleLogin = () => {
    router.push("/(auth)/sign-in" as any);
  };

  if (appState === "splash") {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (appState === "onboarding") {
    return <OnboardingCarousel onFinish={handleOnboardingFinish} />;
  }

  if (appState === "welcome") {
    return (
      <WelcomeScreen
        onCreateAccount={handleCreateAccount}
        onLogin={handleLogin}
      />
    );
  }

  return null;
}