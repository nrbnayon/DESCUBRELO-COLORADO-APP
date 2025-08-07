// components/sections/DynamicCategoriesSection.tsx
import type React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { Category, DynamicCategoriesSectionProps } from "@/types/homeTypes";

export const DynamicCategoriesSection: React.FC<
  DynamicCategoriesSectionProps
> = ({
  categories,
  categoryShow = 12,
  title = "Categories",
  onCategoryPress,
  showTitle = true,
}) => {
  const [showAll, setShowAll] = useState(false);

  // Determine how many categories to show
  const displayCategories = showAll
    ? categories
    : categories.slice(0, categoryShow - 1);
  const hasMoreCategories = categories.length > categoryShow;
  const remainingCount = categories.length - (categoryShow - 1);

  const handleCategoryPress = (category: Category) => {
    if (onCategoryPress) {
      onCategoryPress(category);
    }
  };

  const handleShowMorePress = () => {
    setShowAll(!showAll);
  };

  // Get the last category that would be replaced by show more
  const lastCategory = hasMoreCategories ? categories[categoryShow - 1] : null;

  // Create the show more item using the last category's appearance
  const showMoreItem: Category = lastCategory
    ? {
        id: "show-more",
        name: `${remainingCount}+`,
        icon: lastCategory.icon,
        image: lastCategory.image,
      }
    : {
        id: "show-more",
        name: "Show More",
        icon: "⬇️",
        image: null,
      };

  // Create the show less item
  const showLessItem: Category = {
    id: "show-less",
    name: "Show Less",
    icon: "⬆️",
    image: null,
  };

  // Combine display categories with show more/less button if needed
  const finalCategories = hasMoreCategories
    ? showAll
      ? [...categories, showLessItem]
      : [...displayCategories, showMoreItem]
    : displayCategories;

   return (
     <View className='mb-4'>
       <Text className='text-xl font-bold text-black mb-4 px-5'>
         <TranslatedText>{title}</TranslatedText>
       </Text>
       <View className='px-5'>
         <View className='flex-row flex-wrap justify-between'>
           {finalCategories.map((category) => (
             <TouchableOpacity
               key={category.id}
               onPress={() =>
                 category.id === "show-more" || category.id === "show-less"
                   ? handleShowMorePress()
                   : handleCategoryPress(category)
               }
               className='w-[23%] items-center mb-6'
               activeOpacity={0.7}
             >
               <View
                 className={`w-16 h-16 p-3 rounded-base items-center justify-center mb-2 relative ${
                   category.id === "show-more" || category.id === "show-less"
                     ? "bg-green-50 border border-green-200"
                     : "bg-[#F9F9F9] border border-[#F0F0F0]"
                 }`}
               >
                 {category.id === "show-more" ? (
                   <>
                     {/* Show the original category image/icon */}
                     {category.image ? (
                       <Image
                         source={category.image}
                         className='w-8 h-8'
                         resizeMode='contain'
                       />
                     ) : (
                       <Text className='text-2xl'>{category.icon}</Text>
                     )}
                     {/* Overlay the down arrow */}
                     <View className='absolute bottom-1 right-1 bg-white rounded-full w-4 h-4 items-center justify-center'>
                       <Text className='text-xs'>⬇️</Text>
                     </View>
                   </>
                 ) : category.id === "show-less" ? (
                   <Text className='text-2xl'>{category.icon}</Text>
                 ) : category.image ? (
                   <Image
                     source={category.image}
                     className='w-8 h-8'
                     resizeMode='contain'
                   />
                 ) : (
                   <Text className='text-2xl'>{category.icon}</Text>
                 )}
               </View>
               <Text
                 className={`text-xs text-center font-medium ${
                   category.id === "show-more" || category.id === "show-less"
                     ? "text-green-600"
                     : "text-gray-700"
                 }`}
               >
                 <TranslatedText>{category.name}</TranslatedText>
               </Text>
             </TouchableOpacity>
           ))}
         </View>
       </View>
     </View>
   );
};
