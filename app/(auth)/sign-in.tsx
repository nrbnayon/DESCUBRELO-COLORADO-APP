// app/(auth)/sign-in.tsx
import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { AnimatedHeader } from "@/components/shared/AnimatedHeader";
import { signInSchema, type SignInFormData } from "@/utils/validationSchemas";
import { showToast } from "@/utils/toast";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Lock, Mail } from "lucide-react-native";

// Dev mode check - you can also use Constants.expoConfig.extra.isDev or similar
const __DEV__ = process.env.NODE_ENV === "development";

export default function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword] = useState(false);
  const { setUser } = useAppStore();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: __DEV__ ? "dev@example.com" : "",
      password: __DEV__ ? "password123" : "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock user data
      setUser({
        id: "1",
        name: "Nayon",
        email: data.email,
        isVerified: true,
      });

      showToast("success", t("Welcome back!"), t("Successfully signed in."));
      router.replace("/(main)" as any);
    } catch (error) {
      console.error("Sign In Failed:", error);
      showToast(
        "error",
        t("Sign In Failed"),
        t("Please check your credentials.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <AnimatedHeader
        title={t(`Login to your account${"\n"}with your email`)}
        titleClassName="text-black text-2xl font-semibold text-center leading-8"
        showBackButton={true}
      />
      <View className="flex-1 px-5" style={{ marginTop: SCREEN_HEIGHT * 0.25 }}>
        {/* Form */}
        <View className="flex-1">
          {__DEV__ && (
            <View className="mb-4 p-3 bg-yellow-100 rounded-md">
              <Text className="text-xs text-yellow-800">
                🚧 DEV MODE: Default credentials loaded
              </Text>
            </View>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("Email")}
                placeholder={t("Enter your email")}
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={20} color="#4DBA28" />}
                iconPosition="left"
                error={
                  errors.email?.message ? t(errors.email.message) : undefined
                }
              />
            )}
          />

          {/* Custom Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("Password")}
                placeholder={t("Enter your password")}
                value={value}
                onChangeText={onChange}
                icon={<Lock size={20} color="#4DBA28" />}
                iconPosition="left"
                secureTextEntry={!showPassword}
                error={
                  errors.password?.message
                    ? t(errors.password.message)
                    : undefined
                }
              />
            )}
          />

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            className="self-end mb-10"
          >
            <Text className="text-primary-dark font-medium">
              <TranslatedText>Forget password</TranslatedText>
            </Text>
          </TouchableOpacity>

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            className="w-full mb-5"
            size="md"
            textClassName="!text-black"
          >
            <TranslatedText>Login</TranslatedText>
          </Button>

          <View className="flex-row justify-center">
            <Text className="text-gray-600">
              <TranslatedText>Don&apos;t have an account? </TranslatedText>
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="text-primary-dark font-medium">
                <TranslatedText>Sign Up</TranslatedText>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
