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
import { signUpSchema, type SignUpFormData } from "@/utils/validationSchemas";
import { showToast } from "@/utils/toast";
import { useAppStore } from "@/store/useAppStore";
import { AnimatedHeader } from "@/components/shared/AnimatedHeader";
import { Lock, Mail, User2 } from "lucide-react-native";

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAppStore();

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful registration
      setUser({
        id: "1",
        name: data.name,
        email: data.email,
        createdAt: new Date().toISOString(),
        isVerified: false,
        role: "user",
      });

      showToast(
        "success",
        "Account Created!",
        "Welcome to DESCUBRELO COLORADO."
      );
      router.replace("/(main)" as any);
    } catch (error) {
      console.error("Registration failed:", error);
      showToast("error", "Registration Failed", "Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <AnimatedHeader
        title={`Create a new account${"\n"}with your email`}
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
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    trigger("name"); // Trigger validation on change
                  }}
                  error={errors.name?.message}
                  maxLength={50}
                  autoCapitalize="words"
                  icon={<User2 size={20} color="#4DBA28" />}
                  iconPosition="left"
                />
              )}
            />

            {/* Email Input with restrictions */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="example@gmail.com"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    trigger("email"); // Trigger validation on change
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  restrictInput="email" // Apply email restrictions
                  error={errors.email?.message}
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
                    label="Create Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      trigger("password");
                    }}
                    restrictInput="password"
                    secureTextEntry={true}
                    error={errors.password?.message}
                    maxLength={128}
                    icon={<Lock size={20} color="#4DBA28" />}
                    iconPosition="left"
                  />
                  {/* Password Strength Indicator */}
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
                  error={errors.agreeToPrivacyPolicy?.message}
                  label={
                    <Text className="text-base text-black dark:text-white leading-5">
                      I agree to the{" "}
                      <Text
                        className="underline text-primary-dark"
                        onPress={() =>
                          router.navigate("/(screen)/privacy-policy")
                        }
                      >
                        privacy policy
                      </Text>{" "}
                      and{" "}
                      <Text
                        className="underline text-primary-dark"
                        onPress={() =>
                          router.navigate("/(screen)/privacy-policy")
                        }
                      >
                        terms
                      </Text>
                      .
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
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

            {/* Sign In Link */}
            <View className="items-center mt-6 pb-8">
              <Text className="text-primary-dark text-base">
                Already have an Account?{" "}
                <Text
                  className="text-primary-dark font-semibold"
                  onPress={() => router.push("/(auth)/sign-in")}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
