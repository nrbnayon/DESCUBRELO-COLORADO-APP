// app/(auth)/verify-otp.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { AnimatedHeader } from "@/components/shared/AnimatedHeader";
import { showToast } from "@/utils/toast";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyOTPScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const { forgotPasswordEmail, signUpEmail, otpType, setOtpVerified, setUser } =
    useAppStore();
  const { t } = useTranslation();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentEmail = otpType === "signup" ? signUpEmail : forgotPasswordEmail;

  // Redirect if no email is set
  useEffect(() => {
    if (!currentEmail || !otpType) {
      router.replace("/(auth)/sign-in");
      return;
    }
  }, [currentEmail, otpType]);

  // Timer effect with persistence
  useEffect(() => {
    const startTimer = async () => {
      try {
        const currentTime = Date.now();
        const savedStartTime = await AsyncStorage.getItem(
          `otp_start_time_${otpType}`
        );
        let startTime: number;

        if (savedStartTime) {
          startTime = Number.parseInt(savedStartTime, 10);
        } else {
          startTime = currentTime;
          await AsyncStorage.setItem(
            `otp_start_time_${otpType}`,
            startTime.toString()
          );
        }

        const elapsed = Math.floor((currentTime - startTime) / 1000);
        const remainingTime = Math.max(0, 120 - elapsed);

        setTimer(remainingTime);

        if (remainingTime === 0) {
          setCanResend(true);
          return;
        }

        setCanResend(false);

        // Clear any existing interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
          const now = Date.now();
          const currentElapsed = Math.floor((now - startTime) / 1000);
          const currentRemaining = Math.max(0, 120 - currentElapsed);

          setTimer(currentRemaining);

          if (currentRemaining <= 0) {
            setCanResend(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 1000);
      } catch (error) {
        console.error("Timer initialization error:", error);
      }
    };

    if (otpType) {
      startTimer();
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [otpType]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Reset timer with new start time
      const newStartTime = Date.now();
      await AsyncStorage.setItem(
        `otp_start_time_${otpType}`,
        newStartTime.toString()
      );
      setTimer(120);
      setCanResend(false);

      // Start new timer
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - newStartTime) / 1000);
        const remaining = Math.max(0, 120 - elapsed);

        setTimer(remaining);

        if (remaining <= 0) {
          setCanResend(true);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 1000);

      showToast(
        "success",
        t("OTP Sent"),
        t("A new verification code has been sent to your email.")
      );
    } catch (error) {
      console.error("Resend OTP error:", error);
      showToast("error", t("Failed to resend"), t("Please try again later."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      showToast(
        "error",
        t("Invalid OTP"),
        t("Please enter the complete 4-digit code.")
      );
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, accept any 4-digit code
      setOtpVerified(true);

      // Clear the timer storage and interval
      await AsyncStorage.removeItem(`otp_start_time_${otpType}`);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (otpType === "signup") {
        // For signup, create user and go to main app
        setUser({
          id: "1",
          name: "User",
          email: currentEmail!,
          createdAt: new Date().toISOString(),
          isVerified: true,
          role: "user",
        });

        showToast(
          "success",
          t("Email Verified!"),
          t("Welcome to DESCUBRELO COLORADO.")
        );
        router.replace("/(main)" as any);
      } else {
        // For forgot password, go to reset password
        showToast(
          "success",
          t("Email Verified!"),
          t("You can now reset your password.")
        );
        router.push("/(auth)/reset-password" as any);
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      showToast(
        "error",
        t("Invalid OTP"),
        t("Please check your code and try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  if (!currentEmail || !otpType) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <AnimatedHeader
        title={t("Verify Your Email")}
        titleClassName="text-black text-2xl font-semibold text-center leading-8"
        showBackButton={true}
      />

      <View className="flex-1 px-5" style={{ marginTop: SCREEN_HEIGHT * 0.25 }}>
        {/* Content */}
        <View className="flex-1">
          {/* Description */}
          <Text className="text-black text-base leading-6 mb-8 text-center">
            <TranslatedText>
              We sent a 4 digit code to your email
            </TranslatedText>
            {"\n"}
            <Text className="text-primary-dark font-medium">
              {currentEmail}
            </Text>
          </Text>

          {/* OTP Input */}
          <View className="flex-row justify-between mb-8 mt-8">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                className={`w-16 h-16 border-2 rounded-lg text-center text-2xl font-bold bg-white ${
                  digit
                    ? "border-primary"
                    : otp.some((d) => d !== "") && !digit
                      ? "border-red-300"
                      : "border-gray-300"
                }`}
                maxLength={1}
                keyboardType="numeric"
                autoFocus={index === 0}
                placeholderTextColor="#999"
              />
            ))}
          </View>

          {/* Resend Timer */}
          <View className="items-center mb-8">
            <Text className="text-black text-base mb-2">
              <TranslatedText>
                Didn&apos;t get the verification code?
              </TranslatedText>
            </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResendOTP} disabled={isLoading}>
                <Text className="text-primary-dark font-medium text-base">
                  <TranslatedText>Resend code</TranslatedText>
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-primary-dark text-base">
                <TranslatedText>Resend in</TranslatedText> {formatTime(timer)}
              </Text>
            )}
          </View>
        </View>

        {/* Bottom Button */}
        <View className="pb-8">
          <Button
            onPress={handleVerifyOTP}
            loading={isLoading}
            className="w-full"
            size="md"
            textClassName="!text-black"
          >
            <TranslatedText>Verify Email</TranslatedText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
