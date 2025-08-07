// app/(main)/map.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { PremiumModal } from "@/components/ui/PremiumModal";
import { usePremium, PREMIUM_FEATURES } from "@/hooks/usePremium";
import {
  Navigation,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function MapScreen() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { canUseFeature, consumeFeature, isPremium } = usePremium();

  const handleMapOptionPress = async (route: string) => {
    if (isPremium) {
      router.push(route as any);
      return;
    }
    const canUse = canUseFeature(PREMIUM_FEATURES.NAVIGATION.id);

    if (canUse) {
      const featureUsed = await consumeFeature(PREMIUM_FEATURES.NAVIGATION.id);
      if (featureUsed) {
        router.push(route as any);
      } else {
        setShowPremiumModal(true);
      }
    } else {
      // Cannot use feature, show premium modal
      setShowPremiumModal(true);
    }
  };

  const handleSubscribe = (plan: "monthly" | "yearly") => {
    console.log("Subscribe to:", plan);
    setShowPremiumModal(false);
  };

  const handlePremiumModalClose = () => {
    setShowPremiumModal(false);
  };

  const mapOptions = [
    {
      id: "explore-navigate",
      title: "Explore & Navigate",
      subtitle: "Interactive map with navigation",
      icon: Navigation,
      color: "#4DBA28",
      route: "/explore-navigate",
      onPress: () => handleMapOptionPress("/explore-navigate"),
    },
    {
      id: "offline-map",
      title: "Offline Map",
      subtitle: "Download maps for offline use",
      icon: MapPin,
      color: "#4DBA28",
      route: "/offline-maps",
      onPress: () => handleMapOptionPress("/offline-maps"),
    },
  ];

  const renderMapOption = (option: (typeof mapOptions)[0]) => {
    const IconComponent = option.icon;

    return (
      <TouchableOpacity
        key={option.id}
        onPress={option.onPress}
        className="bg-primary-100 rounded-base p-4 mb-5 flex-row items-center justify-between"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 14.8,
              elevation: 8,
            }}
          >
            <IconComponent size={24} color={option.color} />
          </View>

          <View className="flex-1">
            <Text className="text-lg font-semibold text-black mb-1">
              <TranslatedText>{option.title}</TranslatedText>
            </Text>
            <Text className="text-gray-600 text-sm">
              <TranslatedText>{option.subtitle}</TranslatedText>
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1 bg-white">
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
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black">
          <TranslatedText>Map & Navigate</TranslatedText>
        </Text>
        <View className="w-9 h-9" />
      </View>

      <View className="flex-1 px-5 mt-5">
        {/* Map Options */}
        <View>{mapOptions.map(renderMapOption)}</View>

        {/* Info Text */}
        <View className="mt-5 p-4 bg-blue-50 rounded-base">
          <Text className="text-blue-800 text-sm text-center">
            <TranslatedText>
              Access detailed maps and navigation features to explore
              Colorado&apos;s best destinations using our unified location
              database with all attractions, national parks, and points of
              interest.
            </TranslatedText>
          </Text>
        </View>
      </View>

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={handlePremiumModalClose}
        onSubscribe={handleSubscribe}
        feature="Navigation & Maps"
      />
    </SafeAreaView>
  );
}
