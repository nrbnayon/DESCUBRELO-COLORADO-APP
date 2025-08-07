import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import {
  ChevronLeft,
  Shield,
  Eye,
  Lock,
  Globe,
  Bell,
  Smartphone,
  Trash2,
  Download,
  FileText,
  HelpCircle,
  ChevronRight,
} from "lucide-react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

interface PrivacySettings {
  profileVisibility: boolean;
  locationTracking: boolean;
  dataCollection: boolean;
  personalizedAds: boolean;
  emailMarketing: boolean;
  pushNotifications: boolean;
  biometricLogin: boolean;
  twoFactorAuth: boolean;
}

export default function PrivacySecurityScreen() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: true,
    locationTracking: true,
    dataCollection: false,
    personalizedAds: false,
    emailMarketing: true,
    pushNotifications: true,
    biometricLogin: false,
    twoFactorAuth: false,
  });

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  const handleSettingToggle = (setting: keyof PrivacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));

    // In real implementation, save to backend
    console.log(`${setting} toggled to ${!privacySettings[setting]}`);
  };

  const handleDataExport = () => {
    Alert.alert(
      "Export Data",
      "We'll prepare your data export and send it to your email address. This may take up to 24 hours.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Request Export",
          onPress: () => {
            Alert.alert(
              "Success",
              "Data export request submitted successfully"
            );
          },
        },
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      "Delete My Data",
      "This will permanently delete all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Deletion",
              "Are you absolutely sure? This will delete your account and all associated data permanently.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Yes, Delete Everything",
                  style: "destructive",
                  onPress: () => {
                    Alert.alert("Data Deletion", "Feature coming soon");
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const privacyItems = [
    {
      id: "profileVisibility",
      title: "Profile Visibility",
      subtitle: "Control who can see your profile information",
      icon: <Eye size={20} color="#4DBA28" />,
      value: privacySettings.profileVisibility,
      onToggle: () => handleSettingToggle("profileVisibility"),
    },
    {
      id: "locationTracking",
      title: "Location Services",
      subtitle: "Allow app to access your location for better recommendations",
      icon: <Globe size={20} color="#4DBA28" />,
      value: privacySettings.locationTracking,
      onToggle: () => handleSettingToggle("locationTracking"),
    },
    {
      id: "dataCollection",
      title: "Data Collection",
      subtitle: "Allow collection of usage data for app improvement",
      icon: <FileText size={20} color="#4DBA28" />,
      value: privacySettings.dataCollection,
      onToggle: () => handleSettingToggle("dataCollection"),
    },
    {
      id: "personalizedAds",
      title: "Personalized Ads",
      subtitle: "Show ads based on your interests and activity",
      icon: <Bell size={20} color="#4DBA28" />,
      value: privacySettings.personalizedAds,
      onToggle: () => handleSettingToggle("personalizedAds"),
    },
  ];

  const securityItems = [
    {
      id: "biometricLogin",
      title: "Biometric Login",
      subtitle: "Use fingerprint or face recognition to log in",
      icon: <Smartphone size={20} color="#4DBA28" />,
      value: privacySettings.biometricLogin,
      onToggle: () => handleSettingToggle("biometricLogin"),
    },
    {
      id: "twoFactorAuth",
      title: "Two-Factor Authentication",
      subtitle: "Add an extra layer of security to your account",
      icon: <Shield size={20} color="#4DBA28" />,
      value: privacySettings.twoFactorAuth,
      onToggle: () => handleSettingToggle("twoFactorAuth"),
    },
  ];

  const dataManagementItems = [
    {
      id: "exportData",
      title: "Export My Data",
      subtitle: "Download a copy of your data",
      icon: <Download size={20} color="#4DBA28" />,
      onPress: handleDataExport,
    },
    {
      id: "deleteData",
      title: "Delete My Data",
      subtitle: "Permanently delete your account and data",
      icon: <Trash2 size={20} color="#EF4444" />,
      onPress: handleDeleteData,
      isDangerous: true,
    },
  ];

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
          className="w-8 h-8 bg-white/40 rounded-full items-center justify-center p-1 border border-[#E6E6E6]"
        >
          <ChevronLeft size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">
          <TranslatedText>Privacy & Security</TranslatedText>
        </Text>
        <View className="w-8 h-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Privacy Settings */}
        <View className="bg-white mx-5 mt-5 rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center mb-2">
              <Eye size={24} color="#4DBA28" />
              <Text className="text-lg font-semibold text-black ml-3">
                <TranslatedText>Privacy Settings</TranslatedText>
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              <TranslatedText>
                Control what information you share and how it&lsquo;s used
              </TranslatedText>
            </Text>
          </View>

          {privacyItems.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row items-center justify-between p-4 ${
                index !== privacyItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 items-center justify-center bg-primary/10 rounded-full">
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
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: "#E5E7EB", true: "#94E474" }}
                thumbColor={item.value ? "#FFFFFF" : "#F3F4F6"}
              />
            </View>
          ))}
        </View>

        {/* Security Settings */}
        <View className="bg-white mx-5 mt-5 rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center mb-2">
              <Lock size={24} color="#4DBA28" />
              <Text className="text-lg font-semibold text-black ml-3">
                <TranslatedText>Security Settings</TranslatedText>
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              <TranslatedText>
                Protect your account with additional security measures
              </TranslatedText>
            </Text>
          </View>

          {securityItems.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row items-center justify-between p-4 ${
                index !== securityItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 items-center justify-center bg-primary/10 rounded-full">
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
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: "#E5E7EB", true: "#94E474" }}
                thumbColor={item.value ? "#FFFFFF" : "#F3F4F6"}
              />
            </View>
          ))}

          {/* Change Password Option */}
          <TouchableOpacity
            onPress={() => router.push("/(screen)/change-password")}
            className="flex-row items-center p-4"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 items-center justify-center bg-primary/10 rounded-full">
              <Lock size={20} color="#4DBA28" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-medium text-black">
                <TranslatedText>Change Password</TranslatedText>
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                <TranslatedText>Update your account password</TranslatedText>
              </Text>
            </View>
            <ChevronRight size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <View className="bg-white mx-5 mt-5 rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center mb-2">
              <FileText size={24} color="#4DBA28" />
              <Text className="text-lg font-semibold text-black ml-3">
                <TranslatedText>Data Management</TranslatedText>
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              <TranslatedText>
                Manage your personal data and account information
              </TranslatedText>
            </Text>
          </View>

          {dataManagementItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              className={`flex-row items-center p-4 ${
                index !== dataManagementItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
              activeOpacity={0.7}
            >
              <View
                className={`w-10 h-10 items-center justify-center rounded-full ${
                  item.isDangerous ? "bg-red-100" : "bg-primary/10"
                }`}
              >
                {item.icon}
              </View>
              <View className="flex-1 ml-3">
                <Text
                  className={`text-base font-medium ${
                    item.isDangerous ? "text-red-600" : "text-black"
                  }`}
                >
                  <TranslatedText>{item.title}</TranslatedText>
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  <TranslatedText>{item.subtitle}</TranslatedText>
                </Text>
              </View>
              <ChevronRight size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacy Policy & Terms */}
        <View className="bg-white mx-5 mt-5 mb-8 rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center mb-2">
              <HelpCircle size={24} color="#4DBA28" />
              <Text className="text-lg font-semibold text-black ml-3">
                <TranslatedText>Legal Information</TranslatedText>
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              <TranslatedText>
                Read our policies and terms of service
              </TranslatedText>
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert("Privacy Policy", "Opening privacy policy...")
            }
            className="flex-row items-center p-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 items-center justify-center bg-primary/10 rounded-full">
              <FileText size={20} color="#4DBA28" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-medium text-black">
                <TranslatedText>Privacy Policy</TranslatedText>
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                <TranslatedText>
                  How we collect and use your data
                </TranslatedText>
              </Text>
            </View>
            <ChevronRight size={16} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert("Terms of Service", "Opening terms of service...")
            }
            className="flex-row items-center p-4"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 items-center justify-center bg-primary/10 rounded-full">
              <FileText size={20} color="#4DBA28" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-medium text-black">
                <TranslatedText>Terms of Service</TranslatedText>
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                <TranslatedText>
                  Terms and conditions of using our app
                </TranslatedText>
              </Text>
            </View>
            <ChevronRight size={16} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
