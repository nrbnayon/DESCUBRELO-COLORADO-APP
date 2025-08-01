// app/(main)/home.tsx
import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { SearchInput } from "@/components/shared/SearchInput";
import { useAppStore } from "@/store/useAppStore";
import { Bell } from "lucide-react-native";
import { CategoryService } from "@/services/homeService";
import type {
  Category,
  ExploreItem,
  RecommendedItem,
  HeroSlide,
} from "@/types/homeTypes";
import { HeroSlider } from "@/components/main/HomeSections/HeroSlider";
import { DynamicCategoriesSection } from "@/components/main/HomeSections/DynamicCategoriesSection";
import { RecommendedSection } from "@/components/main/HomeSections/RecommendedSection";
import { ExploreSection } from "@/components/main/HomeSections/ExploreSection";

export default function HomeScreen() {
  const { user } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Data from service
  const [categories, setCategories] = useState<Category[]>([]);
  const [exploreItems, setExploreItems] = useState<ExploreItem[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<RecommendedItem[]>(
    []
  );
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // In real app, these would be API calls
      setCategories(CategoryService.getCategoriesByPriority());
      setExploreItems(CategoryService.getExploreItems());
      setRecommendedItems(CategoryService.getRecommendedItems());
      setHeroSlides(CategoryService.getHeroSlides());
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: Category) => {
    console.log("Category pressed:", category.name);
    // Navigate to category screen
    // router.push(`/(main)/category/${category.id}`);
  };

  const handleExploreItemPress = (item: ExploreItem) => {
    console.log("Explore item pressed:", item.title);
    // Navigate to explore detail screen
    // router.push(`/(main)/explore/${item.id}`);
  };

  const handleRecommendedItemPress = (item: RecommendedItem) => {
    console.log("Recommended item pressed:", item.title);
    // Navigate to recommended detail screen
    // router.push(`/(main)/recommended/${item.id}`);
  };

  const handleHeroSlidePress = (slide: HeroSlide) => {
    console.log("Hero slide pressed:", slide.title);
    // Navigate to slide action URL
    // if (slide.actionUrl) {
    //   router.push(slide.actionUrl);
    // }
  };

  const handleRecommendedSeeAll = () => {
    console.log("See all recommended pressed");
    // Navigate to recommended list screen
    // router.push("/(main)/recommended");
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 2) {
      // Perform search
      const searchResults = CategoryService.searchCategories(text);
      console.log("Search results:", searchResults);
    }
  };

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Background */}
      <View className="absolute top-0 left-0 right-0">
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
      <View className="px-5 py-3 z-10">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-sm text-gray-600 mb-1">
              <TranslatedText>
                {user ? `Welcome, ${user.name}!` : "Welcome, Daniel!"}
              </TranslatedText>
            </Text>
            <Text className="text-2xl font-bold text-black">
              <TranslatedText>Explore Colorado</TranslatedText>
            </Text>
          </View>
          <View className="flex-row items-center space-x-3">
            <View className="w-9 h-9 bg-white/40 rounded-full border border-[#E6E6E6] items-center justify-center p-2">
              <Image
                source={require("@/assets/images/us-flag.png")}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity className="relative w-9 h-9 bg-white/40 rounded-full border border-[#E6E6E6] items-center justify-center p-2">
              <Bell size={20} color="#333" />
              <View className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <SearchInput
          placeholder="Search here"
          value={searchText}
          onChangeText={handleSearch}
          className="mb-4 bg-white rounded-base"
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Slider - Remove px-5 here to make it full width */}
        <HeroSlider
          slides={heroSlides}
          onSlidePress={handleHeroSlidePress}
          autoPlay={true}
          autoPlayInterval={5000}
          showIndicators={true}
        />

        {/* Dynamic Categories Section */}
        <DynamicCategoriesSection
          categories={categories}
          categoryShow={12}
          title="Categories"
          onCategoryPress={handleCategoryPress}
          showTitle={true}
          columns={5}
          showMoreText="Show More"
          showLessText="Show Less"
          showMoreIcon="⬇️"
          showLessIcon="⬆️"
        />

        {/* Explore Section */}
        <ExploreSection
          items={exploreItems}
          title="Explore"
          onItemPress={handleExploreItemPress}
          showTitle={true}
          columns={2}
        />

        {/* Recommended Section */}
        <RecommendedSection
          items={recommendedItems}
          title="Recommended"
          onItemPress={handleRecommendedItemPress}
          showTitle={true}
          showSeeAll={true}
          onSeeAllPress={handleRecommendedSeeAll}
        />

        {/* Bottom Padding for Tab Bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
