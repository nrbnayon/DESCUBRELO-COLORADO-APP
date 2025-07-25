// app/(auth)/forgot-password.tsx
import { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { AnimatedHeader } from "@/components/shared/AnimatedHeader";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/utils/validationSchemas";
import { showToast } from "@/utils/toast";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Mail } from "lucide-react-native";

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { setForgotPasswordEmail, setOtpType } = useAppStore();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store email and set OTP type for verification
      setForgotPasswordEmail(data.email);
      setOtpType("forgot-password");

      showToast(
        "success",
        t("OTP Sent"),
        t("Please check your email for verification code.")
      );

      // Navigate to OTP verification
      router.push("/(auth)/verify-otp" as any);
    } catch (error) {
      console.log("Forget pass error::", error);
      showToast("error", t("Failed to Send"), t("Please try again later."));
    } finally {
      setIsLoading(false);
    }
  };

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <AnimatedHeader
        title={t("Forget Password")}
        titleClassName="text-black text-2xl font-semibold text-center leading-8"
        showBackButton={true}
      />

      <View className="flex-1 px-5" style={{ marginTop: SCREEN_HEIGHT * 0.32 }}>
        {/* Content */}
        <View className="flex-1">
          <Text className="text-center text-black text-base leading-6 mb-5">
            <TranslatedText>
              Select which contact details should we use to reset your password.
            </TranslatedText>
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("Email")}
                placeholder={t("example@gmail.com")}
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={
                  errors.email?.message ? t(errors.email.message) : undefined
                }
                icon={<Mail size={20} color="#4DBA28" />}
                iconPosition="left"
              />
            )}
          />
        </View>

        {/* Bottom Button */}
        <View className="pb-8">
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            className="w-full"
            size="md"
            textClassName="!text-black"
          >
            <TranslatedText>Continue</TranslatedText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
