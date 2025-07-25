// app/(auth)/reset-password.tsx
import { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { AnimatedHeader } from "@/components/shared/AnimatedHeader";
import { SuccessModal } from "@/components/SuccessModal";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/utils/validationSchemas";
import { showToast } from "@/utils/toast";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Lock } from "lucide-react-native";

export default function ResetPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { otpVerified, otpType } = useAppStore();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Redirect if OTP not verified or wrong type
  if (!otpVerified || otpType !== "forgot-password") {
    router.replace("/(auth)/forgot-password");
    return null;
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast("success", t("Successfully"), t("Reset Password"));
      setShowSuccessModal(true);
    } catch (error) {
      console.log("Reset password error::", error);
      showToast("error", t("Failed to Reset"), t("Please try again later."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Navigate to login
    router.replace("/(auth)/sign-in");
  };

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  return (
    <SafeAreaView className='flex-1 bg-surface'>
      <AnimatedHeader
        title={t("Reset Password")}
        titleClassName='text-black text-2xl font-semibold text-center leading-8'
        showBackButton={true}
      />

      <View className='flex-1 px-5' style={{ marginTop: SCREEN_HEIGHT * 0.25 }}>
        {/* Content */}
        <View className='flex-1'>
          <Text className='text-center text-primary-dark text-xl font-semibold mb-8'>
            <TranslatedText>Create Your New password</TranslatedText>
          </Text>

          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, value } }) => (
              <View>
                <Input
                  label={t("New Password")}
                  placeholder={t("Enter your Password")}
                  value={value}
                  onChangeText={(text) => {
                    const textWithoutSpaces = text.replace(/\s/g, "");
                    onChange(textWithoutSpaces);
                    trigger("password");
                  }}
                  restrictInput='password'
                  secureTextEntry
                  error={
                    errors.password?.message
                      ? t(errors.password.message)
                      : undefined
                  }
                  maxLength={128}
                  icon={<Lock size={20} color='#4DBA28' />}
                  iconPosition='left'
                  className='mb-4'
                />
                <PasswordStrengthIndicator password={value} />
              </View>
            )}
          />

          <Controller
            control={control}
            name='confirmPassword'
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("Re-type password")}
                placeholder={t("Enter Re-Password")}
                value={value}
                onChangeText={(text) => {
                  const textWithoutSpaces = text.replace(/\s/g, "");
                  onChange(textWithoutSpaces);
                  trigger("confirmPassword");
                }}
                secureTextEntry
                error={
                  errors.confirmPassword?.message
                    ? t(errors.confirmPassword.message)
                    : undefined
                }
                maxLength={128}
                icon={<Lock size={20} color='#4DBA28' />}
                iconPosition='left'
              />
            )}
          />
        </View>

        {/* Bottom Button */}
        <View className='pb-8'>
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            className='w-full'
            size='md'
            textClassName='!text-black'
          >
            <TranslatedText>Create Now</TranslatedText>
          </Button>
        </View>
        <SuccessModal
          visible={showSuccessModal}
          title={t("Your password has been reset successfully.")}
          onClose={handleSuccessClose}
        />
      </View>
    </SafeAreaView>
  );
}
