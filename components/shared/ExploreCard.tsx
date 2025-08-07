// components/shared/ExploreCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { Calendar, Star, MapPin } from "lucide-react-native";
import { createShadow } from "@/utils/shadows";

interface ExploreCardProps {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image: any;
  rating?: number;
  location?: string;
  onPress: () => void;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export const ExploreCard: React.FC<ExploreCardProps> = ({
  title,
  description,
  date,
  image,
  rating,
  location,
  onPress,
  showFavorite = false,
  isFavorite = false,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-4"
      activeOpacity={0.7}
    >
      <View 
        className="bg-white rounded-2xl overflow-hidden"
        style={createShadow({ y: 2, blur: 8, opacity: 0.1 })}
      >
        <View className="relative h-48">
          <Image
            source={image}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          
          {showFavorite && (
            <TouchableOpacity
              onPress={onFavoritePress}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Star 
                size={20} 
                color={isFavorite ? "#FFD700" : "white"}
                fill={isFavorite ? "#FFD700" : "transparent"}
              />
            </TouchableOpacity>
          )}

          <View className="absolute bottom-0 left-0 right-0 p-4">
            <Text className="text-white text-lg font-bold mb-2 leading-tight">
              <TranslatedText>{title}</TranslatedText>
            </Text>
            {date && (
              <View className="flex-row items-center">
                <Calendar size={16} color="white" />
                <Text className="text-white text-sm ml-2">
                  <TranslatedText>{date}</TranslatedText>
                </Text>
              </View>
            )}
          </View>
        </View>

        {(description || rating || location) && (
          <View className="p-4">
            {description && (
              <Text className="text-gray-600 text-sm mb-2 leading-5">
                <TranslatedText>{description}</TranslatedText>
              </Text>
            )}
            <View className="flex-row items-center justify-between">
              {location && (
                <View className="flex-row items-center flex-1">
                  <MapPin size={14} color="#666" />
                  <Text className="text-gray-600 text-sm ml-1">
                    <TranslatedText>{location}</TranslatedText>
                  </Text>
                </View>
              )}
              {rating && (
                <View className="flex-row items-center">
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <Text className="text-gray-700 text-sm ml-1 font-medium">
                    {rating}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};