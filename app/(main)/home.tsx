// app\(main)\home.tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";

export default function HomeScreen() {
  const { logout, setHasSeenOnboarding } = useAppStore();

  const handleLogout = () => {
    // First logout the user (this will clear user data and set isAuthenticated to false)
    logout();

    // Reset onboarding flag for demo purposes
    setHasSeenOnboarding(false);

    // Navigate back to the index screen
    router.replace("/");
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 justify-center items-center px-6'>
        <Text className='text-3xl font-bold text-navy-900 mb-4 text-center'>
          Welcome to{"\n"}Descubrelo Colorado!
        </Text>

        <Text className='text-gray-600 text-center mb-8'>
          You&apos;ve successfully signed in. This is where your main app
          content would go.
        </Text>

        <Button
          variant='outline'
          onPress={handleLogout}
          className='px-8 bg-transparent'
        >
          Logout (Demo)
        </Button>
      </View>
    </SafeAreaView>
  );
}
