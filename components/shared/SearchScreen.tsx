// components/shared/SearchScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Search, X } from "lucide-react-native";
import { TranslatedText } from "@/components/ui/TranslatedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExploreSection } from "../main/HomeSections/ExploreSection";
import { AllDataStructure } from "@/types/homeTypes";
import { MockDataService } from "@/services/mockDataService";

interface SearchScreenProps {
  visible: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = "recent_searches";
const POPULAR_SEARCHES_KEY = "popular_searches";
const MAX_RECENT_SEARCHES = 10;

export function SearchScreen({ visible, onClose }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<AllDataStructure[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [exploreItems, setExploreItems] = useState<AllDataStructure[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadRecentSearches();
      loadPopularSearches();
      loadData();
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadData = async () => {
    try {
      // Load explore items from MockDataService with await
      const items = await MockDataService.getExploreItemsByCategory("Hiking");
      setExploreItems(items);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleExploreItemPress = (item: AllDataStructure) => {
    console.log("Explore item pressed:", item.title);
    // Navigate to explore detail screen
    router.push({
      pathname: "/(main)/detail/[id]",
      params: {
        id: item.id,
        type: "explore",
        title: item.title ?? "",
        description: item.description ?? "",
        location: item.location ?? "",
        rating: item.rating?.toString() ?? "0",
      },
    });
  };

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const loadPopularSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(POPULAR_SEARCHES_KEY);
      if (stored) {
        setPopularSearches(JSON.parse(stored));
      } else {
        // Initialize with default popular searches
        const defaultPopularSearches = [
          "Hiking trails",
          "Colorado attractions",
          "Local restaurants",
          "Outdoor adventures",
          "Cultural events",
          "National parks",
        ];
        setPopularSearches(defaultPopularSearches);
        await AsyncStorage.setItem(
          POPULAR_SEARCHES_KEY,
          JSON.stringify(defaultPopularSearches)
        );
      }
    } catch (error) {
      console.error("Error loading popular searches:", error);
      // Fallback to default if error
      setPopularSearches([
        "Hiking trails",
        "Colorado attractions",
        "Local restaurants",
        "Outdoor adventures",
        "Cultural events",
        "National parks",
      ]);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const updatedSearches = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, MAX_RECENT_SEARCHES);

      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const removeRecentSearch = async (query: string) => {
    try {
      const updatedSearches = recentSearches.filter((s) => s !== query);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error("Error removing recent search:", error);
    }
  };

  const removePopularSearch = async (query: string) => {
    try {
      const updatedSearches = popularSearches.filter((s) => s !== query);
      await AsyncStorage.setItem(
        POPULAR_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
      setPopularSearches(updatedSearches);
    } catch (error) {
      console.error("Error removing popular search:", error);
    }
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);

    try {
      // Use MockDataService.searchContent to get real search results with await
      const results = await MockDataService.searchContent(query);
      // Combine all results (hiking, travels, recommendations, locations) into a single array
      const combinedResults = [
        ...results.hiking,
        ...results.travels,
        ...results.recommendations,
        ...results.locations,
      ];
      // Remove duplicates based on id
      const uniqueResults = Array.from(
        new Map(combinedResults.map((item) => [item.id, item])).values()
      );
      setSearchResults(uniqueResults);
    } catch (error) {
      console.error("Error performing search:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      performSearch(searchQuery.trim());
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    saveRecentSearch(suggestion);
    performSearch(suggestion);
  };

  // Function to demonstrate how searches are automatically added
  const addNewSearchToHistory = (searchTerm: string) => {
    saveRecentSearch(searchTerm);
  };

  // Clear all recent searches function
  const clearAllRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  // Clear all popular searches function
  const clearAllPopularSearches = async () => {
    try {
      await AsyncStorage.removeItem(POPULAR_SEARCHES_KEY);
      setPopularSearches([]);
    } catch (error) {
      console.error("Error clearing popular searches:", error);
    }
  };

  const handleResultPress = (result: AllDataStructure) => {
    addNewSearchToHistory(result.title ?? "");
    onClose();

    // Navigate based on result type
    router.push({
      pathname: "/(main)/detail/[id]",
      params: {
        id: result.id,
        type: result.type ?? "place",
        title: result.title ?? "",
        description: result.description ?? "",
        location: result.location ?? "",
        rating: result.rating?.toString() ?? "0",
      },
    });
  };

  const renderSearchResult = ({ item }: { item: AllDataStructure }) => (
    <TouchableOpacity
      onPress={() => handleResultPress(item)}
      className='flex-row p-3 mb-3 bg-white rounded-base mx-4'
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <Image
        source={
          item.images && item.images.length > 0
            ? item.images[0]
            : require("@/assets/images/placeholder.png")
        }
        className='w-16 h-16 rounded-base mr-3'
        resizeMode='cover'
      />
      <View className='flex-1 justify-center'>
        <Text
          className='text-gray-800 font-semibold text-base mb-1'
          numberOfLines={2}
        >
          <TranslatedText>{item.title || item?.name || ""}</TranslatedText>
        </Text>
        {item.dateRange && (
          <Text className='text-gray-500 text-sm'>
            <TranslatedText>{item.dateRange}</TranslatedText>
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (!visible) return null;

  const handleRecommendedSeeAll = () => {
    console.log("See all recommended pressed");
    router.push("/(main)/recommendations");
  };

  const handleExploreSeeAll = () => {
    console.log("See all explore pressed");
    router.push("/(main)/explore");
  };

  return (
    <SafeAreaView className='flex-1 bg-surface mb-5 rounded-xl'>
      {/* Header */}
      <View className='flex flex-row items-center justify-between px-4 py-3 rounded--t-xl bg-white border-b border-gray-100'>
        <View className='w-9 h-9 bg-white/40 rounded-full border border-[#E6E6E6] items-center justify-center p-2'>
          <TouchableOpacity onPress={onClose}>
            <ChevronLeft size={24} color='#374151' />
          </TouchableOpacity>
        </View>
        <Text className='text-xl font-semibold text-gray-800 ml-3'>
          <TranslatedText>Search</TranslatedText>
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className='w-9 h-9 bg-white/40 rounded-full items-center justify-center p-2 border border-[#E6E6E6]'
        >
          <X size={24} color='#FF0000' />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View className='px-4 py-3 bg-white'>
        <View className='flex-row items-center bg-gray-100 rounded-base px-4 py-2'>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder='Search here'
            placeholderTextColor='#9CA3AF'
            className='flex-1 text-gray-800 text-base'
            autoFocus
            onSubmitEditing={handleSearchSubmit}
            returnKeyType='search'
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className='ml-2'
            >
              <X size={20} color='#9CA3AF' />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={handleSearchSubmit} className='ml-2'>
            <Search size={20} color='#4DBA28' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {searchQuery.trim() ? (
          // Search Results
          <View className='pt-4'>
            {/* Results Header */}
            <View className='flex-row items-center justify-between px-4 mb-4'>
              <Text className='text-lg font-semibold text-gray-800'>
                <TranslatedText>Best Locations to go</TranslatedText>
              </Text>
              <TouchableOpacity onPress={() => setSearchResults([])}>
                <X size={20} color='#9CA3AF' />
              </TouchableOpacity>
            </View>

            {isSearching ? (
              <View className='p-4'>
                <Text className='text-gray-500 text-center'>
                  <TranslatedText>Searching...</TranslatedText>
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className='p-4'>
                <Text className='text-gray-500 text-center'>
                  <TranslatedText>No results found</TranslatedText>
                </Text>
              </View>
            )}
          </View>
        ) : (
          // Default content when no search query
          <View className='pt-4'>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View className='mb-6'>
                <View className='flex-row items-center justify-between px-4 mb-4'>
                  <Text className='text-lg font-semibold text-gray-800'>
                    <TranslatedText>Recent Searches</TranslatedText>
                  </Text>
                  <TouchableOpacity onPress={clearAllRecentSearches}>
                    <Text className='text-red-500 text-sm font-medium'>
                      <TranslatedText>Clear All</TranslatedText>
                    </Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={`recent-${index}`}
                    onPress={() => handleSuggestionPress(search)}
                    className='flex-row items-center justify-between px-4 py-3'
                  >
                    <View className='flex-row items-center flex-1'>
                      <Search size={16} color='#9CA3AF' />
                      <Text className='text-gray-700 ml-3 flex-1'>
                        <TranslatedText>{search}</TranslatedText>
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(search);
                      }}
                      className='p-1'
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <X size={16} color='#9CA3AF' />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Popular Searches */}
            {popularSearches.length > 0 && (
              <View className='mb-6'>
                <View className='flex-row items-center justify-between px-4 mb-4'>
                  <Text className='text-lg font-semibold text-gray-800'>
                    <TranslatedText>Popular Searches</TranslatedText>
                  </Text>
                  <TouchableOpacity onPress={clearAllPopularSearches}>
                    <Text className='text-red-500 text-sm font-medium'>
                      <TranslatedText>Clear All</TranslatedText>
                    </Text>
                  </TouchableOpacity>
                </View>
                {popularSearches.map((suggestion, index) => (
                  <TouchableOpacity
                    key={`popular-${index}`}
                    onPress={() => handleSuggestionPress(suggestion)}
                    className='flex-row items-center justify-between px-4 py-3'
                  >
                    <View className='flex-row items-center flex-1'>
                      <Search size={16} color='#9CA3AF' />
                      <Text className='text-gray-700 ml-3 flex-1'>
                        <TranslatedText>{suggestion}</TranslatedText>
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        removePopularSearch(suggestion);
                      }}
                      className='p-1'
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <X size={16} color='#9CA3AF' />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Explore Categories */}
            <ExploreSection
              items={exploreItems}
              title='Explore'
              onItemPress={handleExploreItemPress}
              showTitle={true}
              columns={2}
              showSeeAll={true}
              onSeeAllExplore={handleExploreSeeAll}
            />

            {/* Recommended Section Header */}
            <View className='flex-row items-center justify-between px-4 mb-4'>
              <Text className='text-lg font-semibold text-gray-800'>
                <TranslatedText>Recommended</TranslatedText>
              </Text>
              <TouchableOpacity onPress={handleRecommendedSeeAll}>
                <Text className='text-green-500 font-medium'>
                  <TranslatedText>See All</TranslatedText>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
