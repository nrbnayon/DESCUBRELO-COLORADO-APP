// app\(screen)\privacy-policy.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3">{title}</Text>
      <Text className="text-gray-600 leading-6">{children}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center p-5 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-medium">
            Privacy Policy
          </Text>
        </View>

        <View className="px-5 py-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Privacy Policy
          </Text>
          <Text className="text-gray-500 mb-8">Last updated: January 2025</Text>

          <Section title="1. Information We Collect">
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support. This
            may include your name, email address, phone number, payment
            information, and investment preferences.
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
