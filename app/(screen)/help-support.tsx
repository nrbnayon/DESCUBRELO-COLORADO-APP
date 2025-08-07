import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import {
  ChevronLeft,
  Mail,
  Phone,
  Star,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpSupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I download offline maps?",
      answer:
        "Go to Settings > Offline Maps, select your desired region, and tap Download. Make sure you have a stable internet connection and sufficient storage space.",
      category: "maps",
    },
    {
      id: "2",
      question: "How can I change my account information?",
      answer:
        "Go to Settings > Profile Settings to edit your name, email, phone number, and other personal information. Don't forget to save your changes.",
      category: "account",
    },
    {
      id: "3",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express) and digital wallets like Apple Pay and Google Pay.",
      category: "billing",
    },
    {
      id: "5",
      question: "The app is running slowly, what should I do?",
      answer:
        "Try closing other apps, restarting the app, or restarting your device. Make sure you have the latest version installed and sufficient storage space.",
      category: "technical",
    },
  ];

  const supportOptions = [
    {
      id: "email",
      title: "Email Support",
      subtitle: "Get help via email within 24 hours",
      icon: <Mail size={24} color="#4DBA28" />,
      action: () => Linking.openURL("mailto:support@descubrelocolorado.com"),
    },
    {
      id: "phone",
      title: "Phone Support",
      subtitle: "Call us Monday-Friday, 9AM-6PM",
      icon: <Phone size={24} color="#4DBA28" />,
      action: () => Linking.openURL("tel:+1-800-COLORADO"),
    },
  ];

  const quickLinks = [
    {
      id: "rateApp",
      title: "Rate Our App",
      subtitle: "Help us improve with your feedback",
      icon: <Star size={24} color="#4DBA28" />,
      action: () => Alert.alert("Rate App", "Opening app store..."),
    },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

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
          <TranslatedText>Help & Support</TranslatedText>
        </Text>
        <View className="w-8 h-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Contact Support Options */}
        <View className="bg-white mx-5 mt-5 rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-black mb-2">
              <TranslatedText>Contact Support</TranslatedText>
            </Text>
            <Text className="text-sm text-gray-600">
              <TranslatedText>
                Choose how you&apos;d like to get help
              </TranslatedText>
            </Text>
          </View>

          {supportOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              onPress={option.action}
              className={`flex-row items-center p-4 ${
                index !== supportOptions.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 items-center justify-center bg-primary/10 rounded-full">
                {option.icon}
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-medium text-black">
                  <TranslatedText>{option.title}</TranslatedText>
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  <TranslatedText>{option.subtitle}</TranslatedText>
                </Text>
              </View>
              <ExternalLink size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Frequently Asked Questions */}
        <View className="bg-white mx-5 mt-5 rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-black mb-2">
              <TranslatedText>Frequently Asked Questions</TranslatedText>
            </Text>
            <Text className="text-sm text-gray-600">
              <TranslatedText>
                Find quick answers to common questions
              </TranslatedText>
            </Text>
          </View>

          {faqs.map((faq, index) => (
            <View key={faq.id}>
              <TouchableOpacity
                onPress={() => toggleFAQ(faq.id)}
                className={`flex-row items-center justify-between p-4 ${
                  index !== faqs.length - 1 || expandedFAQ === faq.id
                    ? "border-b border-gray-100"
                    : ""
                }`}
                activeOpacity={0.7}
              >
                <Text className="flex-1 text-base font-medium text-black pr-3">
                  <TranslatedText>{faq.question}</TranslatedText>
                </Text>
                {expandedFAQ === faq.id ? (
                  <ChevronUp size={16} color="#4DBA28" />
                ) : (
                  <ChevronDown size={16} color="#6B7280" />
                )}
              </TouchableOpacity>
              {expandedFAQ === faq.id && (
                <View className="px-4 pb-4">
                  <Text className="text-sm text-gray-700 leading-5">
                    <TranslatedText>{faq.answer}</TranslatedText>
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <View className="bg-white mx-5 mt-5 rounded-lg border border-primary-200">
          {quickLinks.map((link, index) => (
            <TouchableOpacity
              key={link.id}
              onPress={link.action}
              className={`flex-row items-center p-4 ${
                index !== quickLinks.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 items-center justify-center bg-primary/10 rounded-full">
                {link.icon}
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-medium text-black">
                  <TranslatedText>{link.title}</TranslatedText>
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  <TranslatedText>{link.subtitle}</TranslatedText>
                </Text>
              </View>
              <ChevronRight size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
