import type React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type { ExploreSectionProps, ExploreItem } from "@/types/homeTypes";
import { createShadow } from "@/utils/shadows";

export const ExploreSection: React.FC<ExploreSectionProps> = ({
  items,
  title = "Explore",
  onItemPress,
  showTitle = true,
  columns = 2,
  containerClassName = "",
}) => {
  const handleItemPress = (item: ExploreItem) => {
    if (onItemPress) {
      onItemPress(item);
    }
  };

  const getItemWidthClass = () => {
    // This class will be applied to the TouchableOpacity for width control
    return columns === 1 ? "w-full" : "w-[48%]";
  };

  const renderExploreItem = (item: ExploreItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      className={`${getItemWidthClass()} mb-4 flex-row items-center p-2 bg-white rounded-lg border-0`}
      style={[
        { gap: 8 },
        createShadow({ x: 0, y: 4, blur: 14.9, opacity: 0.08 }),
      ]}
      activeOpacity={0.1}
    >
      <View className="w-16 h-16 rounded-base overflow-hidden flex-shrink-0">
        <Image
          source={item.image}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-col">
        <Text className="font-semibold text-base" style={{ color: "#234D1A" }}>
          <TranslatedText>{item.title}</TranslatedText>
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
      {showTitle && (
        <Text className="text-xl font-bold text-black mb-4 px-5">
          <TranslatedText>{title}</TranslatedText>
        </Text>
      )}
      <View
        className={`flex-row flex-wrap ${columns === 1 ? "" : "justify-between"} px-5`}
      >
        {items.map(renderExploreItem)}
      </View>
    </View>
  );
};
