// app\(main)\home.tsx
import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { useTranslation } from "@/hooks/useTranslation";
import { router } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import {
  Home as HomeIcon,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Globe,
  Users,
  Activity,
} from "lucide-react-native";

export default function HomeScreen() {
  const { translateBatch } = useTranslation();
  const { user } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredItems, setFeaturedItems] = useState<string[]>([]);

    const { logout, setHasSeenOnboarding } = useAppStore();

    const handleLogout = () => {
      // First logout the user (this will clear user data and set isAuthenticated to false)
      logout();

      // Reset onboarding flag for demo purposes
      setHasSeenOnboarding(false);

      // Navigate back to the index screen
      router.replace("/");
    };

  // Sample data that will be translated
  const sampleData = {
    welcomeMessage: "Welcome back to DESCUBRELO COLORADO!",
    featuredPlaces: [
      "Rocky Mountain National Park",
      "Garden of the Gods",
      "Mesa Verde National Park",
      "Great Sand Dunes National Park",
      "Red Rocks Amphitheatre",
    ],
    categories: [
      "Outdoor Adventures",
      "Cultural Experiences",
      "Local Cuisine",
      "Historical Sites",
      "Family Activities",
    ],
    quickStats: [
      "1,200+ Places to Discover",
      "500+ Local Experiences",
      "50+ Cities Covered",
      "10,000+ Happy Travelers",
    ],
  };

  useEffect(() => {
    loadTranslatedContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTranslatedContent = async () => {
    try {
      const translated = await translateBatch(sampleData.featuredPlaces);
      setFeaturedItems(translated);
    } catch (error) {
      console.error("Error loading translated content:", error);
      setFeaturedItems(sampleData.featuredPlaces);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTranslatedContent();
    setRefreshing(false);
  };

  const StatCard = ({
    icon,
    title,
    value,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string;
  }) => (
    <View className="bg-white p-4 rounded-lg border border-gray-200 flex-1 mx-1">
      <View className="items-center">
        {icon}
        <Text className="text-2xl font-bold text-black mt-2">{value}</Text>
        <Text className="text-sm text-gray-600 text-center mt-1">
          <TranslatedText>{title}</TranslatedText>
        </Text>
      </View>
    </View>
  );

  const CategoryCard = ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-primary/5 p-4 rounded-lg border border-primary/20 mr-3 min-w-[150px]"
      activeOpacity={0.7}
    >
      <Text className="text-primary-dark font-medium text-center">
        <TranslatedText>{title}</TranslatedText>
      </Text>
    </TouchableOpacity>
  );

  const PlaceCard = ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-lg border border-gray-200 mb-3 flex-row items-center"
      activeOpacity={0.7}
    >
      <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-3">
        <MapPin size={24} color="#4DBA28" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-black">{title}</Text>
        <View className="flex-row items-center mt-1">
          <Star size={16} color="#fbbf24" />
          <Text className="text-sm text-gray-600 ml-1">4.8</Text>
          <Text className="text-sm text-gray-400 ml-2">
            <TranslatedText>Popular destination</TranslatedText>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <HomeIcon size={28} color="#4DBA28" />
            <Text className="text-2xl font-bold text-black ml-3">
              <TranslatedText>Discover</TranslatedText>
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
            <Globe size={20} color="#4DBA28" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View className="px-5 py-6">
          <Text className="text-xl font-semibold text-black mb-2">
            <TranslatedText>
              {user ? `Hello, ${user.name}!` : "Welcome!"}
            </TranslatedText>
          </Text>
          <Text className="text-gray-600 text-base leading-6">
            <TranslatedText>{sampleData.welcomeMessage}</TranslatedText>
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="px-5 mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            <TranslatedText>Quick Stats</TranslatedText>
          </Text>
          <View className="flex-row">
            <StatCard
              icon={<MapPin size={24} color="#4DBA28" />}
              title="Places"
              value="1,200+"
            />
            <StatCard
              icon={<Users size={24} color="#4DBA28" />}
              title="Travelers"
              value="10K+"
            />
          </View>
          <View className="flex-row mt-3">
            <StatCard
              icon={<Activity size={24} color="#4DBA28" />}
              title="Experiences"
              value="500+"
            />
            <StatCard
              icon={<TrendingUp size={24} color="#4DBA28" />}
              title="Cities"
              value="50+"
            />
          </View>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4 px-5">
            <TranslatedText>Explore Categories</TranslatedText>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {sampleData.categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category}
                onPress={() => console.log("Category pressed:", category)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Places */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-black">
              <TranslatedText>Featured Places</TranslatedText>
            </Text>
            <TouchableOpacity>
              <Text className="text-primary-dark font-medium">
                <TranslatedText>See All</TranslatedText>
              </Text>
            </TouchableOpacity>
          </View>
          {featuredItems.map((place, index) => (
            <PlaceCard
              key={index}
              title={place}
              onPress={() => console.log("Place pressed:", place)}
            />
          ))}
        </View>

        {/* Recent Activity */}
        <View className="px-5 pb-8">
          <Text className="text-lg font-semibold text-black mb-4">
            <TranslatedText>Recent Activity</TranslatedText>
          </Text>
          <View className="bg-white p-4 rounded-lg border border-gray-200">
            <View className="flex-row items-center">
              <Calendar size={20} color="#4DBA28" />
              <Text className="text-gray-600 ml-2">
                <TranslatedText>
                  No recent activity yet. Start exploring!
                </TranslatedText>
              </Text>
            </View>
          </View>
        </View>

        <Button
          variant="outline"
          onPress={handleLogout}
          className="px-8 bg-transparent"
        >
          Logout (Demo)
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}




// import { View, Text } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";
// import { useAppStore } from "@/store/useAppStore";
// import { Button } from "@/components/ui/Button";

// export default function HomeScreen() {
//   const { logout, setHasSeenOnboarding } = useAppStore();

//   const handleLogout = () => {
//     // First logout the user (this will clear user data and set isAuthenticated to false)
//     logout();

//     // Reset onboarding flag for demo purposes
//     setHasSeenOnboarding(false);

//     // Navigate back to the index screen
//     router.replace("/");
//   };

//   return (
//     <SafeAreaView className='flex-1 bg-white'>
//       <View className='flex-1 justify-center items-center px-6'>
//         <Text className='text-3xl font-bold text-navy-900 mb-4 text-center'>
//           Welcome to{"\n"}Descubrelo Colorado!
//         </Text>

//         <Text className='text-gray-600 text-center mb-8'>
//           You&apos;ve successfully signed in. This is where your main app
//           content would go.
//         </Text>

//         <Button
//           variant='outline'
//           onPress={handleLogout}
//           className='px-8 bg-transparent'
//         >
//           Logout (Demo)
//         </Button>
//       </View>
//     </SafeAreaView>
//   );
// }
