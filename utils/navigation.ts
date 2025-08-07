// utils/navigation.ts
import { router } from "expo-router";

export class NavigationService {
  // Navigate to detail screen with proper params
  static navigateToDetail(item: any, type: string) {
    router.push({
      pathname: "/(main)/detail/[id]",
      params: {
        id: item.id,
        type,
        title: item.title,
        description: item.description || "",
        location: item.location || "",
        rating: item.rating?.toString() || "0",
        ...(type === "recommendation" && {
          dateRange: item.dateRange,
          price: item.price?.toString() || "0"
        }),
        ...(type === "explore" && {
          date: item.date,
          category: item.category
        })
      }
    });
  }

  // Navigate to category explore
  static navigateToCategoryExplore(category: any) {
    router.push({
      pathname: "/(main)/explore",
      params: {
        category: category.id,
        categoryName: category.name
      }
    });
  }

  // Navigate to recommendations
  static navigateToRecommendations() {
    router.push("/(main)/recommendations");
  }

  // Navigate to explore
  static navigateToExplore() {
    router.push("/(main)/explore");
  }

  // Navigate to map
  static navigateToMap() {
    router.push("/(main)/map");
  }

  // Navigate to favorites
  static navigateToFavorites() {
    router.push("/(main)/favorites");
  }

  // Navigate to ask AI
  static navigateToAskAI() {
    router.push("/(main)/ask-ai");
  }

  // Go back
  static goBack() {
    router.back();
  }
}