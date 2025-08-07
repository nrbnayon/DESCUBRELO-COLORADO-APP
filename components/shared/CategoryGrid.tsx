// components/shared/CategoryGrid.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type { Category } from "@/types/homeTypes";

interface CategoryGridProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  columns?: number;
  showAll?: boolean;
  maxItems?: number;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategoryPress,
  columns = 4,
  showAll = false,
  maxItems = 8,
}) => {
  const displayCategories = showAll ? categories : categories.slice(0, maxItems);
  
  const getItemWidth = () => {
    switch (columns) {
      case 3: return "w-[30%]";
      case 4: return "w-[23%]";
      case 5: return "w-[18%]";
      default: return "w-[23%]";
    }
  };

  return (
    <View className="flex-row flex-wrap justify-between">
      {displayCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onCategoryPress(category)}
          className={`${getItemWidth()} items-center mb-6`}
          activeOpacity={0.7}
        >
          <View className="w-16 h-16 p-3 rounded-base items-center justify-center mb-2 bg-[#F9F9F9] border border-[#F0F0F0]">
            {category.image ? (
              <Image
                source={category.image}
                className="w-8 h-8"
                resizeMode="contain"
              />
            ) : (
              <Text className="text-2xl">{category.icon}</Text>
            )}
          </View>
          <Text className="text-xs text-center font-medium text-gray-700">
            <TranslatedText>{category.name}</TranslatedText>
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};