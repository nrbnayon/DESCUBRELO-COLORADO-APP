import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  Camera,
  Key,
//   Shield,
  CheckCircle,
  X,
  User,
} from "lucide-react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ProfileSettingsScreen() {
  const { user, updateUserProfile } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    dateOfBirth: user?.dateOfBirth || "",
    bio: user?.bio || "",
  });

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
      });

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      dateOfBirth: user?.dateOfBirth || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    router.push("/(screen)/change-password");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Account Deletion",
              "Account deletion is not implemented yet"
            );
          },
        },
      ]
    );
  };

  const profileActions = [
    {
      id: "changePassword",
      title: "Change Password",
      subtitle: "Update your account password",
      icon: <Key size={20} color="#4DBA28" />,
      onPress: handleChangePassword,
    },
    // {
    //   id: "twoFactor",
    //   title: "Two-Factor Authentication",
    //   subtitle: user?.twoFactorEnabled ? "Enabled" : "Disabled",
    //   icon: <Shield size={20} color="#4DBA28" />,
    //   onPress: () => Alert.alert("Two-Factor Auth", "Feature coming soon"),
    // },
  ];

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
          <TranslatedText>Profile Settings</TranslatedText>
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={loading}
          className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-lg"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#4DBA28" />
          ) : isEditing ? (
            <>
              <Save size={16} color="#4DBA28" />
              <Text className="text-green-600 font-medium text-sm ml-1">
                <TranslatedText>Save</TranslatedText>
              </Text>
            </>
          ) : (
            <>
              <Edit3 size={16} color="#4DBA28" />
              <Text className="text-green-600 font-medium text-sm ml-1">
                <TranslatedText>Edit</TranslatedText>
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View className="items-center px-5 py-6">
          <View className="relative">
            <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center">
              {user?.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <User size={40} color="#4DBA28" />
              )}
            </View>
            {isEditing && (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Change Photo", "Feature coming soon")
                }
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full items-center justify-center"
              >
                <Camera size={14} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center mt-3">
            <Text className="text-lg font-semibold text-black">
              {user?.name || "User"}
            </Text>
            {user?.isVerified && (
              <CheckCircle size={16} color="#10B981" className="ml-2" />
            )}
          </View>

          <Text className="text-gray-600 text-sm mt-1">
            <TranslatedText>
              {`Member since ${new Date(user?.createdAt || "").getFullYear() || 2024}`}
            </TranslatedText>
          </Text>
        </View>

        {/* Profile Information */}
        <View className="bg-white mx-5 rounded-lg border border-gray-200 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-black mb-4">
              <TranslatedText>Personal Information</TranslatedText>
            </Text>

            {/* Name Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Full Name</TranslatedText>
              </Text>
              <View className="flex-row items-center">
                <User size={16} color="#6B7280" className="mr-3" />
                {isEditing ? (
                  <TextInput
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, name: text })
                    }
                    placeholder="Enter your full name"
                    className="flex-1 text-base text-gray-900 border-b border-gray-200 pb-1"
                  />
                ) : (
                  <Text className="flex-1 text-base text-gray-900">
                    {user?.name || "Not provided"}
                  </Text>
                )}
              </View>
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Email Address</TranslatedText>
              </Text>
              <View className="flex-row items-center">
                <Mail size={16} color="#6B7280" className="mr-3" />
                {isEditing ? (
                  <TextInput
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 text-base text-gray-900 border-b border-gray-200 pb-1"
                  />
                ) : (
                  <Text className="flex-1 text-base text-gray-900">
                    {user?.email || "Not provided"}
                  </Text>
                )}
              </View>
            </View>

            {/* Phone Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Phone Number</TranslatedText>
              </Text>
              <View className="flex-row items-center">
                <Phone size={16} color="#6B7280" className="mr-3" />
                {isEditing ? (
                  <TextInput
                    value={formData.phone}
                    onChangeText={(text) =>
                      setFormData({ ...formData, phone: text })
                    }
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    className="flex-1 text-base text-gray-900 border-b border-gray-200 pb-1"
                  />
                ) : (
                  <Text className="flex-1 text-base text-gray-900">
                    {user?.phone || "Not provided"}
                  </Text>
                )}
              </View>
            </View>

            {/* Address Fields */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Address</TranslatedText>
              </Text>
              <View className="flex-row items-center">
                <MapPin size={16} color="#6B7280" className="mr-3" />
                {isEditing ? (
                  <View className="flex-1">
                    <TextInput
                      value={formData.address.street || ""}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, street: text },
                        })
                      }
                      placeholder="Street"
                      className="text-base text-gray-900 border-b border-gray-200 pb-1 mb-2"
                    />
                    <TextInput
                      value={formData.address.city || ""}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, city: text },
                        })
                      }
                      placeholder="City"
                      className="text-base text-gray-900 border-b border-gray-200 pb-1 mb-2"
                    />
                    <TextInput
                      value={formData.address.state || ""}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, state: text },
                        })
                      }
                      placeholder="State"
                      className="text-base text-gray-900 border-b border-gray-200 pb-1 mb-2"
                    />
                    <TextInput
                      value={formData.address.zipCode || ""}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, zipCode: text },
                        })
                      }
                      placeholder="Zip Code"
                      className="text-base text-gray-900 border-b border-gray-200 pb-1 mb-2"
                    />
                    <TextInput
                      value={formData.address.country || ""}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, country: text },
                        })
                      }
                      placeholder="Country"
                      className="text-base text-gray-900 border-b border-gray-200 pb-1"
                    />
                  </View>
                ) : (
                  <Text className="flex-1 text-base text-gray-900">
                    {user?.address
                      ? `${user.address.street || ""}, ${user.address.city || ""}, ${
                          user.address.state || ""
                        }, ${user.address.zipCode || ""}, ${user.address.country || ""}`
                      : "Not provided"}
                  </Text>
                )}
              </View>
            </View>

            {/* Date of Birth Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Date of Birth</TranslatedText>
              </Text>
              <View className="flex-row items-center">
                <Calendar size={16} color="#6B7280" className="mr-3" />
                {isEditing ? (
                  <TextInput
                    value={formData.dateOfBirth}
                    onChangeText={(text) =>
                      setFormData({ ...formData, dateOfBirth: text })
                    }
                    placeholder="YYYY-MM-DD"
                    className="flex-1 text-base text-gray-900 border-b border-gray-200 pb-1"
                  />
                ) : (
                  <Text className="flex-1 text-base text-gray-900">
                    {user?.dateOfBirth || "Not provided"}
                  </Text>
                )}
              </View>
            </View>

            {/* Bio Field */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>Bio</TranslatedText>
              </Text>
              {isEditing ? (
                <TextInput
                  value={formData.bio}
                  onChangeText={(text) =>
                    setFormData({ ...formData, bio: text })
                  }
                  placeholder="Tell us about yourself..."
                  multiline
                  numberOfLines={3}
                  className="text-base text-gray-900 border border-gray-200 rounded-lg p-3 min-h-[80px]"
                />
              ) : (
                <Text className="text-base text-gray-900">
                  {user?.bio || "No bio provided"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View className="bg-white mx-5 mt-5 rounded-lg border border-gray-200 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-black mb-4">
              <TranslatedText>Account Security</TranslatedText>
            </Text>

            {profileActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                className={`flex-row items-center py-3 ${
                  index !== profileActions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
                activeOpacity={0.7}
              >
                <View className="w-8 h-8 items-center justify-center bg-primary/10 rounded-full">
                  {action.icon}
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-black">
                    <TranslatedText>{action.title}</TranslatedText>
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    <TranslatedText>{action.subtitle}</TranslatedText>
                  </Text>
                </View>
                <ChevronLeft
                  size={16}
                  color="#ccc"
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cancel Edit Button */}
        {isEditing && (
          <View className="px-5 mt-5">
            <Button
              onPress={handleCancel}
              variant="outline"
              size="lg"
              className="border-gray-300"
              textClassName="text-gray-700"
            >
              <X size={16} color="#6B7280" />
              <Text className="ml-2">
                <TranslatedText>Cancel</TranslatedText>
              </Text>
            </Button>
          </View>
        )}

        {/* Danger Zone */}
        <View className="bg-red-50 mx-5 mt-5 mb-8 rounded-lg border border-red-200">
          <View className="p-4">
            <Text className="text-lg font-semibold text-red-800 mb-2">
              <TranslatedText>Danger Zone</TranslatedText>
            </Text>
            <Text className="text-sm text-red-600 mb-4">
              <TranslatedText>
                Once you delete your account, there is no going back. Please be
                certain.
              </TranslatedText>
            </Text>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="bg-red-500 py-2 px-4 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-white font-medium text-center">
                <TranslatedText>Delete Account</TranslatedText>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
