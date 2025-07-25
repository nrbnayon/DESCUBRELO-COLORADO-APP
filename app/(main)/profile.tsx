// app/(main)/profile.tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProfileScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView className='flex-1 bg-surface justify-center items-center'>
      <View>
        <Text className='text-black text-2xl font-bold'>
          {t("Profile Screen")}
        </Text>
        <Text className='text-gray-600 mt-2'>
          {t("This is your user profile page.")}
        </Text>
      </View>
    </SafeAreaView>
  );
}
