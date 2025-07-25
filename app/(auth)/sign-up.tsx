// app/(auth)/sign-up.tsx
import { useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { signUpSchema, type SignUpFormData } from "@/utils/validationSchemas";
import { showToast } from "@/utils/toast";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { AnimatedHeader } from "@/components/shared/AnimatedHeader";
import { Lock, Mail, User2 } from "lucide-react-native";

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { setSignUpEmail, setOtpType } = useAppStore();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agreeToPrivacyPolicy: false,
    },
    mode: "onChange",
  });

  const agreeToPrivacyPolicy = watch("agreeToPrivacyPolicy");

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call to create account
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store email and set OTP type for verification
      setSignUpEmail(data.email);
      setOtpType("signup");

      showToast(
        "success",
        t("Account Created!"),
        t("Please verify your email to continue.")
      );

      // Navigate to OTP verification
      router.push("/(auth)/verify-otp" as any);
    } catch (error) {
      console.error("Registration failed:", error);
      showToast(
        "error",
        t("Registration Failed"),
        t("Please try again later.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <AnimatedHeader
        title={t(`Create a new account${"\n"}with your email`)}
        titleClassName="text-black text-2xl font-semibold text-center leading-8"
        showBackButton={true}
      />
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: SCREEN_HEIGHT * 0.22 }}>
          <View>
            {/* Name Input */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={t("Full Name")}
                  placeholder={t("Enter your full name")}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    trigger("name");
                  }}
                  error={
                    errors.name?.message ? t(errors.name.message) : undefined
                  }
                  maxLength={50}
                  autoCapitalize="words"
                  icon={<User2 size={20} color="#4DBA28" />}
                  iconPosition="left"
                />
              )}
            />
            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={t("Email Address")}
                  placeholder={t("example@gmail.com")}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    trigger("email");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  restrictInput="email"
                  error={
                    errors.email?.message ? t(errors.email.message) : undefined
                  }
                  maxLength={100}
                  icon={<Mail size={20} color="#4DBA28" />}
                  iconPosition="left"
                />
              )}
            />
            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className="mb-1">
                  <Input
                    label={t("Create Password")}
                    placeholder={t("Enter your password")}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      trigger("password");
                    }}
                    restrictInput="password"
                    secureTextEntry={true}
                    error={
                      errors.password?.message
                        ? t(errors.password.message)
                        : undefined
                    }
                    maxLength={128}
                    icon={<Lock size={20} color="#4DBA28" />}
                    iconPosition="left"
                  />
                  <PasswordStrengthIndicator password={value} />
                </View>
              )}
            />
            {/* Privacy Policy Checkbox */}
            <Controller
              control={control}
              name="agreeToPrivacyPolicy"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  checked={value}
                  onPress={() => {
                    onChange(!value);
                    trigger("agreeToPrivacyPolicy");
                  }}
                  error={
                    errors.agreeToPrivacyPolicy?.message
                      ? t(errors.agreeToPrivacyPolicy.message)
                      : undefined
                  }
                  label={
                    <Text className="text-base text-black dark:text-white leading-5">
                      <TranslatedText>I agree to the </TranslatedText>
                      <Text
                        className="underline text-primary-dark"
                        onPress={() =>
                          router.navigate("/(screen)/privacy-policy")
                        }
                      >
                        <TranslatedText>privacy policy</TranslatedText>
                      </Text>
                      <TranslatedText> and </TranslatedText>
                      <Text
                        className="underline text-primary-dark"
                        onPress={() =>
                          router.navigate("/(screen)/privacy-policy")
                        }
                      >
                        <TranslatedText>terms</TranslatedText>
                      </Text>
                      <TranslatedText>.</TranslatedText>
                    </Text>
                  }
                />
              )}
            />
            {/* Sign Up Button */}
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={!agreeToPrivacyPolicy || isLoading}
              size="md"
              className="w-full bg-primary mt-5"
              textClassName="!text-black"
            >
              <TranslatedText>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </TranslatedText>
            </Button>
            {/* Sign In Link */}
            <View className="items-center mt-6 pb-8">
              <Text className="text-primary-dark text-base">
                <TranslatedText>Already have an Account? </TranslatedText>
                <Text
                  className="text-primary-dark font-semibold"
                  onPress={() => router.push("/(auth)/sign-in")}
                >
                  <TranslatedText>Sign In</TranslatedText>
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
