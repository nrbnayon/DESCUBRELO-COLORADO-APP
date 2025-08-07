// app/(auth)/language-select.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { AnimatedHeader } from "@/components/shared/AnimatedHeader";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { useTranslation } from "@/hooks/useTranslation";
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
    code: "en",
  },
  {
    id: "2",
    name: "Spanish",
    flag: "🇪🇸",
    code: "es",
  },
];

export default function LanguageSelect() {
  const { changeLanguage, currentLanguage, isTranslating, translateBatch } =
    useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("1");

  useEffect(() => {
    // Set selected language based on current language
    const currentLang = languages.find((lang) => lang.code === currentLanguage);
    if (currentLang) {
      setSelectedLanguage(currentLang.id);
    }
  }, [currentLanguage]);

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
  };

  const onConfirm = async () => {
    try {
      const selected = languages.find((lang) => lang.id === selectedLanguage);
      if (selected) {
        // Change language first
        await changeLanguage(selected.code);

        // Preload common translations for the sign-up page
        const commonTexts = [
          "Create a new account\nwith your email",
          "Full Name",
          "Enter your full name",
          "Email Address",
          "example@gmail.com",
          "Create Password",
          "Enter your password",
          "I agree to the",
          "privacy policy",
          "terms",
          "Sign Up",
          "Creating Account...",
          "Already have an Account?",
          "Sign In",
        ];

        // Batch translate common texts to cache them
        await translateBatch(commonTexts);

        showToast(
          "success",
          "Language Selected",
          `${selected.name} has been set as your preferred language.`
        );

        // Small delay to ensure translations are cached
        setTimeout(() => {
          router.replace("/(auth)/sign-up" as any);
        }, 100);
      }
    } catch (error) {
      console.error("Language selection failed:", error);
      showToast("error", "Selection Failed", "Please try again.");
    }
  };

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  return (
    <SafeAreaView className='flex-1 bg-surface'>
      <AnimatedHeader
        title={`Select your preferred${"\n"}language`}
        titleClassName='text-black text-2xl font-semibold text-center leading-8'
        showBackButton={true}
      />
      <View className='flex-1 px-5' style={{ marginTop: SCREEN_HEIGHT * 0.25 }}>
        {/* Language Options */}
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
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
              <View className='flex-row items-center flex-1'>
                {/* Flag */}
                <View className='w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3'>
                  <Text className='text-lg'>{language.flag}</Text>
                </View>
                {/* Language Name */}
                <TranslatedText
                  className={`text-base font-medium ${
                    selectedLanguage === language.id
                      ? "text-primary-dark"
                      : "text-black"
                  }`}
                >
                  {language.name}
                </TranslatedText>
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
                  <Check size={14} color='white' strokeWidth={3} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Confirm Button */}
        <View className='pb-5'>
          <Button
            onPress={onConfirm}
            loading={isTranslating}
            className='w-full'
            size='md'
            textClassName='!text-black'
            disabled={!selectedLanguage}
          >
            <TranslatedText>Confirm</TranslatedText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
