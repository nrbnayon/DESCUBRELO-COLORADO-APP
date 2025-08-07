import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { useAppStore } from "@/store/useAppStore";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Settings,
  Heart,
  History,
  Award,
  Star,
  ChevronRight,
} from "lucide-react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ProfileScreen() {
  const { user, favoriteItems } = useAppStore();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  const profileStats = [
    {
      id: "favorites",
      title: "Favorites",
      count: favoriteItems.length,
      icon: <Heart size={20} color="#EF4444" />,
      color: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      id: "visited",
      title: "Places Visited",
      count: 12,
      icon: <MapPin size={20} color="#10B981" />,
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      id: "reviews",
      title: "Reviews",
      count: 8,
      icon: <Star size={20} color="#F59E0B" />,
      color: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      id: "achievements",
      title: "Achievements",
      count: 5,
      icon: <Award size={20} color="#8B5CF6" />,
      color: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const profileMenuItems = [
    {
      id: "editProfile",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      icon: <Edit3 size={20} color="#4DBA28" />,
      onPress: () => router.push("/(screen)/profile-settings"),
    },
    {
      id: "favorites",
      title: "My Favorites",
      subtitle: `${favoriteItems.length} saved places`,
      icon: <Heart size={20} color="#4DBA28" />,
      onPress: () => console.log("Navigate to favorites"),
    },
    {
      id: "history",
      title: "Visit History",
      subtitle: "Places you've been to",
      icon: <History size={20} color="#4DBA28" />,
      onPress: () => console.log("Navigate to history"),
    },
    {
      id: "settings",
      title: "Settings",
      subtitle: "App preferences and privacy",
      icon: <Settings size={20} color="#4DBA28" />,
      onPress: () => router.push("/(main)/settings"),
    },
  ];

  const formatAddress = (address: unknown): string => {
    if (typeof address === "string") {
      return address;
    }

    if (typeof address === "object" && address !== null) {
      const { street, city, state, zipCode, country } = address as {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };

      const parts = [street, city, state, zipCode, country].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "Not provided";
    }

    return "Not provided";
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
        <Text className="text-2xl font-bold text-black">
          <TranslatedText>Profile</TranslatedText>
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(screen)/profile-settings")}
          className="w-10 h-10 bg-white/40 rounded-full items-center justify-center p-2 border border-[#E6E6E6]"
        >
          <Edit3 size={20} color="#4DBA28" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center px-5 py-6">
          <View className="relative mb-4">
            <View className="w-28 h-28 bg-primary/10 rounded-full items-center justify-center">
              {user?.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <User size={48} color="#4DBA28" />
              )}
            </View>
            {user?.isVerified && (
              <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full items-center justify-center border-2 border-white">
                <Award size={14} color="white" />
              </View>
            )}
          </View>

          <Text className="text-2xl font-bold text-black mb-1">
            {user?.name || "Guest User"}
          </Text>

          <Text className="text-gray-600 mb-2">
            {user?.email || "No email provided"}
          </Text>

          {user?.bio && (
            <Text className="text-sm text-gray-600 text-center mb-4 px-4">
              {user.bio}
            </Text>
          )}

          <Text className="text-xs text-gray-500">
            <TranslatedText>
              {`Member since ${new Date(user?.createdAt || "").getFullYear() || 2024}`}
            </TranslatedText>
          </Text>
        </View>

        {/* Profile Stats */}
        <View className="mx-5 mb-5">
          <View className="flex-row flex-wrap justify-between">
            {profileStats.map((stat) => (
              <TouchableOpacity
                key={stat.id}
                className={`${stat.color} rounded-lg p-4 mb-3`}
                style={{ width: "48%" }}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
                    {stat.icon}
                  </View>
                  <Text className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.count}
                  </Text>
                </View>
                <Text className={`text-sm font-medium ${stat.textColor}`}>
                  <TranslatedText>{stat.title}</TranslatedText>
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* User Details */}
        {user && (
          <View className="bg-white mx-5 mb-5 rounded-lg border border-gray-200">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-black">
                <TranslatedText>Personal Information</TranslatedText>
              </Text>
            </View>

            <View className="p-4">
              {/* Email */}
              <View className="flex-row items-center mb-4">
                <Mail size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm font-medium ml-3 flex-1">
                  <TranslatedText>Email</TranslatedText>
                </Text>
                <Text className="text-black text-sm">
                  {user.email || "Not provided"}
                </Text>
              </View>

              {/* Phone */}
              <View className="flex-row items-center mb-4">
                <Phone size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm font-medium ml-3 flex-1">
                  <TranslatedText>Phone</TranslatedText>
                </Text>
                <Text className="text-black text-sm">
                  {user.phone || "Not provided"}
                </Text>
              </View>

              {/* Location */}
              <View className="flex-row items-center mb-4">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm font-medium ml-3 flex-1">
                  <TranslatedText>Location</TranslatedText>
                </Text>
                <Text className="text-black text-sm">
                  <TranslatedText>
                    {formatAddress(user?.address)}
                  </TranslatedText>
                </Text>
              </View>

              {/* Date of Birth */}
              <View className="flex-row items-center">
                <Calendar size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm font-medium ml-3 flex-1">
                  <TranslatedText>Date of Birth</TranslatedText>
                </Text>
                <Text className="text-black text-sm">
                  {user.dateOfBirth || "Not provided"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Profile Menu */}
        <View className="bg-white mx-5 mb-8 rounded-lg border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-black">
              <TranslatedText>Quick Actions</TranslatedText>
            </Text>
          </View>

          {profileMenuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              className={`flex-row items-center p-4 ${
                index !== profileMenuItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 items-center justify-center bg-primary/10 rounded-full">
                {item.icon}
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-medium text-black">
                  <TranslatedText>{item.title}</TranslatedText>
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  <TranslatedText>{item.subtitle}</TranslatedText>
                </Text>
              </View>
              <ChevronRight size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
