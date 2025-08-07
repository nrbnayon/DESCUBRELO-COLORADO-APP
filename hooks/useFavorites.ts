// hooks/useFavorites.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "user_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from storage
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const favoriteIds = JSON.parse(stored);
        setFavorites(new Set(favoriteIds));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Set<string>) => {
    try {
      const favoriteIds = Array.from(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (id: string) => {
    return favorites.has(id);
  };

  const getFavoriteIds = () => {
    return Array.from(favorites);
  };

  const clearAllFavorites = async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      setFavorites(new Set());
    } catch (error) {
      console.error("Error clearing favorites:", error);
    }
  };

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    getFavoriteIds,
    clearAllFavorites,
  };
};