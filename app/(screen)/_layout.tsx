// app\(screen)\_layout.tsx
import { Stack } from "expo-router";

export default function ScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="explore-navigate" options={{ headerShown: false }} />
      <Stack.Screen name="offline-maps" options={{ headerShown: false }} />
      <Stack.Screen name="help-support" options={{ headerShown: false }} />
      <Stack.Screen name="profile-settings" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
      <Stack.Screen name="terms-conditions" options={{ headerShown: false }} />
      <Stack.Screen name="privacy-security" options={{ headerShown: false }} />
    </Stack>
  );
}
