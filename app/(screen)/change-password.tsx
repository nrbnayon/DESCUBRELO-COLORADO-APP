import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  DimensionValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Key,
  Shield,
  CheckCircle,
  X,
} from "lucide-react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  strength: "weak" | "medium" | "strong";
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
  };
}

export default function ChangePasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const checks = {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      special: false,
    };

    // Length check (8+ characters)
    if (password.length >= 8) {
      score += 20;
      checks.length = true;
    }

    // Uppercase letter
    if (/[A-Z]/.test(password)) {
      score += 20;
      checks.uppercase = true;
    }

    // Lowercase letter
    if (/[a-z]/.test(password)) {
      score += 20;
      checks.lowercase = true;
    }

    // Numbers
    if (/[0-9]/.test(password)) {
      score += 20;
      checks.numbers = true;
    }

    // Special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 20;
      checks.special = true;
    }

    // Determine strength level
    let strength: "weak" | "medium" | "strong" = "weak";
    if (score >= 80) {
      strength = "strong";
    } else if (score >= 60) {
      strength = "medium";
    }

    return {
      score: Math.min(score, 100),
      strength,
      checks,
    };
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);

  const validateForm = (): boolean => {
    if (!formData.currentPassword) {
      Alert.alert("Error", "Please enter your current password");
      return false;
    }

    if (!formData.newPassword) {
      Alert.alert("Error", "Please enter a new password");
      return false;
    }

    if (formData.newPassword.length < 8) {
      Alert.alert("Error", "New password must be at least 8 characters long");
      return false;
    }

    if (formData.newPassword === formData.currentPassword) {
      Alert.alert(
        "Error",
        "New password must be different from current password"
      );
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "New password and confirmation don't match");
      return false;
    }

    if (passwordStrength.strength === "weak") {
      Alert.alert(
        "Weak Password",
        "Please choose a stronger password that meets all security requirements"
      );
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to change password
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, you would call your API here
      // const response = await authService.changePassword({
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword,
      // });

      Alert.alert("Success", "Your password has been changed successfully", [
        {
          text: "OK",
          onPress: () => {
            // Clear form
            setFormData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert(
        "Error",
        "Failed to change password. Please check your current password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength.strength) {
      case "strong":
        return "#10B981";
      case "medium":
        return "#F59E0B";
      default:
        return "#EF4444";
    }
  };

  const getStrengthWidth = (): DimensionValue => {
    return `${passwordStrength.score}%`;
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
          <TranslatedText>Change Password</TranslatedText>
        </Text>
        <View className="w-8 h-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View className="mx-5 mt-5 mb-6">
          <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <View className="flex-row items-center mb-2">
              <Shield size={20} color="#3B82F6" />
              <Text className="text-blue-800 font-semibold ml-2">
                <TranslatedText>Security Tip</TranslatedText>
              </Text>
            </View>
            <Text className="text-blue-700 text-sm">
              <TranslatedText>
                Choose a strong password with at least 8 characters, including
                uppercase and lowercase letters, numbers, and special
                characters.
              </TranslatedText>
            </Text>
          </View>
        </View>

        {/* Password Form */}
        <View className="bg-white mx-5 rounded-lg border border-gray-200 p-4">
          <Text className="text-lg font-semibold text-black mb-4">
            <TranslatedText>Update Password</TranslatedText>
          </Text>

          {/* Current Password */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              <TranslatedText>Current Password</TranslatedText>
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
              <Key size={16} color="#6B7280" />
              <TextInput
                value={formData.currentPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, currentPassword: text })
                }
                placeholder="Enter current password"
                secureTextEntry={!showCurrentPassword}
                className="flex-1 ml-3 text-base text-gray-900"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff size={16} color="#6B7280" />
                ) : (
                  <Eye size={16} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              <TranslatedText>New Password</TranslatedText>
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
              <Key size={16} color="#6B7280" />
              <TextInput
                value={formData.newPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, newPassword: text })
                }
                placeholder="Enter new password"
                secureTextEntry={!showNewPassword}
                className="flex-1 ml-3 text-base text-gray-900"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff size={16} color="#6B7280" />
                ) : (
                  <Eye size={16} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {formData.newPassword.length > 0 && (
              <View className="mt-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600">
                    <TranslatedText>Password Strength:</TranslatedText>
                  </Text>
                  <Text
                    className="text-sm font-medium capitalize"
                    style={{ color: getStrengthColor() }}
                  >
                    <TranslatedText>{passwordStrength.strength}</TranslatedText>
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: getStrengthColor(),
                      width: getStrengthWidth(),
                    }}
                  />
                </View>

                {/* Password Requirements */}
                <View className="mt-3 space-y-1">
                  {[
                    { key: "length", text: "At least 8 characters" },
                    { key: "uppercase", text: "One uppercase letter" },
                    { key: "lowercase", text: "One lowercase letter" },
                    { key: "numbers", text: "One number" },
                    { key: "special", text: "One special character" },
                  ].map((requirement) => (
                    <View
                      key={requirement.key}
                      className="flex-row items-center mb-1"
                    >
                      {passwordStrength.checks[
                        requirement.key as keyof typeof passwordStrength.checks
                      ] ? (
                        <CheckCircle size={12} color="#10B981" />
                      ) : (
                        <X size={12} color="#EF4444" />
                      )}
                      <Text
                        className={`text-xs ml-2 ${
                          passwordStrength.checks[
                            requirement.key as keyof typeof passwordStrength.checks
                          ]
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <TranslatedText>{requirement.text}</TranslatedText>
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              <TranslatedText>Confirm New Password</TranslatedText>
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
              <Key size={16} color="#6B7280" />
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
                className="flex-1 ml-3 text-base text-gray-900"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} color="#6B7280" />
                ) : (
                  <Eye size={16} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
            {formData.confirmPassword.length > 0 &&
              formData.newPassword !== formData.confirmPassword && (
                <Text className="text-red-600 text-sm mt-2">
                  <TranslatedText>Passwords don&lsquo;t match</TranslatedText>
                </Text>
              )}
          </View>

          {/* Change Password Button */}
          <Button
            onPress={handleChangePassword}
            disabled={loading || passwordStrength.strength === "weak"}
            className="w-full bg-primary"
            size="lg"
            textClassName="!text-black font-semibold"
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#000" />
                <Text className="ml-2 text-black font-semibold">
                  <TranslatedText>Updating...</TranslatedText>
                </Text>
              </View>
            ) : (
              <TranslatedText>Change Password</TranslatedText>
            )}
          </Button>
        </View>

        {/* Additional Security Tips */}
        <View className="mx-5 mt-6 mb-8">
          <View className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <Text className="text-yellow-800 font-semibold mb-2">
              <TranslatedText>Password Security Tips</TranslatedText>
            </Text>
            <Text className="text-yellow-700 text-sm mb-2">
              <TranslatedText>
                • Use a unique password that you don&lsquo;t use elsewhere
              </TranslatedText>
            </Text>
            <Text className="text-yellow-700 text-sm mb-2">
              <TranslatedText>
                • Avoid using personal information in passwords
              </TranslatedText>
            </Text>
            <Text className="text-yellow-700 text-sm mb-2">
              <TranslatedText>
                • Consider using a password manager
              </TranslatedText>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
