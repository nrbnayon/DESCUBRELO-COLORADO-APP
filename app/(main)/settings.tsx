"use client";

import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/store/useAppStore";
import {
  Globe,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  Settings as SettingsIcon,
} from "lucide-react-native";
import { router } from "expo-router";

export default function SettingsScreen() {
  const { currentLanguage } = useTranslation();
  const { user, logout, setHasSeenOnboarding, theme, setTheme } = useAppStore();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

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

  const settingsItems = [
    {
      id: "profile",
      title: "Profile Settings",
      subtitle: "Manage your account information",
      icon: <User size={24} color="#4DBA28" />,
      onPress: () => console.log("Profile settings"),
    },
    {
      id: "language",
      title: "Language",
      subtitle: getCurrentLanguageName(),
      icon: <Globe size={24} color="#4DBA28" />,
      onPress: () => setShowLanguageSelector(true),
    },
    {
      id: "theme",
      title: "Theme",
      subtitle:
        theme === "dark"
          ? "Dark Mode"
          : theme === "light"
            ? "Light Mode"
            : "System",
      icon: <Moon size={24} color="#4DBA28" />,
      onPress: () => {
        const nextTheme =
          theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
        setTheme(nextTheme);
      },
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Manage notification preferences",
      icon: <Bell size={24} color="#4DBA28" />,
      onPress: () => console.log("Notifications"),
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      subtitle: "Control your privacy settings",
      icon: <Shield size={24} color="#4DBA28" />,
      onPress: () => console.log("Privacy"),
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: <HelpCircle size={24} color="#4DBA28" />,
      onPress: () => console.log("Help"),
    },
  ];

  const handleLogout = () => {
     logout();
     setHasSeenOnboarding(false);
     router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <SettingsIcon size={28} color="#4DBA28" />
          <Text className="text-2xl font-bold text-black ml-3">
            <TranslatedText>Settings</TranslatedText>
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Info */}
        {user && (
          <View className="bg-white mx-5 mt-5 p-4 rounded-lg border border-gray-200">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center">
                <User size={32} color="#4DBA28" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-black">
                  {user.name}
                </Text>
                <Text className="text-gray-600 mt-1">{user.email}</Text>
                <Text className="text-sm text-primary-dark mt-1">
                  <TranslatedText>
                    {user.isVerified
                      ? "Verified Account"
                      : "Unverified Account"}
                  </TranslatedText>
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Settings Items */}
        <View className="bg-white mx-5 mt-5 rounded-lg border border-gray-200 overflow-hidden">
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
              <View className="w-10 h-10 items-center justify-center">
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
          <Text className="text-gray-400 text-xs mt-1">
            <TranslatedText>Version 1.0.0</TranslatedText>
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
    </SafeAreaView>
  );
}
