// app/(main)/recommendations.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { CategoryService } from "@/services/homeService";
import { MockDataService } from "@/services/mockDataService";
import type { AllDataStructure } from "@/types/homeTypes";
import {
  ChevronLeft,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function RecommendationsScreen() {
  const [recommendations, setRecommendations] = useState<AllDataStructure[]>(
    []
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      // Get both service recommendations and enhanced data
      const serviceItems = CategoryService.getRecommendedItems();
      const enhancedItems = await MockDataService.getEnhancedRecommendations();

      // Combine and deduplicate
      const combinedItems = [...serviceItems, ...enhancedItems];
      const uniqueItems = combinedItems.filter(
        (item, index, array) =>
          array.findIndex((i) => i.id === item.id) === index
      );

      setRecommendations(uniqueItems);
    } catch (error) {
      console.error("Error loading recommendations:", error);
      // Fallback to service items only
      const fallbackItems = CategoryService.getRecommendedItems();
      setRecommendations(fallbackItems);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const handleItemPress = (item: AllDataStructure) => {
    router.push({
      pathname: "/(main)/detail/[id]" as const,
      params: {
        id: item.id,
        type: "explore",
        title: item.title || item.name,
        description: item.description || "",
        location: item.location || "",
        address: item.address || "",
        rating: item.rating?.toString() || "4.5",
        dateRange: item.dateRange || "Available year-round",
        price: item.price?.toString() || "",
        category: item.categories?.[0] || "Attraction",
        phone: item.phone || "",
        openingHours: item.openingHours || "",
        destinationLat: item.latitude?.toString() || "",
        destinationLng: item.longitude?.toString() || "",
      },
    });
  };

  const getPriceLevelText = (priceLevel?: number) => {
    switch (priceLevel) {
      case 1:
        return "$";
      case 2:
        return "$$";
      case 3:
        return "$$$";
      case 4:
        return "$$$$";
      default:
        return "Free";
    }
  };

  const renderRecommendationItem = (item: AllDataStructure, index: number) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      className='mb-5'
      activeOpacity={0.8}
      style={{
        transform: [{ scale: 1 }],
      }}
    >
      <View className='bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100'>
        {/* Image Container */}
        <View className='relative h-56 w-full'>
          <Image
            source={
              item.images && item.images.length > 0
                ? item.images[0]
                : require("@/assets/images/placeholder.png")
            }
            className='w-full h-full'
            resizeMode='cover'
          />

          {/* Gradient Overlay */}
          <View
            className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'
            style={{
              backgroundColor: "transparent",
            }}
          />

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            className='absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm'
            activeOpacity={0.8}
          >
            <Heart
              size={20}
              color={favorites.has(item.id) ? "#EF4444" : "#6B7280"}
              fill={favorites.has(item.id) ? "#EF4444" : "none"}
            />
          </TouchableOpacity>

          {/* Featured Badge */}
          {item.isFeatured && (
            <View className='absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full'>
              <Text className='text-white text-xs font-bold'>
                <TranslatedText>Featured</TranslatedText>
              </Text>
            </View>
          )}

          {/* Rating Badge */}
          {item.rating && (
            <View className='absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded-full flex-row items-center'>
              <Star size={12} color='#FCD34D' fill='#FCD34D' />
              <Text className='text-white text-sm font-semibold ml-1'>
                {item.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Content Container */}
        <View className='p-5'>
          {/* Title */}
          <Text className='text-xl font-bold text-gray-900 mb-2 leading-6'>
            <TranslatedText>
              {(item?.title || item?.name || "").length > 50
                ? (item?.title || item?.name || "").slice(0, 50) + "..."
                : item?.title || item?.name || ""}
            </TranslatedText>
          </Text>

          {/* Description */}
          {item.description && (
            <Text className='text-gray-600 text-sm mb-3 leading-5'>
              <TranslatedText>
                {item.description.length > 120
                  ? item.description.slice(0, 120) + "..."
                  : item.description}
              </TranslatedText>
            </Text>
          )}

          {/* Info Row */}
          <View className='flex-row items-center justify-between mb-3'>
            {/* Location */}
            {item.location && (
              <View className='flex-row items-center flex-1'>
                <MapPin size={14} color='#6B7280' />
                <Text
                  className='text-gray-500 text-sm ml-1 flex-1'
                  numberOfLines={1}
                >
                  <TranslatedText>{item.location}</TranslatedText>
                </Text>
              </View>
            )}

            {/* Price Level */}
            {item.priceLevel && (
              <View className='flex-row items-center ml-4'>
                <DollarSign size={14} color='#059669' />
                <Text className='text-emerald-600 text-sm font-semibold ml-1'>
                  {getPriceLevelText(item.priceLevel)}
                </Text>
              </View>
            )}
          </View>

          {/* Date Range */}
          {item.dateRange && (
            <View className='flex-row items-center mb-3'>
              <Calendar size={14} color='#8B5CF6' />
              <Text className='text-purple-600 text-sm ml-1 font-medium'>
                <TranslatedText>{item.dateRange}</TranslatedText>
              </Text>
            </View>
          )}

          {/* Categories */}
          {item.categories && item.categories.length > 0 && (
            <View className='flex-row flex-wrap'>
              {item.categories.slice(0, 3).map((category, catIndex) => (
                <View
                  key={catIndex}
                  className='bg-blue-50 px-2 py-1 rounded-md mr-2 mb-1'
                >
                  <Text className='text-blue-600 text-xs font-medium'>
                    <TranslatedText>{category}</TranslatedText>
                  </Text>
                </View>
              ))}
              {item.categories.length > 3 && (
                <View className='bg-gray-100 px-2 py-1 rounded-md'>
                  <Text className='text-gray-500 text-xs'>
                    +{item.categories.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  // Loading State
  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-surface'>
        <StatusBar style='auto' />

        {/* Header Background */}
        <View className='absolute -top-16 left-0 right-0'>
          <ImageBackground
            source={require("@/assets/images/top-cloud.png")}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.35,
            }}
            resizeMode='cover'
          />
        </View>

        {/* Header */}
        <View className='flex-row items-center justify-between px-5 py-2 z-10'>
          <View className='flex-row items-center' style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              className='w-8 h-8 bg-white/95 rounded-xl items-center justify-center shadow-sm border border-gray-100'
              activeOpacity={0.8}
            >
              <ChevronLeft size={20} color='#1F2937' />
            </TouchableOpacity>
            <Text className='text-xl font-bold text-gray-900'>
              <TranslatedText>Recommendations</TranslatedText>
            </Text>
          </View>
        </View>

        {/* Loading Content */}
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#6366F1' />
          <Text className='text-gray-500 mt-4 text-center'>
            <TranslatedText>Loading recommendations...</TranslatedText>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-surface'>
      <StatusBar style='dark' />

      {/* Header Background */}
      <View className='absolute -top-16 left-0 right-0'>
        <ImageBackground
          source={require("@/assets/images/top-cloud.png")}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.35,
          }}
          resizeMode='cover'
        />
      </View>

      {/* Header */}
      <View className='flex-row items-center justify-between px-5 py-2 z-10'>
        <View className='flex-row items-center' style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className='w-8 h-8 bg-white/95 rounded-xl items-center justify-center shadow-sm border border-gray-100'
            activeOpacity={0.8}
          >
            <ChevronLeft size={20} color='#1F2937' />
          </TouchableOpacity>
          <Text className='text-xl font-bold text-gray-900'>
            <TranslatedText>Recommendations</TranslatedText>
          </Text>
        </View>

        {/* Count Badge */}
        <View className='bg-indigo-100 px-3 py-1 rounded-full'>
          <Text className='text-indigo-600 text-sm font-semibold'>
            {recommendations.length}{" "}
            {recommendations.length === 1 ? "item" : "items"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className='flex-1 px-5'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='#6366F1'
            colors={["#6366F1"]}
          />
        }
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 100 : 80,
        }}
      >
        {recommendations.length > 0 ? (
          <>
            {/* Subtitle */}
            <Text className='text-gray-600 text-base mb-6 text-center leading-6'>
              <TranslatedText>
                Discover our handpicked recommendations for the best experiences
                in Colorado
              </TranslatedText>
            </Text>

            {/* Recommendations List */}
            {recommendations.map((item, index) =>
              renderRecommendationItem(item, index)
            )}
          </>
        ) : (
          /* Empty State */
          <View className='flex-1 items-center justify-center py-20'>
            <View className='w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-6'>
              <Star size={32} color='#9CA3AF' />
            </View>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              <TranslatedText>No Recommendations Yet</TranslatedText>
            </Text>
            <Text className='text-gray-500 text-center max-w-xs leading-6'>
              <TranslatedText>
                We&lsquo;re working on finding the best recommendations for you.
                Check back soon!
              </TranslatedText>
            </Text>
            <TouchableOpacity
              onPress={onRefresh}
              className='bg-indigo-600 px-6 py-3 rounded-xl mt-6'
              activeOpacity={0.8}
            >
              <Text className='text-white font-semibold'>
                <TranslatedText>Refresh</TranslatedText>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
