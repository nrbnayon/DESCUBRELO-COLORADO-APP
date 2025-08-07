"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { Send, Bot, User, ChevronLeft, Sparkles } from "lucide-react-native";
import { PremiumModal } from "@/components/ui/PremiumModal";
import { usePremium, PREMIUM_FEATURES } from "@/hooks/usePremium";
import { router } from "expo-router";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const suggestedQuestions = [
  "What are the best hiking trails in Colorado?",
  "Where can I find good restaurants in Denver?",
  "What events are happening this weekend?",
  "Best places to visit in winter?",
];

export default function AskAIScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm your Colorado exploration assistant. Ask me anything about places to visit, activities, restaurants, or events in Colorado!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const premiumHook = usePremium();
  const { canUseFeature, consumeFeature, isPremium, getFeatureUsage } =
    premiumHook;
  const scrollRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const [currentUsage, setCurrentUsage] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load current usage on mount and when refreshTrigger changes
  useEffect(() => {
    const loadUsage = async () => {
      const usage = await getFeatureUsage(PREMIUM_FEATURES.AI_CHAT.id);
      if (usage) {
        // Check if it's a new day
        const today = new Date().toDateString();
        const lastUsedDate = new Date(usage.lastUsed).toDateString();

        if (today === lastUsedDate) {
          setCurrentUsage(usage.usageCount);
        } else {
          setCurrentUsage(0);
        }
      } else {
        setCurrentUsage(0);
      }
    };

    loadUsage();
  }, [getFeatureUsage, refreshTrigger]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  // Handle keyboard events
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      showSubscription.remove();
    };
  }, []);

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("hiking") || lowerQuestion.includes("trail")) {
      return "Colorado offers amazing hiking opportunities! Some top trails include:\n\n• Rocky Mountain National Park - Bear Lake Trail\n• Garden of the Gods - Perkins Central Garden Trail\n• Maroon Bells - Crater Lake Trail\n• Mount Elbert - Colorado's highest peak\n\nWould you like specific details about any of these trails?";
    }

    if (
      lowerQuestion.includes("restaurant") ||
      lowerQuestion.includes("food") ||
      lowerQuestion.includes("eat")
    ) {
      return "Colorado has fantastic dining options! Here are some recommendations:\n\n• Denver: Root Down, Mercantile Dining & Provision\n• Boulder: The Kitchen, Frasca Food and Wine\n• Aspen: The Little Nell, Element 47\n• Colorado Springs: The Rabbit Hole, Four by Brother Luck\n\nWhat type of cuisine are you interested in?";
    }

    if (lowerQuestion.includes("event") || lowerQuestion.includes("weekend")) {
      return "This weekend in Colorado you can enjoy:\n\n• Farmers Markets in various cities\n• Live music at Red Rocks Amphitheatre\n• Art galleries in the RiNo district\n• Outdoor festivals (seasonal)\n• Brewery tours and tastings\n\nWould you like me to find specific events in a particular city?";
    }

    if (lowerQuestion.includes("winter") || lowerQuestion.includes("ski")) {
      return "Colorado winters are perfect for:\n\n• Skiing: Vail, Aspen, Breckenridge, Keystone\n• Snowboarding: Copper Mountain, Winter Park\n• Ice skating in downtown Denver\n• Hot springs: Glenwood Springs, Strawberry Park\n• Winter festivals and holiday markets\n\nWhat winter activities interest you most?";
    }

    return "That's a great question! Colorado has so much to offer. Could you be more specific about what you're looking for? I can help with:\n\n• Outdoor activities and hiking\n• Restaurants and dining\n• Events and entertainment\n• Seasonal activities\n• Local attractions\n\nWhat interests you most?";
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    console.log("Attempting to send message...");
    console.log("Current usage:", currentUsage);
    console.log("Is premium:", isPremium);
    console.log("Can use feature:", canUseFeature(PREMIUM_FEATURES.AI_CHAT.id));

    // Check if user can use the feature BEFORE sending message
    if (!isPremium && !canUseFeature(PREMIUM_FEATURES.AI_CHAT.id)) {
      console.log("Opening premium modal - limit reached");
      setShowPremiumModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Blur the text input to dismiss keyboard
    textInputRef.current?.blur();

    try {
      // Use the feature (increment usage count)
      const featureUsed = await consumeFeature(PREMIUM_FEATURES.AI_CHAT.id);
      if (!featureUsed) {
        console.log("Feature usage failed - showing premium modal");
        setShowPremiumModal(true);
        setIsLoading(false);
        return;
      }

      // Update current usage count
      setCurrentUsage((prev) => prev + 1);
      setRefreshTrigger((prev) => prev + 1);

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateAIResponse(userMessage.text),
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error using feature:", error);
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    console.log("Suggested question clicked");
    console.log("Current usage:", currentUsage);
    console.log("Can use feature:", canUseFeature(PREMIUM_FEATURES.AI_CHAT.id));

    // Check if user can use the feature BEFORE setting the question
    if (!isPremium && !canUseFeature(PREMIUM_FEATURES.AI_CHAT.id)) {
      console.log("Opening premium modal from suggested question");
      setShowPremiumModal(true);
      return;
    }

    setInputText(question);
    // Focus the text input after setting the question
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const handleSubscribe = (plan: "monthly" | "yearly") => {
    console.log("Subscribe to:", plan);
    setShowPremiumModal(false);
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      className={`flex-row mb-4 ${message.isUser ? "justify-end" : "justify-start"}`}
    >
      {!message.isUser && (
        <View className="w-9 h-9 bg-primary rounded-full items-center justify-center mr-3 mt-1">
          <Bot size={20} color="white" />
        </View>
      )}

      <View
        className={`max-w-[80%] p-3 mt-4 ${
          message.isUser
            ? "bg-primary ml-4 rounded-l-lg rounded-br-lg"
            : "bg-gray-100 mr-4 rounded-r-lg rounded-bl-lg"
        }`}
      >
        <Text
          className={`text-base leading-5 ${
            message.isUser ? "text-black" : "text-gray-800"
          }`}
        >
          <TranslatedText>{message.text}</TranslatedText>
        </Text>
      </View>

      {message.isUser && (
        <View className="w-9 h-9 bg-gray-600 rounded-full items-center justify-center ml-3 mt-1">
          <User size={20} color="white" />
        </View>
      )}
    </View>
  );

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  // Check if user can send messages
  const canSendMessage =
    isPremium || currentUsage < PREMIUM_FEATURES.AI_CHAT.maxFreeUsage;

  console.log("Render - Can send message:", canSendMessage);
  console.log("Render - Current usage:", currentUsage);
  console.log(
    "Render - Max free usage:",
    PREMIUM_FEATURES.AI_CHAT.maxFreeUsage
  );

  return (
    <SafeAreaView className="flex-1 bg-surface/90">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="flex-1">
          <View className="absolute -top-16 left-0 right-0">
            <ImageBackground
              source={require("@/assets/images/top-cloud.png")}
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT * 0.3,
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
              <TranslatedText>Ask AI</TranslatedText>
            </Text>
            <View className="w-9 h-9" />
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            className="flex-1 px-5 py-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex flex-col justify-between items-center px-5 mb-5">
              <Text className="text-2xl font-bold text-black">
                <Sparkles size={20} />{" "}
                <TranslatedText>Assistance</TranslatedText>
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                <TranslatedText>
                  Your Colorado exploration assistant
                </TranslatedText>
              </Text>
            </View>

            {messages.map(renderMessage)}

            {isLoading && (
              <View className="flex-row justify-start mb-4">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3 mt-1">
                  <Bot size={16} color="white" />
                </View>
                <View className="bg-gray-100 p-3 rounded-lg">
                  <Text className="text-gray-600">
                    <TranslatedText>Thinking...</TranslatedText>
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <View className="px-5 py-2">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                <TranslatedText>Try asking:</TranslatedText>
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {suggestedQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSuggestedQuestion(question)}
                    className="bg-gray-100 px-4 py-2 rounded-full mr-3"
                  >
                    <Text className="text-gray-700 text-sm">
                      <TranslatedText>{question}</TranslatedText>
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Input Bar */}
          <View className="px-5 py-4 bg-white border-t border-gray-100">
            {!canSendMessage && (
              <View className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Text className="text-orange-700 text-sm text-center">
                  <TranslatedText>
                    {`You've reached your free message limit (${currentUsage}/${PREMIUM_FEATURES.AI_CHAT.maxFreeUsage}). Upgrade to Premium to continue chatting!`}
                  </TranslatedText>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPremiumModal(true)}
                  className="mt-2 bg-orange-600 py-2 px-4 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold">
                    <TranslatedText>Upgrade Now</TranslatedText>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View className="flex-row items-center">
              <TextInput
                ref={textInputRef}
                value={inputText}
                onChangeText={setInputText}
                placeholder={
                  canSendMessage
                    ? "Ask me anything about Colorado..."
                    : "Upgrade to Premium to continue..."
                }
                placeholderTextColor="#9CA3AF"
                className={`flex-1 bg-gray-100 rounded-base px-4 py-3 mr-3 text-base ${
                  !canSendMessage ? "opacity-50" : ""
                }`}
                multiline
                maxLength={500}
                onSubmitEditing={sendMessage}
                editable={canSendMessage}
                returnKeyType="send"
                blurOnSubmit={false}
              />
              <TouchableOpacity
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading || !canSendMessage}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  inputText.trim() && !isLoading && canSendMessage
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
              >
                <Send
                  size={20}
                  color={
                    inputText.trim() && !isLoading && canSendMessage
                      ? "black"
                      : "gray"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Premium Modal */}
        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={handleSubscribe}
          feature="AI Assistant"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
