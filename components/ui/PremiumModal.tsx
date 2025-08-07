// components\ui\PremiumModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Check, CreditCard, Lock } from "lucide-react-native";
import { TranslatedText } from "./TranslatedText";
import { Button } from "./Button";
import { shadows } from "@/utils/shadows";

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (plan: "monthly" | "yearly") => void;
  feature?: string;
}

interface CardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  holderName: string;
  email: string;
}

export function PremiumModal({
  visible,
  onClose,
  onSubscribe,
  feature = "premium features",
}: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const [freeTrialEnabled, setFreeTrialEnabled] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    holderName: "",
    email: "",
  });

  const features = [
    "Offline Map Access",
    "AI Assistant Guide",
    "Seamless experience",
  ];

  // Card shadow style for selected plans
  const selectedCardShadow = {
    ...shadows.md,
    shadowColor: "#113A01",
    shadowOpacity: 0.13,
    elevation: 4,
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const match = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
    if (!match) return text;

    return [match[1], match[2], match[3], match[4]]
      .filter(Boolean)
      .join(" ")
      .trim();
  };

  const formatExpiry = (text: string, field: "month" | "year") => {
    const cleaned = text.replace(/\D/g, "");
    if (field === "month") {
      return cleaned.slice(0, 2);
    }
    return cleaned.slice(0, 2);
  };

  const validateCard = (): boolean => {
    const { number, expiryMonth, expiryYear, cvc, holderName, email } =
      cardDetails;

    if (!number || number.replace(/\s/g, "").length < 13) {
      Alert.alert("Invalid Card", "Please enter a valid card number");
      return false;
    }

    if (!expiryMonth || !expiryYear) {
      Alert.alert("Invalid Expiry", "Please enter card expiry date");
      return false;
    }

    const month = parseInt(expiryMonth);
    const year = parseInt(`20${expiryYear}`);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      Alert.alert("Invalid Month", "Please enter a valid month (01-12)");
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      Alert.alert("Expired Card", "Card has expired");
      return false;
    }

    if (!cvc || cvc.length < 3) {
      Alert.alert("Invalid CVC", "Please enter a valid CVC");
      return false;
    }

    if (!holderName.trim()) {
      Alert.alert("Missing Name", "Please enter cardholder name");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const processStripePayment = async (): Promise<boolean> => {
    try {
      setIsProcessing(true);

      // Simulate Stripe payment processing
      // In real implementation, you would:
      // 1. Create payment method with Stripe
      // 2. Create subscription with trial period
      // 3. Handle payment confirmation

      const paymentData = {
        card: {
          number: cardDetails.number.replace(/\s/g, ""),
          exp_month: parseInt(cardDetails.expiryMonth),
          exp_year: parseInt(`20${cardDetails.expiryYear}`),
          cvc: cardDetails.cvc,
        },
        billing_details: {
          name: cardDetails.holderName,
          email: cardDetails.email,
        },
        subscription: {
          plan: selectedPlan,
          trial_period_days: freeTrialEnabled ? 7 : 0,
          amount: selectedPlan === "yearly" ? 6999 : 599, // in cents
        },
      };

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful payment setup
      console.log("Payment processed:", paymentData);

      return true;
    } catch (error) {
      console.error("Payment processing error:", error);
      Alert.alert(
        "Payment Failed",
        "Failed to process payment. Please try again."
      );
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubscribe = async () => {
    if (!showPaymentForm) {
      setShowPaymentForm(true);
      return;
    }

    if (!validateCard()) {
      return;
    }

    const success = await processStripePayment();
    if (success) {
      Alert.alert(
        "Success!",
        freeTrialEnabled
          ? "Your 7-day free trial has started! You won't be charged until the trial ends."
          : "Payment successful! Your premium subscription is now active.",
        [
          {
            text: "OK",
            onPress: () => {
              onSubscribe(selectedPlan);
              onClose();
              setShowPaymentForm(false);
              setCardDetails({
                number: "",
                expiryMonth: "",
                expiryYear: "",
                cvc: "",
                holderName: "",
                email: "",
              });
            },
          },
        ]
      );
    }
  };

  const goBack = () => {
    setShowPaymentForm(false);
  };

  const handleClose = () => {
    setShowPaymentForm(false);
    setCardDetails({
      number: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      holderName: "",
      email: "",
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row-reverse items-center justify-between px-5 py-4">
          {showPaymentForm ? (
            <TouchableOpacity
              onPress={goBack}
              className="w-10 h-10 bg-white/40 rounded-full items-center justify-center p-2 border border-[#E6E6E6]"
            >
              <X size={24} color="#FF0000" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleClose}
              className="w-10 h-10 bg-white/40 rounded-full items-center justify-center p-2 border border-[#E6E6E6]"
            >
              <X size={24} color="#FF0000" />
            </TouchableOpacity>
          )}

          {showPaymentForm && (
            <View className="flex-row items-center">
              <Lock size={16} color="#10B981" />
              <Text className="text-green-600 text-sm font-medium ml-1">
                <TranslatedText>Secure Payment</TranslatedText>
              </Text>
            </View>
          )}
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {!showPaymentForm ? (
            // Premium Plan Selection Screen
            <View className="flex-1 px-6">
              {/* Crown Icon */}
              <View className="items-center mb-5">
                <View className="w-28 h-20 items-center justify-center">
                  <Image
                    source={require("@/assets/images/premium.png")}
                    style={{
                      width: 120,
                      height: 80,
                    }}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Title */}
              <Text className="text-3xl font-bold text-black text-center mb-2">
                <TranslatedText>Unlock Premium</TranslatedText>
              </Text>
              <Text className="text-gray-500 text-center mb-5 text-base">
                <TranslatedText>
                  Enjoy the benefit when you upgrade to the premium plan.
                </TranslatedText>
              </Text>

              {/* Features */}
              <View className="mb-5 items-center justify-center">
                {features.map((feature, index) => (
                  <View
                    key={index}
                    className="flex-row items-center mb-4 w-[60%] mx-auto"
                  >
                    <View className="w-6 h-6 bg-primary rounded-full items-center justify-center mr-3">
                      <Check size={16} color="white" strokeWidth={3} />
                    </View>
                    <Text className="text-gray-800 text-base font-medium flex-1">
                      <TranslatedText>{feature}</TranslatedText>
                    </Text>
                  </View>
                ))}
              </View>

              {/* Free Trial Toggle */}
              <View className="flex-row items-center justify-between mb-4 bg-gray-50 p-4 rounded-base">
                <Text className="text-[#285A1A] font-bold text-lg">
                  <TranslatedText>7-Days Free trial</TranslatedText>
                </Text>
                <Switch
                  value={freeTrialEnabled}
                  onValueChange={setFreeTrialEnabled}
                  trackColor={{ false: "#E5E7EB", true: "#94E474" }}
                  thumbColor={freeTrialEnabled ? "#FFFFFF" : "#F3F4F6"}
                />
              </View>

              {/* Pricing Plans */}
              <View className="mb-8">
                {/* Yearly Plan */}
                <TouchableOpacity
                  onPress={() => setSelectedPlan("yearly")}
                  className={`border rounded-base p-4 mb-4 ${
                    selectedPlan === "yearly"
                      ? "border-primary bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                  style={selectedPlan === "yearly" ? selectedCardShadow : {}}
                >
                  <View className="flex-row items-center justify-between py-2">
                    <View className="flex-row items-center">
                      <View
                        className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                          selectedPlan === "yearly"
                            ? "border-primary bg-green-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selectedPlan === "yearly" && (
                          <Check size={14} color="white" strokeWidth={3} />
                        )}
                      </View>
                      <View className="flex-row gap-2 items-center">
                        <Text className="text-gray-800 font-semibold text-base">
                          <TranslatedText>Yearly</TranslatedText>
                        </Text>
                        <View className="flex-row items-center">
                          <View className="bg-green-500 px-2 py-1 rounded-md">
                            <Text className="text-white text-xs font-bold">
                              <TranslatedText>-50%</TranslatedText>
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-800 font-bold text-lg">
                        $69.99
                        <Text className="text-gray-500 text-sm">/yearly</Text>
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Monthly Plan */}
                <TouchableOpacity
                  onPress={() => setSelectedPlan("monthly")}
                  className={`border rounded-base p-4 ${
                    selectedPlan === "monthly"
                      ? "border-primary bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                  style={selectedPlan === "monthly" ? selectedCardShadow : {}}
                >
                  <View className="flex-row items-center justify-between py-2">
                    <View className="flex-row items-center">
                      <View
                        className={`w-6 h-6 border items-center rounded-full justify-center mr-3 ${
                          selectedPlan === "monthly"
                            ? "border-primary bg-green-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selectedPlan === "monthly" && (
                          <Check size={14} color="white" strokeWidth={3} />
                        )}
                      </View>
                      <Text className="text-gray-800 font-semibold text-base">
                        <TranslatedText>Monthly</TranslatedText>
                      </Text>
                    </View>
                    <Text className="text-gray-800 font-bold text-lg">
                      $5.99
                      <Text className="text-gray-500 text-sm">/monthly</Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Payment Form Screen
            <View className="flex-1 px-6">
              {/* Payment Header */}
              <View className="items-center mb-6">
                <CreditCard size={48} color="#10B981" />
                <Text className="text-2xl font-bold text-black text-center mt-2 mb-1">
                  <TranslatedText>Payment Details</TranslatedText>
                </Text>
                <Text className="text-gray-500 text-center">
                  <TranslatedText>
                    {freeTrialEnabled
                      ? "Start your 7-day free trial - no charge today"
                      : "Complete your subscription"}
                  </TranslatedText>
                </Text>
              </View>

              {/* Selected Plan Summary */}
              <View className="bg-gray-50 p-4 rounded-base mb-6">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-800 font-semibold">
                    <TranslatedText>
                      {selectedPlan === "yearly"
                        ? "Yearly Plan"
                        : "Monthly Plan"}
                    </TranslatedText>
                  </Text>
                  <Text className="text-gray-800 font-bold">
                    {selectedPlan === "yearly" ? "$69.99/year" : "$5.99/month"}
                  </Text>
                </View>
                {freeTrialEnabled && (
                  <Text className="text-green-600 text-sm mt-1">
                    <TranslatedText>7-day free trial included</TranslatedText>
                  </Text>
                )}
              </View>

              {/* Payment Form */}
              <View style={{ gap: 16 }}>
                {/* Email */}
                <View>
                  <Text className="text-gray-700 font-medium mb-2">
                    <TranslatedText>Email Address</TranslatedText>
                  </Text>
                  <TextInput
                    value={cardDetails.email}
                    onChangeText={(text) =>
                      setCardDetails({ ...cardDetails, email: text })
                    }
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="border border-gray-300 rounded-base px-4 py-3 text-base"
                  />
                </View>

                {/* Cardholder Name */}
                <View>
                  <Text className="text-gray-700 font-medium mb-2">
                    <TranslatedText>Cardholder Name</TranslatedText>
                  </Text>
                  <TextInput
                    value={cardDetails.holderName}
                    onChangeText={(text) =>
                      setCardDetails({ ...cardDetails, holderName: text })
                    }
                    placeholder="John Doe"
                    autoCapitalize="words"
                    className="border border-gray-300 rounded-base px-4 py-3 text-base"
                  />
                </View>

                {/* Card Number */}
                <View>
                  <Text className="text-gray-700 font-medium mb-2">
                    <TranslatedText>Card Number</TranslatedText>
                  </Text>
                  <TextInput
                    value={cardDetails.number}
                    onChangeText={(text) => {
                      const formatted = formatCardNumber(text);
                      setCardDetails({ ...cardDetails, number: formatted });
                    }}
                    placeholder="1234 5678 9012 3456"
                    keyboardType="numeric"
                    maxLength={19}
                    className="border border-gray-300 rounded-base px-4 py-3 text-base"
                  />
                </View>

                {/* Expiry and CVC */}
                <View className="flex-row" style={{ gap: 12 }}>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">
                      <TranslatedText>Expiry Month</TranslatedText>
                    </Text>
                    <TextInput
                      value={cardDetails.expiryMonth}
                      onChangeText={(text) => {
                        const formatted = formatExpiry(text, "month");
                        setCardDetails({
                          ...cardDetails,
                          expiryMonth: formatted,
                        });
                      }}
                      placeholder="MM"
                      keyboardType="numeric"
                      maxLength={2}
                      className="border border-gray-300 rounded-base px-4 py-3 text-base"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">
                      <TranslatedText>Expiry Year</TranslatedText>
                    </Text>
                    <TextInput
                      value={cardDetails.expiryYear}
                      onChangeText={(text) => {
                        const formatted = formatExpiry(text, "year");
                        setCardDetails({
                          ...cardDetails,
                          expiryYear: formatted,
                        });
                      }}
                      placeholder="YY"
                      keyboardType="numeric"
                      maxLength={2}
                      className="border border-gray-300 rounded-base px-4 py-3 text-base"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">
                      <TranslatedText>CVC</TranslatedText>
                    </Text>
                    <TextInput
                      value={cardDetails.cvc}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/\D/g, "").slice(0, 4);
                        setCardDetails({ ...cardDetails, cvc: cleaned });
                      }}
                      placeholder="123"
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                      className="border border-gray-300 rounded-base px-4 py-3 text-base"
                    />
                  </View>
                </View>

                {/* Security Notice */}
                <View className="bg-blue-50 p-3 rounded-base flex-row items-center mb-4">
                  <Lock size={16} color="#3B82F6" />
                  <Text className="text-blue-700 text-sm ml-2 flex-1">
                    <TranslatedText>
                      Your payment information is encrypted and secure
                    </TranslatedText>
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions */}
        <View className="px-6 pb-6">
          <Button
            onPress={handleSubscribe}
            className="w-full bg-primary mb-4"
            size="lg"
            textClassName="!text-black font-semibold"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <TranslatedText>Processing...</TranslatedText>
            ) : showPaymentForm ? (
              <TranslatedText>
                {freeTrialEnabled ? "Start Free Trial" : "Subscribe Now"}
              </TranslatedText>
            ) : (
              <TranslatedText>Try For Free!</TranslatedText>
            )}
          </Button>

          {!showPaymentForm && (
            <Text className="text-gray-500 text-center text-sm">
              <TranslatedText>No charges yet, cancel any time</TranslatedText>
            </Text>
          )}

          {showPaymentForm && freeTrialEnabled && (
            <Text className="text-gray-500 text-center text-sm">
              <TranslatedText>
                {`Free for 7 days, then ${selectedPlan === "yearly" ? "$69.99/year" : "$5.99/month"}. Cancel anytime.`}
              </TranslatedText>
            </Text>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
