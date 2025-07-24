import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAppStore } from "@/store/useAppStore";

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(main)/home" as any);
      } else {
        router.replace("/(auth)/sign-in");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <ThemedView className="flex-1 justify-center items-center bg-primary">
      <ThemedText type="title" className="text-white mb-4">
        Descúbrelo Colorado
      </ThemedText>
      <ActivityIndicator size="large" color="#ffffff" />
      <ThemedText className="text-white mt-4">
        {isLoading ? "Loading..." : "Welcome"}
      </ThemedText>
    </ThemedView>
  );
}
