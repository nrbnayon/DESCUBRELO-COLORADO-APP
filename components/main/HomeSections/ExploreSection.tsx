import type React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type { ExploreSectionProps, AllDataStructure } from "@/types/homeTypes";
import { createShadow } from "@/utils/shadows";

export const ExploreSection: React.FC<ExploreSectionProps> = ({
  items,
  title = "Explore",
  onItemPress,
  showTitle = true,
  showSeeAll = true,
  onSeeAllExplore,
  columns = 2,
  containerClassName = "",
}) => {
  const handleItemPress = (item: AllDataStructure) => {
    if (onItemPress) {
      onItemPress(item);
    }
  };

  const handleSeeAllExplore = () => {
    if (onSeeAllExplore) {
      onSeeAllExplore();
    }
  };
  const getItemWidthClass = () => {
    // This class will be applied to the TouchableOpacity for width control
    return columns === 1 ? "w-full" : "w-[48%]";
  };

  const renderExploreItem = (item: AllDataStructure) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      className={`${getItemWidthClass()} mb-4 flex-row items-center p-2 bg-white rounded-lg border-0`}
      style={[
        { gap: 8 },
        createShadow({ x: 0, y: 4, blur: 14.9, opacity: 0.08, elevation: 2 }),
      ]}
      activeOpacity={0.1}
    >
      <View className="w-16 h-16 rounded-base overflow-hidden flex-shrink-0">
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
      <View className="flex-col">
        <Text className="font-semibold text-base" style={{ color: "#234D1A" }}>
          <TranslatedText>
            {(item?.title || item?.name || "").length > 10
              ? (item?.title || item?.name || "").slice(0, 9) + "..."
              : item?.title || item?.name || ""}
          </TranslatedText>
        </Text>
        <Text className="text-sm text-gray-500">
          <TranslatedText>{`${item.eventCount} Events`}</TranslatedText>
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View className={`mb-5 ${containerClassName}`}>
      <View className="flex-row items-center justify-between mb-4 px-5">
        {showTitle && (
          <Text className="text-xl font-bold text-black">
            <TranslatedText>{title}</TranslatedText>
          </Text>
        )}
        {showSeeAll && (
          <TouchableOpacity onPress={handleSeeAllExplore} activeOpacity={0.7}>
            <Text className="text-green-500 font-semibold text-base">
              <TranslatedText>See All</TranslatedText>
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        className={`flex-row flex-wrap ${columns === 1 ? "" : "justify-between"} px-5`}
      >
        {items.map(renderExploreItem)}
      </View>
    </View>
  );
};
