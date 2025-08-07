// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
import Toast from "react-native-toast-message";
import { useNotificationPermissions } from "@/hooks/useNotificationPermissions";
import { useAppStore } from "@/store/useAppStore";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      // cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();
  const { requestPermission } = useNotificationPermissions();
  const { isAuthenticated } = useAppStore();
  const hasRequestedPermission = useRef(false);

  const [loaded] = useFonts({
    "Poppins-Thin": require("../assets/fonts/poppins/Poppins-Thin.ttf"),
    "Poppins-Regular": require("../assets/fonts/poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/poppins/Poppins-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      // Request notification permission only once per app session when user becomes authenticated
      if (isAuthenticated && !hasRequestedPermission.current) {
        hasRequestedPermission.current = true;
        setTimeout(() => {
          requestPermission();
        }, 2000);
      }
    }
  }, [loaded, isAuthenticated, requestPermission]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style='auto' />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='(auth)' />
            <Stack.Screen name='(main)' />
            <Stack.Screen name='(screen)' />
          </Stack>
          <Toast />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
