"use client";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Mock data structure - replace with actual API call
interface TermsSection {
  id: string;
  title: string;
  content: string;
  isMarkdown: boolean;
  order: number;
}

interface TermsData {
  id: string;
  title: string;
  lastUpdated: string;
  effectiveDate: string;
  version: string;
  sections: TermsSection[];
}

// Mock API function - replace with your actual API call
const fetchTermsAndConditions = async (): Promise<TermsData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: "terms-v1",
    title: "Terms and Conditions",
    lastUpdated: "2024-12-15",
    effectiveDate: "2024-01-01",
    version: "1.2.0",
    sections: [
      {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: `By downloading, installing, or using the **DESCUBRELO COLORADO** mobile application ("App"), you agree to be bound by these Terms and Conditions ("Terms"). 

If you do not agree to these Terms, please do not use our App.

### Important Notes:
- These terms constitute a legally binding agreement
- By using our service, you accept all terms without modification
- We recommend reading these terms carefully`,
        isMarkdown: true,
        order: 1,
      },
      {
        id: "description",
        title: "2. Description of Service",
        content:
          "DESCUBRELO COLORADO is a mobile application designed to help users discover and explore attractions, activities, and points of interest in Colorado. The App provides location-based services, travel recommendations, offline maps, and related tourism information.",
        isMarkdown: false,
        order: 2,
      },
      {
        id: "user-accounts",
        title: "3. User Accounts and Registration",
        content: `### Account Creation
To access certain features of the App, you may be required to create a user account. You agree to:

- Provide **accurate and complete** information during registration
- Maintain the security of your account credentials
- Notify us immediately of any unauthorized use of your account
- Accept responsibility for all activities under your account

### Account Security
- You are responsible for maintaining the confidentiality of your login credentials
- We are not liable for any loss resulting from unauthorized use of your account
- We reserve the right to suspend or terminate accounts that violate these terms`,
        isMarkdown: true,
        order: 3,
      },
      {
        id: "user-conduct",
        title: "4. User Conduct and Prohibited Uses",
        content:
          "You agree not to use the App for any unlawful purpose or in any way that could damage, disable, overburden, or impair our services. Prohibited activities include but are not limited to: posting false or misleading information, attempting to gain unauthorized access to our systems, using the App to harass or harm others, uploading viruses or malicious code, and violating any applicable laws or regulations.",
        isMarkdown: false,
        order: 4,
      },
      {
        id: "privacy",
        title: "5. Privacy and Data Collection",
        content: `### Information We Collect
We collect and process personal information as described in our Privacy Policy, including:

- **Account Information**: Name, email address, profile picture
- **Location Data**: GPS coordinates for location-based services
- **Usage Data**: App interactions, preferences, and analytics
- **Device Information**: Device type, operating system, unique identifiers

### How We Use Your Data
- Provide and improve our services
- Personalize your experience
- Send important notifications
- Comply with legal obligations

For detailed information about our data practices, please review our **Privacy Policy**.`,
        isMarkdown: true,
        order: 5,
      },
      {
        id: "intellectual-property",
        title: "6. Intellectual Property Rights",
        content:
          "All content, features, and functionality of the App, including but not limited to text, graphics, logos, images, and software, are owned by DESCUBRELO COLORADO or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.",
        isMarkdown: false,
        order: 6,
      },
      {
        id: "disclaimers",
        title: "7. Disclaimers and Limitations",
        content: `### Service Availability
- The App is provided on an **"as is"** and **"as available"** basis
- We do not guarantee uninterrupted or error-free service
- Features may be modified or discontinued without notice

### Location Accuracy
- Location-based services may not always be accurate
- We are not responsible for decisions made based on location data
- Users should exercise caution when relying on navigation features

### Third-Party Content
- The App may contain links to third-party websites or services
- We are not responsible for third-party content or practices
- Use of third-party services is at your own risk`,
        isMarkdown: true,
        order: 7,
      },
      {
        id: "termination",
        title: "8. Termination",
        content:
          "Either party may terminate this agreement at any time. We reserve the right to suspend or terminate your access to the App immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason in our sole discretion.",
        isMarkdown: false,
        order: 8,
      },
      {
        id: "changes",
        title: "9. Changes to Terms",
        content: `### Updates and Modifications
We reserve the right to modify these Terms at any time. Changes will be effective when:

- Posted within the App
- Sent via email notification (if applicable)
- Published on our website

### Your Continued Use
Continued use of the App after changes constitutes acceptance of the modified Terms.

**We encourage you to review these Terms periodically for updates.**`,
        isMarkdown: true,
        order: 9,
      },
      {
        id: "contact",
        title: "10. Contact Information",
        content:
          "If you have any questions about these Terms and Conditions, please contact us at: support@descubrelocolorado.com or visit our support page within the App for additional assistance.",
        isMarkdown: false,
        order: 10,
      },
    ],
  };
};

// Custom markdown parser for basic formatting
const parseMarkdown = (text: string) => {
  const lines = text.split("\n");
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "") {
      // Empty line - add spacing
      elements.push(<View key={key++} style={{ height: 8 }} />);
      continue;
    }

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <Text
          key={key++}
          className="text-lg font-semibold text-gray-900 mt-4 mb-2"
        >
          {line.substring(4)}
        </Text>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <Text key={key++} className="text-xl font-bold text-gray-900 mt-6 mb-3">
          {line.substring(3)}
        </Text>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <Text
          key={key++}
          className="text-2xl font-bold text-gray-900 mt-6 mb-4"
        >
          {line.substring(2)}
        </Text>
      );
      continue;
    }

    // List items
    if (line.startsWith("- ")) {
      const listText = line.substring(2);
      elements.push(
        <View key={key++} className="flex-row mb-1">
          <Text className="text-gray-700 mr-2">•</Text>
          <Text className="text-base text-gray-700 flex-1">
            {parseInlineFormatting(listText)}
          </Text>
        </View>
      );
      continue;
    }

    // Regular paragraphs
    elements.push(
      <Text key={key++} className="text-base leading-6 text-gray-700 mb-3">
        {parseInlineFormatting(line)}
      </Text>
    );
  }

  return elements;
};

// Parse inline formatting like **bold** and *italic*
const parseInlineFormatting = (text: string) => {
  const parts = [];
  let currentIndex = 0;
  let key = 0;

  // Simple regex to find **bold** text
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > currentIndex) {
      parts.push(
        <Text key={key++}>{text.substring(currentIndex, match.index)}</Text>
      );
    }

    // Add the bold text
    parts.push(
      <Text key={key++} className="font-semibold text-gray-900">
        {match[1]}
      </Text>
    );

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(<Text key={key++}>{text.substring(currentIndex)}</Text>);
  }

  return parts.length > 0 ? parts : text;
};

export default function TermsConditionScreen() {
  const [termsData, setTermsData] = useState<TermsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  useEffect(() => {
    loadTermsAndConditions();
  }, []);

  const loadTermsAndConditions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTermsAndConditions();
      setTermsData(data);
    } catch (err) {
      setError("Failed to load terms and conditions. Please try again.");
      console.error("Error loading terms:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderContent = (content: string, isMarkdown: boolean) => {
    if (isMarkdown) {
      return <View className="mb-2">{parseMarkdown(content)}</View>;
    } else {
      return (
        <Text className="text-base leading-6 text-gray-700 mb-4">
          {content}
        </Text>
      );
    }
  };

  if (loading) {
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
            <ArrowLeft size={20} color="#4DBA28" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">
            <TranslatedText>Terms & Conditions</TranslatedText>
          </Text>
          <View className="w-10 h-10" />
        </View>

        {/* Loading State */}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4DBA28" />
          <Text className="text-gray-600 mt-4">
            <TranslatedText>Loading terms and conditions...</TranslatedText>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !termsData) {
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
            <ArrowLeft size={20} color="#4DBA28" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">
            <TranslatedText>Terms & Conditions</TranslatedText>
          </Text>
          <View className="w-10 h-10" />
        </View>

        {/* Error State */}
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-red-600 text-center mb-4 text-lg">
            <TranslatedText>{error || "Failed to load content"}</TranslatedText>
          </Text>
          <TouchableOpacity
            onPress={loadTermsAndConditions}
            className="bg-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">
              <TranslatedText>Try Again</TranslatedText>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <ArrowLeft size={20} color="#4DBA28" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">
          <TranslatedText>{termsData.title}</TranslatedText>
        </Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Document Info */}
        <View className="bg-primary/5 rounded-lg p-4 mb-6 border border-primary/20">
          <Text className="text-lg font-semibold text-primary-dark mb-2">
            <TranslatedText>Document Information</TranslatedText>
          </Text>
          <View className="space-y-1">
            <Text className="text-sm text-gray-600">
              <TranslatedText>Version:</TranslatedText> {termsData.version}
            </Text>
            <Text className="text-sm text-gray-600">
              <TranslatedText>Effective Date:</TranslatedText>{" "}
              {formatDate(termsData.effectiveDate)}
            </Text>
            <Text className="text-sm text-gray-600">
              <TranslatedText>Last Updated:</TranslatedText>{" "}
              {formatDate(termsData.lastUpdated)}
            </Text>
          </View>
        </View>

        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            <TranslatedText>Welcome to DESCUBRELO COLORADO</TranslatedText>
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            <TranslatedText>
              Please read these terms and conditions carefully before using our
              application. These terms govern your use of our services and
              establish the legal agreement between you and us.
            </TranslatedText>
          </Text>
        </View>

        {/* Terms Sections */}
        <View className="mb-8" style={{ gap: 8 }}>
          {termsData.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <View
                key={section.id}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <Text className="text-lg font-semibold text-gray-900 mb-3">
                  <TranslatedText>{section.title}</TranslatedText>
                </Text>
                {renderContent(section.content, section.isMarkdown)}
              </View>
            ))}
        </View>

        {/* Footer */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-center text-sm text-gray-600">
            <TranslatedText>
              By continuing to use DESCUBRELO COLORADO, you acknowledge that you
              have read, understood, and agree to be bound by these Terms and
              Conditions.
            </TranslatedText>
          </Text>
        </View>

        {/* Last Updated Notice */}
        <View className="items-center pb-8">
          <Text className="text-xs text-gray-500">
            <TranslatedText>This document was last updated on</TranslatedText>{" "}
            {formatDate(termsData.lastUpdated)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
