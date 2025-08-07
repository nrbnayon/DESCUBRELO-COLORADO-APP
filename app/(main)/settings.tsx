"use client";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { PremiumModal } from "@/components/ui/PremiumModal";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/store/useAppStore";
import {
  Globe,
  // Moon,
  Bell,
  // Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  Settings as SettingsIcon,
  DollarSign,
  MapPin,
  FileText,
  LockIcon,
} from "lucide-react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function SettingsScreen() {
  const { currentLanguage } = useTranslation();
  const { user, logout, setHasSeenOnboarding } = useAppStore();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const getCurrentLanguageName = () => {
    const languageNames: { [key: string]: string } = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
    };
    return languageNames[currentLanguage] || "English";
  };

  // const handleThemeChange = () => {
  //   const nextTheme =
  //     theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  //   setTheme(nextTheme);
  // };

  const settingsItems = [
    {
      id: "profile",
      title: "Profile Settings",
      subtitle: "Manage your account information",
      icon: <User size={24} color="#4DBA28" />,
      onPress: () => router.push("/(screen)/profile-settings" as any),
    },
    {
      id: "language",
      title: "Language",
      subtitle: getCurrentLanguageName(),
      icon: <Globe size={24} color="#4DBA28" />,
      onPress: () => setShowLanguageSelector(true),
    },
    // {
    //   id: "theme",
    //   title: "Theme",
    //   subtitle:
    //     theme === "dark"
    //       ? "Dark Mode"
    //       : theme === "light"
    //         ? "Light Mode"
    //         : "System",
    //   icon: <Moon size={24} color="#4DBA28" />,
    //   onPress: handleThemeChange,
    // },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Manage notification preferences",
      icon: <Bell size={24} color="#4DBA28" />,
      onPress: () => router.push("/(screen)/notifications"),
    },
    {
      id: "myPlans",
      title: "My Plans",
      subtitle: "Subscription & billing",
      icon: <DollarSign size={24} color="#4DBA28" />,
      onPress: () => setShowPremiumModal(true),
    },
    {
      id: "change-password",
      title: "Change Password",
      subtitle: "Manage your password",
      icon: <LockIcon size={24} color="#4DBA28" />,
      onPress: () => router.push("/(screen)/change-password" as any),
    },
    {
      id: "offlineMap",
      title: "Offline Map",
      subtitle: "Download maps for offline use",
      icon: <MapPin size={24} color="#4DBA28" />,
      onPress: () => router.push("/(screen)/offline-maps" as any),
    },
    // {
    //   id: "privacy",
    //   title: "Privacy & Security",
    //   subtitle: "Control your privacy settings",
    //   icon: <Shield size={24} color="#4DBA28" />,
    //   onPress: () => router.push("/(screen)/privacy-security" as any),
    // },
    {
      id: "terms",
      title: "Terms & Conditions",
      subtitle: "Read our terms and conditions",
      icon: <FileText size={24} color="#4DBA28" />,
      onPress: () => router.push("/(screen)/terms-conditions" as any),
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: <HelpCircle size={24} color="#4DBA28" />,
      onPress: () => router.push("/(screen)/help-support" as any),
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          setHasSeenOnboarding(false);
          router.replace("/");
        },
      },
    ]);
  };

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <StatusBar style="auto" />
      <View className="absolute -top-16 left-0 right-0">
        <ImageBackground
          source={require("@/assets/images/top-cloud.png")}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.35,
          }}
          resizeMode="cover"
        />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-white/40 rounded-full items-center justify-center p-2 border border-[#E6E6E6]"
        >
          <SettingsIcon size={28} color="#4DBA28" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black">
          <TranslatedText>Settings</TranslatedText>
        </Text>
        <View className="w-9 h-9" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Info */}
        {user && (
          <TouchableOpacity
            onPress={() => router.push("/(screen)/profile-settings" as any)}
            className="bg-primary/10 mx-5 mt-5 p-4 rounded-lg border border-gray-200"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center">
                {user?.profilePicture ? (
                  <Image
                    source={{ uri: user.profilePicture }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("@/assets/images/user.png")}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                )}
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-black">
                  {user.name}
                </Text>
                <Text className="text-gray-600">{user.email}</Text>
                <Text className="text-sm text-primary-dark mt-1">
                  <TranslatedText>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </TranslatedText>
                </Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
        )}

        {/* Settings Items */}
        <View className="bg-surface mx-5 mt-5 rounded-lg border border-gray-200 overflow-hidden">
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              className={`flex-row items-center p-4 ${
                index !== settingsItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 items-center justify-center bg-primary-50 rounded-full">
                {item.icon}
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-medium text-black">
                  <TranslatedText>{item.title}</TranslatedText>
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  <TranslatedText>{item.subtitle}</TranslatedText>
                </Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-50 mx-5 mt-5 p-4 rounded-lg border border-red-200 flex-row items-center justify-center"
          activeOpacity={0.7}
        >
          <LogOut size={20} color="#dc2626" />
          <Text className="text-red-600 font-medium ml-2">
            <TranslatedText>Logout</TranslatedText>
          </Text>
        </TouchableOpacity>

        {/* App Info */}
        <View className="items-center py-8">
          <Text className="text-gray-500 text-sm">
            <TranslatedText>DESCUBRELO COLORADO</TranslatedText>
          </Text>
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onLanguageSelect={(language) => {
          console.log("Language selected:", language);
        }}
      />

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={(plan) => {
          console.log("Subscribed to:", plan);
          setShowPremiumModal(false);
        }}
      />
    </SafeAreaView>
  );
}
