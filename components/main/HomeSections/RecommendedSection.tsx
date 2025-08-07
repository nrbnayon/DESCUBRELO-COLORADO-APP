// components/main/HomeSections/RecommendedSection.tsx
import type React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type {
  RecommendedSectionProps,
  AllDataStructure,
} from "@/types/homeTypes";

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  items,
  title = "Recommended",
  onItemPress,
  showTitle = true,
  showSeeAll = true,
  onSeeAllPress,
  containerClassName = "",
}) => {
  const handleItemPress = (item: AllDataStructure) => {
    if (onItemPress) {
      onItemPress(item);
    }
  };

  const handleSeeAllPress = () => {
    if (onSeeAllPress) {
      onSeeAllPress();
    }
  };

  const renderRecommendedItem = (item: AllDataStructure) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      className="mr-4"
      activeOpacity={0.7}
      style={{ width: 160 }} // Fixed width matching the design
    >
      {/* Image Container */}
      <View className="w-full h-32 rounded-2xl overflow-hidden mb-3">
        <Image
          source={
            item.images && item.images.length > 0
              ? item.images[0]
              : require("@/assets/images/placeholder.png")
          }
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Text Content */}
      <View className="px-1">
        <Text className="text-black font-bold text-lg mb-1 leading-tight">
          <TranslatedText>
            {(item?.title || item?.name || "").length > 12
              ? (item?.title || item?.name || "").slice(0, 12) + "..."
              : item?.title || item?.name || ""}
          </TranslatedText>
        </Text>
        <Text className="text-gray-400 text-sm font-normal">
          <TranslatedText>{item.dateRange || ""}</TranslatedText>
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => {
    if (!showTitle) return null;
    return (
      <View className="flex-row items-center justify-between mb-4 px-5">
        <Text className="text-2xl font-bold text-black">
          <TranslatedText>{title}</TranslatedText>
        </Text>
        {showSeeAll && (
          <TouchableOpacity onPress={handleSeeAllPress} activeOpacity={0.7}>
            <Text className="text-green-500 font-semibold text-base">
              <TranslatedText>See All</TranslatedText>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Return null if no items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View className={`mb-6 ${containerClassName}`}>
      {renderHeader()}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingRight: 40, // Extra padding for last item
        }}
        style={{ flexGrow: 0 }} // Prevent scroll view from taking full height
      >
        {items.map(renderRecommendedItem)}
      </ScrollView>
    </View>
  );
};
