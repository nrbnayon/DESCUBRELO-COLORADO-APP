// app/(main)/explore.tsx
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { SearchInput } from "@/components/shared/SearchInput";
import { ChevronLeft, Calendar, Star, X, Search } from "lucide-react-native";
import { AllDataStructure } from "@/types/homeTypes";

// Enhanced explore data with all categories
const exploreData: AllDataStructure[] = [
  // Hiking Category
  {
    id: "hiking-1",
    title: "Explore Colorado with the best and good locations here.",
    description:
      "Discover the most breathtaking hiking trails in Colorado with stunning mountain views and pristine wilderness.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/images/hero1.png")],
    rating: 4.8,
    categories: ["hiking"],
    isFeatured: false,
  },
  {
    id: "hiking-2",
    title: "Find the finest and greatest places",
    description:
      "Experience the beauty of Colorado's natural landscapes with guided tours to the most scenic locations.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/images/hero2.png")],
    rating: 4.9,
    categories: ["hiking"],
    isFeatured: true,
  },
  {
    id: "hiking-3",
    title: "The best sunset and sky view from the top of the hill of Colorado!",
    description:
      "Witness spectacular sunsets from Colorado's highest peaks with panoramic views that will take your breath away.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/images/hero3.png")],
    rating: 4.7,
    categories: ["hiking"],
    isFeatured: false,
  },

  // Food Category
  {
    id: "food-1",
    title: "Best Local Restaurants and Cafes in Colorado",
    description:
      "Discover amazing local cuisine and hidden culinary gems across Colorado.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend1.png")],
    rating: 4.6,
    categories: ["food"],
    isFeatured: false,
  },
  {
    id: "food-2",
    title: "Farm to Table Dining Experiences",
    description:
      "Experience fresh, locally sourced ingredients in Colorado's finest restaurants.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend2.png")],
    rating: 4.8,
    categories: ["food"],
    isFeatured: false,
  },
  {
    id: "food-3",
    title: "Colorado Craft Beer and Brewery Tours",
    description:
      "Explore Colorado's thriving craft beer scene with guided brewery tours.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend3.png")],
    rating: 4.7,
    categories: ["food"],
    isFeatured: true,
  },

  // Store Category
  {
    id: "store-1",
    title: "Local Artisan Shops and Markets",
    description:
      "Find unique handcrafted items and local products in Colorado's artisan shops.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend4.png")],
    rating: 4.5,
    categories: ["store"],
    isFeatured: false,
  },
  {
    id: "store-2",
    title: "Colorado Outdoor Gear Stores",
    description:
      "Get equipped for your Colorado adventures at the best outdoor gear stores.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend5.png")],
    rating: 4.7,
    categories: ["store"],
    isFeatured: false,
  },
  {
    id: "store-3",
    title: "Vintage and Antique Shopping Districts",
    description:
      "Discover unique vintage finds and antiques in Colorado's historic districts.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend6.png")],
    rating: 4.4,
    categories: ["store"],
    isFeatured: false,
  },

  // Concert Category
  {
    id: "concert-1",
    title: "Red Rocks Amphitheatre Events",
    description:
      "Experience world-class performances at Colorado's iconic Red Rocks venue.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/images/hero1.png")],
    rating: 4.9,
    categories: ["concert"],
    isFeatured: true,
  },
  {
    id: "concert-2",
    title: "Denver Music Scene and Live Venues",
    description:
      "Explore Denver's vibrant music scene with live performances across the city.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/images/hero2.png")],
    rating: 4.6,
    categories: ["concert"],
    isFeatured: false,
  },

  // Towns Category
  {
    id: "towns-1",
    title: "Historic Mountain Towns of Colorado",
    description:
      "Visit charming historic mountain towns with rich Colorado heritage.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/images/hero3.png")],
    rating: 4.8,
    categories: ["towns"],
    isFeatured: false,
  },
  {
    id: "towns-2",
    title: "Aspen and Vail: Luxury Mountain Destinations",
    description:
      "Experience luxury and natural beauty in Colorado's premier mountain towns.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend1.png")],
    rating: 4.7,
    categories: ["towns"],
    isFeatured: false,
  },

  // Events Category
  {
    id: "events-1",
    title: "Colorado Festivals and Seasonal Events",
    description:
      "Join exciting festivals and events happening throughout Colorado.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend2.png")],
    rating: 4.6,
    categories: ["events"],
    isFeatured: false,
  },
  {
    id: "events-2",
    title: "Summer Music Festivals in the Rockies",
    description:
      "Dance and sing along at Colorado's amazing summer music festivals.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend3.png")],
    rating: 4.8,
    categories: ["events"],
    isFeatured: true,
  },

  // Resources Category
  {
    id: "resources-1",
    title: "Colorado Visitor Centers and Information",
    description:
      "Get helpful information and resources for your Colorado adventure.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend4.png")],
    rating: 4.5,
    categories: ["resources"],
    isFeatured: false,
  },
  {
    id: "resources-2",
    title: "Emergency Services and Safety Information",
    description:
      "Stay safe with important emergency contacts and safety resources.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend5.png")],
    rating: 4.7,
    categories: ["resources"],
    isFeatured: false,
  },

  // Attractions Category
  {
    id: "attractions-1",
    title: "Colorado National Parks and Monuments",
    description:
      "Explore Colorado's stunning national parks and historic monuments.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/recommend/recommend6.png")],
    rating: 4.9,
    categories: ["attraction"],
    isFeatured: false,
  },

  // Local Business Category
  {
    id: "business-1",
    title: "Support Local Colorado Businesses",
    description:
      "Discover and support amazing local businesses across Colorado.",
    dateRange: "Jun 30 2025",
    images: [require("@/assets/images/hero1.png")],
    rating: 4.6,
    categories: ["local business"],
    isFeatured: false,
  },
];

// Skeleton component for loading state
const SkeletonItem = () => (
  <View className='mb-4'>
    <View className='bg-white rounded-lg overflow-hidden shadow-sm'>
      <View className='relative h-72'>
        {/* Image skeleton */}
        <View className='w-full h-full bg-gray-200 animate-pulse' />

        {/* Rating badge skeleton */}
        <View className='absolute top-4 left-4 bg-gray-300 rounded-full px-2 py-1 w-12 h-6 animate-pulse' />

        {/* Favorite button skeleton */}
        <View className='absolute top-4 right-4 w-10 h-10 bg-gray-300 rounded-full animate-pulse' />

        {/* Content overlay skeleton */}
        <View className='absolute bottom-0 left-0 right-0 p-4'>
          <View className='bg-gray-300 h-6 w-3/4 mb-2 rounded animate-pulse' />
          <View className='bg-gray-300 h-4 w-1/2 mb-2 rounded animate-pulse' />
          <View className='flex-row items-center justify-between'>
            <View className='bg-gray-300 h-4 w-1/3 rounded animate-pulse' />
            <View className='bg-gray-300 h-6 w-16 rounded-full animate-pulse' />
          </View>
        </View>
      </View>
    </View>
  </View>
);

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filteredData, setFilteredData] = useState(exploreData);

  // Get category from navigation params with proper type handling
  const selectedCategory =
    typeof params.category === "string" ? params.category : "";
  const categoryName =
    typeof params.categoryName === "string" ? params.categoryName : "";

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const clearSearch = () => {
    setSearchText("");
  };

  const clearCategoryFilter = () => {
    // Clear category filter by updating route params
    router.setParams({ category: "all", categoryName: "" });
  };

  const filterData = useCallback(() => {
    let filtered = exploreData;

    // Filter by category if specified
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((item) =>
        item.categories?.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((item) => {
        const title = item.title || item.name || "";
        const description = item.description || "";
        const categories = item.categories || [];

        return (
          title.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower) ||
          categories.some((cat) => cat.toLowerCase().includes(searchLower))
        );
      });
    }

    setFilteredData(filtered);
  }, [searchText, selectedCategory]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handleItemPress = (item: AllDataStructure) => {
    router.push({
      pathname: "/(main)/detail/[id]" as const,
      params: {
        id: item.id,
        itemData: JSON.stringify({
          id: item.id,
          type: "explore",
          title: item.title || item.name || "Untitled",
          name: item.name || item.title || "Untitled",
          description: item.description || "",
          location: item.location || "",
          address: item.address || "",
          rating: item.rating || 4.5,
          dateRange: item.dateRange || "Available year-round",
          price: item.price,
          priceLevel: item.priceLevel,
          category: item.categories?.[0] || "Attraction",
          categories: item.categories || [],
          phone: item.phone || "",
          openingHours: item.openingHours || "",
          latitude: item.latitude,
          longitude: item.longitude,
          images: item.images || [],
          socialLinks: item.socialLinks,
          eventCount: item.eventCount,
          isFeatured: item.isFeatured || false,
          offlineSupported: item.offlineSupported,
          offlineData: item.offlineData,
        }),
      },
    });
  };

  // Group filtered data by category for better organization
  const groupedData = filteredData.reduce(
    (acc, item) => {
      const primaryCategory = item.categories?.[0] || "other";
      const categoryKey =
        primaryCategory.charAt(0).toUpperCase() + primaryCategory.slice(1);
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(item);
      return acc;
    },
    {} as Record<string, typeof exploreData>
  );

  const renderExploreItem = (item: AllDataStructure) => {
    const title = item.title || item.name || "Untitled";
    const rating = item.rating || 4.5;
    const dateRange = item.dateRange || "Available";
    const primaryCategory = item.categories?.[0] || "attraction";
    const imageSource =
      item.images?.[0] || require("@/assets/images/hero1.png");

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleItemPress(item)}
        className='mb-4'
        activeOpacity={0.7}
      >
        <View className='bg-white rounded-lg overflow-hidden shadow-sm'>
          <View className='relative h-72'>
            <Image
              source={imageSource}
              className='w-full h-full'
              resizeMode='cover'
            />
            <View className='absolute inset-0 bg-black/30' />

            {/* Rating badge */}
            <View className='absolute top-4 left-4 bg-black/50 rounded-full px-2 py-1 flex-row items-center'>
              <Star size={12} color='#FFD700' fill='#FFD700' />
              <Text className='text-white text-xs ml-1 font-medium'>
                {rating.toFixed(1)}
              </Text>
            </View>

            {/* Favorite button */}
            <TouchableOpacity
              onPress={() => toggleFavorite(item.id)}
              className='absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full items-center justify-center'
            >
              <Star
                size={20}
                color={favorites.has(item.id) ? "#FFD700" : "white"}
                fill={favorites.has(item.id) ? "#FFD700" : "transparent"}
              />
            </TouchableOpacity>

            {/* Content overlay */}
            <View className='absolute bottom-0 left-0 right-0 p-4'>
              <Text className='text-white text-lg font-bold mb-2 leading-tight'>
                <TranslatedText>{title}</TranslatedText>
              </Text>
              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center flex-1'>
                  <Calendar size={16} color='white' />
                  <Text className='text-white text-sm ml-2'>
                    <TranslatedText>{dateRange}</TranslatedText>
                  </Text>
                </View>
                <View className='bg-white/20 rounded-full px-2 py-1'>
                  <Text className='text-white text-xs font-medium capitalize'>
                    {primaryCategory}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Get page title with proper type handling
  const getPageTitle = (): string => {
    if (categoryName) {
      return categoryName;
    }
    if (selectedCategory && selectedCategory !== "all") {
      return (
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
      );
    }
    return "Explore";
  };

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  return (
    <SafeAreaView className='flex-1 bg-surface'>
      <View className='absolute top-0 left-0 right-0'>
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
      <View className='flex-row items-center justify-between px-5 py-3'>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className='w-10 h-10 bg-white/40 rounded-full items-center justify-center p-2 border border-[#E6E6E6]'
        >
          <ChevronLeft size={24} color='#1F2937' />
        </TouchableOpacity>

        {/* Centered title */}
        <Text className='text-xl font-bold text-black'>
          <TranslatedText>{getPageTitle()}</TranslatedText>
        </Text>

        {/* Right side filler with same width as the back button */}
        <View className='w-9 h-9' />
      </View>

      {/* Search */}
      <View className='px-5 py-1'>
        <View className='relative'>
          <SearchInput
            placeholder={`Search in ${getPageTitle().toLowerCase()}...`}
            value={searchText}
            onChangeText={setSearchText}
            className='bg-white'
            iconShow={false}
          />
          {/* Search/Clear icon */}
          <TouchableOpacity
            onPress={searchText.length > 0 ? clearSearch : undefined}
            className='absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center'
          >
            {searchText.length > 0 ? (
              <View className='w-6 h-6 bg-gray-400/20 rounded-full items-center justify-center'>
                <X size={16} color='#6B7280' />
              </View>
            ) : (
              <Search size={20} color='#4DBA28' />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Results count */}
      <View className='px-5 py-2 border-b border-gray-100'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-sm text-gray-600 flex-1'>
            <TranslatedText>
              {(() => {
                if (loading) {
                  return "Loading...";
                }

                let text = `${filteredData.length} ${filteredData.length === 1 ? "result" : "results"} found`;

                if (selectedCategory && selectedCategory !== "all") {
                  text += ` in ${getPageTitle()}`;
                }

                if (searchText) {
                  text += ` for "${searchText}"`;
                }

                return text;
              })()}
            </TranslatedText>
          </Text>

          {/* Clear category filter button */}
          {selectedCategory && selectedCategory !== "all" && (
            <TouchableOpacity
              onPress={clearCategoryFilter}
              className='ml-3 bg-gray-100 rounded-full px-3 py-1 flex-row items-center'
            >
              <X size={12} color='#6B7280' />
              <Text className='text-xs text-gray-600 ml-1'>
                <TranslatedText>Clear</TranslatedText>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          // Loading skeleton
          <View className='px-5 py-4'>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonItem key={index} />
            ))}
          </View>
        ) : filteredData.length === 0 ? (
          <View className='flex-1 items-center justify-center py-20'>
            <Text className='text-gray-500 text-center text-lg mb-2'>
              <TranslatedText>No results found</TranslatedText>
            </Text>
            <Text className='text-gray-400 text-center px-8'>
              <TranslatedText>
                Try adjusting your search terms or browse all categories
              </TranslatedText>
            </Text>
          </View>
        ) : (
          Object.entries(groupedData).map(([category, items]) => (
            <View key={category} className='px-5 py-4'>
              {/* Only show category header if not filtering by specific category */}
              {(!selectedCategory || selectedCategory === "all") && (
                <Text className='text-2xl font-bold text-black mb-4'>
                  <TranslatedText>{category}</TranslatedText>
                </Text>
              )}
              {items.map(renderExploreItem)}
            </View>
          ))
        )}

        {/* Bottom padding */}
        <View className='h-5' />
      </ScrollView>
    </SafeAreaView>
  );
}
