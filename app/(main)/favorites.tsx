// app/(main)/favorites.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { Star, Trash2, ChevronLeft, ChevronRight } from "lucide-react-native";
import { MockDataService } from "@/services/mockDataService";
import type { AllDataStructure } from "@/types/homeTypes";
import { StatusBar } from "expo-status-bar";

const { width: screenWidth } = Dimensions.get("window");
const SWIPE_THRESHOLD = screenWidth * 0.3;
const ITEMS_PER_PAGE = 20;

interface FavoriteItem extends AllDataStructure {
  dateAdded: string;
}

// Custom swipeable item component
const SwipeableItem: React.FC<{
  item: FavoriteItem;
  onDelete: (id: string) => void;
  onPress: (item: FavoriteItem) => void;
}> = ({ item, onDelete, onPress }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const handleStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      if (Math.abs(translationX) > SWIPE_THRESHOLD) {
        // Animate out and delete
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: translationX > 0 ? screenWidth : -screenWidth,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          onDelete(item.id);
        });
      } else {
        // Snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const deleteButtonOpacity = translateX.interpolate({
    inputRange: [-screenWidth * 0.3, -50, 0],
    outputRange: [1, 0.8, 0],
    extrapolate: "clamp",
  });

  return (
    <View className="mb-3 relative">
      {/* Delete button background */}
      <Animated.View
        className="absolute right-0 top-0 bottom-0 bg-red-500 rounded-2xl justify-center items-center"
        style={{
          opacity: deleteButtonOpacity,
          width: 80,
        }}
      >
        <Trash2 size={24} color="#ffffff" />
      </Animated.View>

      {/* Main card */}
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
            opacity,
          }}
        >
          <TouchableOpacity
            onPress={() => onPress(item)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm"
            activeOpacity={0.7}
          >
            <View className="flex-row">
              {/* Image */}
              <View className="w-16 h-16 rounded-xl overflow-hidden ml-4 my-4">
                <Image
                  source={
                    item.images?.[0] || require("@/assets/images/hero1.png")
                  }
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Content */}
              <View className="flex-1 px-4 py-4 justify-between">
                <View>
                  <Text
                    className="text-base font-semibold text-gray-900 mb-1"
                    numberOfLines={1}
                  >
                    <TranslatedText>
                      {item.title || item.name || ""}
                    </TranslatedText>
                  </Text>
                  <Text className="text-sm text-gray-500" numberOfLines={1}>
                    <TranslatedText>{item.dateAdded}</TranslatedText>
                  </Text>
                </View>
              </View>

              {/* Star icon */}
              <View className="pr-4 py-4 justify-center">
                <Star size={20} color="#FFB800" fill="#FFB800" />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default function FavoritesScreen() {
  const [allFavorites, setAllFavorites] = useState<FavoriteItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  // Load favorites data
  useEffect(() => {
    loadFavoritesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavoritesData = async () => {
    try {
      setLoading(true);
      // Get static data from MockDataService
      const staticData = await MockDataService.getUnifiedData();

      // Convert to favorites with date added (simulating user's favorites)
      const favorites: FavoriteItem[] = staticData
        .slice(0, 25)
        .map((item, index) => ({
          ...item,
          dateAdded: generateDateAdded(index),
        }));

      setAllFavorites(favorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateDateAdded = (index: number): string => {
    const dates = [
      "12 Mar, 2025",
      "11 Mar, 2025",
      "10 Mar, 2025",
      "09 Mar, 2025",
      "08 Mar, 2025",
      "07 Mar, 2025",
      "06 Mar, 2025",
      "05 Mar, 2025",
    ];
    return dates[index % dates.length] || "12 Mar, 2025";
  };

  const handleItemPress = (item: FavoriteItem) => {
    router.push({
      pathname: "/(main)/detail/[id]" as const,
      params: {
        id: item.id,
        type: item.type || "location",
        title: item.title || item.name || "",
        dateRange: item.dateRange || item.dateAdded,
        rating: item.rating?.toString() || "4.5",
      },
    });
  };

  const removeFavorite = (id: string) => {
    setAllFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const removeAllFavorites = () => {
    Alert.alert(
      "Remove All Favorites",
      "Are you sure you want to remove all favorites? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove All",
          style: "destructive",
          onPress: () => {
            setIsRemoving(true);
            setTimeout(() => {
              setAllFavorites([]);
              setCurrentPage(1);
              setIsRemoving(false);
            }, 300);
          },
        },
      ]
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(allFavorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFavorites = allFavorites.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Previous button
    buttons.push(
      <TouchableOpacity
        key="prev"
        onPress={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-lg items-center justify-center mr-2 ${
          currentPage === 1 ? "bg-gray-100" : "bg-green-500"
        }`}
      >
        <ChevronLeft
          size={20}
          color={currentPage === 1 ? "#9CA3AF" : "#ffffff"}
        />
      </TouchableOpacity>
    );

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => goToPage(i)}
          className={`w-10 h-10 rounded-lg items-center justify-center mr-2 ${
            i === currentPage ? "bg-green-500" : "bg-gray-100"
          }`}
        >
          <Text
            className={`font-medium ${
              i === currentPage ? "text-white" : "text-gray-700"
            }`}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    // Next button
    buttons.push(
      <TouchableOpacity
        key="next"
        onPress={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 rounded-lg items-center justify-center ${
          currentPage === totalPages ? "bg-gray-100" : "bg-green-500"
        }`}
      >
        <ChevronRight
          size={20}
          color={currentPage === totalPages ? "#9CA3AF" : "#ffffff"}
        />
      </TouchableOpacity>
    );

    return (
      <View className="flex-row justify-center items-center py-4">
        {buttons}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="mt-2 text-gray-600">
            <TranslatedText>Loading favorites...</TranslatedText>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

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

      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <View className="flex-row items-center " style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-8 h-8 bg-white/40 rounded-full items-center justify-center p-2 border border-[#E6E6E6]"
            >
              <ChevronLeft size={20} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-black">
              <TranslatedText>Favorite</TranslatedText>
            </Text>
          </View>
          <View>
            {allFavorites.length > 0 && (
              <TouchableOpacity
                onPress={removeAllFavorites}
                disabled={isRemoving}
                className="flex-row items-center"
              >
                <Trash2 size={18} color="#EF4444" />
                <Text className="text-red-500 font-medium ml-1">
                  <TranslatedText>Remove All</TranslatedText>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {allFavorites.length > 0 ? (
          <View className="flex-1">
            <ScrollView
              className="flex-1 px-5"
              showsVerticalScrollIndicator={false}
            >
              <View className="py-4">
                {currentFavorites.map((item) => (
                  <SwipeableItem
                    key={item.id}
                    item={item}
                    onDelete={removeFavorite}
                    onPress={handleItemPress}
                  />
                ))}
              </View>
            </ScrollView>

            {/* Pagination */}
            {renderPaginationButtons()}

            {/* Page info */}
            <View className="px-5 pb-4">
              <Text className="text-center text-sm text-gray-500">
                <TranslatedText>
                  {`Page ${currentPage} of ${totalPages} • ${allFavorites.length} total items`}
                </TranslatedText>
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center px-5">
            <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-4">
              <Star size={32} color="#9CA3AF" />
            </View>
            <Text className="text-gray-900 text-xl font-semibold text-center mb-2">
              <TranslatedText>No favorites yet</TranslatedText>
            </Text>
            <Text className="text-gray-500 text-center">
              <TranslatedText>
                Start exploring and add places to your favorites!
              </TranslatedText>
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(main)/explore")}
              className="mt-6 bg-green-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">
                <TranslatedText>Explore Now</TranslatedText>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
