// app/(auth)/language-select.tsx
import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { AnimatedHeader } from "@/components/shared/AnimatedHeader";
import { showToast } from "@/utils/toast";
import { Check } from "lucide-react-native";

interface Language {
  id: string;
  name: string;
  flag: string;
  code: string;
}

const languages: Language[] = [
  {
    id: "1",
    name: "English United State",
    flag: "🇺🇸",
    code: "en-US",
  },
  {
    id: "2",
    name: "Spanish",
    flag: "🇪🇸",
    code: "es",
  },
];

export default function LanguageSelect() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("1"); 

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
  };

  const onConfirm = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const selected = languages.find((lang) => lang.id === selectedLanguage);

      if (selected) {
        // Store selected language in your app store or AsyncStorage
        // You might want to add a setLanguage method to your store
        console.log("Selected language:", selected);

        showToast(
          "success",
          "Language Selected",
          `${selected.name} has been set as your preferred language.`
        );
        // Navigate to next screen (could be onboarding or main app)
        router.replace("/(auth)/sign-up" as any);
      }
    } catch (error) {
      console.error("Language selection failed:", error);
      showToast("error", "Selection Failed", "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <AnimatedHeader
        title={`Select your preferred${"\n"}language`}
        titleClassName="text-black text-2xl font-semibold text-center leading-8"
        showBackButton={true}
      />

      <View className="flex-1 px-5" style={{ marginTop: SCREEN_HEIGHT * 0.25 }}>
        {/* Language Options */}
        <View className="flex-1">
          {languages.map((language) => (
            <TouchableOpacity
              key={language.id}
              onPress={() => handleLanguageSelect(language.id)}
              className={`flex-row items-center justify-between p-4 mb-7 rounded-base border-2 ${
                selectedLanguage === language.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white"
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                {/* Flag */}
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
                  <Text className="text-lg">{language.flag}</Text>
                </View>

                {/* Language Name */}
                <Text
                  className={`text-base font-medium ${
                    selectedLanguage === language.id
                      ? "text-primary-dark"
                      : "text-black"
                  }`}
                >
                  {language.name}
                </Text>
              </View>

              {/* Selection Indicator */}
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  selectedLanguage === language.id
                    ? "border-primary bg-primary"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {selectedLanguage === language.id && (
                  <Check size={14} color="white" strokeWidth={3} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm Button */}
        <View className="pb-5">
          <Button
            onPress={onConfirm}
            loading={isLoading}
            className="w-full"
            size="md"
            textClassName="!text-black"
            disabled={!selectedLanguage}
          >
            Confirm
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
