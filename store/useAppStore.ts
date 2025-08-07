// store/useAppStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { User } from "@/types/userTypes";
import { AppSettings } from "@/types/appSettings";
import { NotificationTypes } from "@/types/allNotificationTypes";

// Custom storage for cross-platform compatibility
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web") {
        // For web platform, use localStorage
        if (typeof window !== "undefined" && window.localStorage) {
          return localStorage.getItem(name);
        }
        return null;
      }
      // For native platforms, use AsyncStorage
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.error(`Error getting item ${name}:`, error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        // For web platform, use localStorage
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem(name, value);
        }
      } else {
        // For native platforms, use AsyncStorage
        await AsyncStorage.setItem(name, value);
      }
    } catch (error) {
      console.error(`Error setting item ${name}:`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        // For web platform, use localStorage
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.removeItem(name);
        }
      } else {
        // For native platforms, use AsyncStorage
        await AsyncStorage.removeItem(name);
      }
    } catch (error) {
      console.error(`Error removing item ${name}:`, error);
    }
  },
};

// Main AppState interface
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: "light" | "dark" | "system";
  hasSeenOnboarding: boolean;
  notifications: NotificationTypes[];
  unreadNotificationCount: number;
  favoriteItems: string[];
  forgotPasswordEmail: string | null;
  signUpEmail: string | null;
  otpVerified: boolean;
  otpType: "signup" | "forgot-password" | null;
  settings: AppSettings;
  error: string | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUserProfile: (userData: Partial<User>) => void;
  // UI Actions
  setTheme: (theme: AppState["theme"]) => void;
  setLoading: (loading: boolean) => void;
  setHasSeenOnboarding: (value: boolean) => void;
  setError: (error: string | null) => void;
  // Notification Actions
  addNotification: (notification: NotificationTypes) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  // Favorite Actions
  addToFavorites: (itemId: string) => void;
  removeFromFavorites: (itemId: string) => void;
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  // Authentication flow actions
  setForgotPasswordEmail: (email: string | null) => void;
  setSignUpEmail: (email: string | null) => void;
  setOtpVerified: (verified: boolean) => void;
  setOtpType: (type: "signup" | "forgot-password" | null) => void;
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  // Utility actions
  resetStore: () => void;
}

// Default settings
const defaultSettings: AppSettings = {
  language: "en",
  currency: "USD",
  timezone: "UTC",
  dateFormat: "MM/DD/YYYY",
  notifications: {
    push: true,
    email: true,
    sms: false,
    marketing: false,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      theme: "system",
      hasSeenOnboarding: false,
      notifications: [],
      unreadNotificationCount: 0,
      favoriteItems: [],
      forgotPasswordEmail: null,
      signUpEmail: null,
      otpVerified: false,
      otpType: null,
      settings: defaultSettings,
      error: null,

      // User Actions
      login: (user: User) => {
        set({
          user: {
            ...user,
            updatedAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          forgotPasswordEmail: null,
          signUpEmail: null,
          otpVerified: false,
          otpType: null,
          error: null,
          // Keep notifications and settings on logout
        });
      },

      setUser: (user: User | null) => {
        set({
          user: user
            ? {
                ...user,
                updatedAt: new Date().toISOString(),
              }
            : null,
          isAuthenticated: !!user,
        });
      },

      updateUserProfile: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...userData,
            updatedAt: new Date().toISOString(),
          };
          set({
            user: updatedUser,
          });
        }
      },

      // UI Actions
      setTheme: (theme: AppState["theme"]) => {
        set({ theme });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),

      // Notification Actions
      addNotification: (notification: NotificationTypes) => {
        const currentNotifications = get().notifications;
        const updatedNotifications = [notification, ...currentNotifications];
        const wasRead = notification.isRead || notification.read || false;

        set({
          notifications: updatedNotifications,
          unreadNotificationCount: wasRead
            ? get().unreadNotificationCount
            : get().unreadNotificationCount + 1,
        });
      },

      markNotificationAsRead: (id: string) => {
        const currentNotifications = get().notifications;
        const targetNotification = currentNotifications.find(
          (n) => n.id === id
        );

        if (!targetNotification) return;

        const updatedNotifications = currentNotifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: !notification.isRead,
                read: !notification.isRead,
              }
            : notification
        );

        // Calculate unread count change
        let countChange = 0;
        if (!targetNotification.isRead) {
          // Was unread, now read
          countChange = -1;
        } else {
          // Was read, now unread
          countChange = 1;
        }

        set({
          notifications: updatedNotifications,
          unreadNotificationCount: Math.max(
            0,
            get().unreadNotificationCount + countChange
          ),
        });
      },

      markAllNotificationsAsRead: () => {
        const updatedNotifications = get().notifications.map(
          (notification) => ({
            ...notification,
            isRead: true,
            read: true,
          })
        );
        set({
          notifications: updatedNotifications,
          unreadNotificationCount: 0,
        });
      },

      removeNotification: (id: string) => {
        const currentNotifications = get().notifications;
        const notificationToRemove = currentNotifications.find(
          (n) => n.id === id
        );
        const updatedNotifications = currentNotifications.filter(
          (notification) => notification.id !== id
        );
        set({
          notifications: updatedNotifications,
          unreadNotificationCount:
            notificationToRemove && !notificationToRemove.isRead
              ? Math.max(0, get().unreadNotificationCount - 1)
              : get().unreadNotificationCount,
        });
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadNotificationCount: 0,
        });
      },

      // Favorite Actions
      addToFavorites: (itemId: string) => {
        const currentFavorites = get().favoriteItems;
        if (!currentFavorites.includes(itemId)) {
          set({
            favoriteItems: [...currentFavorites, itemId],
          });
        }
      },

      removeFromFavorites: (itemId: string) => {
        const currentFavorites = get().favoriteItems;
        set({
          favoriteItems: currentFavorites.filter((id) => id !== itemId),
        });
      },

      toggleFavorite: (itemId: string) => {
        const currentFavorites = get().favoriteItems;
        if (currentFavorites.includes(itemId)) {
          get().removeFromFavorites(itemId);
        } else {
          get().addToFavorites(itemId);
        }
      },

      isFavorite: (itemId: string) => {
        return get().favoriteItems.includes(itemId);
      },

      // Authentication flow actions
      setForgotPasswordEmail: (email: string | null) => {
        set({ forgotPasswordEmail: email });
      },

      setSignUpEmail: (email: string | null) => {
        set({ signUpEmail: email });
      },

      setOtpVerified: (verified: boolean) => {
        set({ otpVerified: verified });
      },

      setOtpType: (type: "signup" | "forgot-password" | null) => {
        set({ otpType: type });
      },

      // Settings actions
      updateSettings: (newSettings: Partial<AppSettings>) => {
        const currentSettings = get().settings;
        set({
          settings: {
            ...currentSettings,
            ...newSettings,
            // Deep merge notifications if provided
            notifications: newSettings.notifications
              ? {
                  ...currentSettings.notifications,
                  ...newSettings.notifications,
                }
              : currentSettings.notifications,
          },
        });
      },

      // Utility actions
      resetStore: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          theme: "system",
          notifications: [],
          unreadNotificationCount: 0,
          forgotPasswordEmail: null,
          signUpEmail: null,
          otpVerified: false,
          otpType: null,
          settings: defaultSettings,
          error: null,
        });
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => storage),
      version: 3,
      // Specify what to persist
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        notifications: state.notifications,
        unreadNotificationCount: state.unreadNotificationCount,
        favoriteItems: state.favoriteItems,
        settings: state.settings,
        hasSeenOnboarding: state.hasSeenOnboarding,
        // Don't persist loading states, errors, or temporary auth flow data
      }),
      // Handle rehydration
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to rehydrate store:", error);
        } else {
          console.log("Store rehydrated successfully:", state);
        }
      },
      // Migration function for version changes
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          return {
            ...persistedState,
            settings: defaultSettings,
            unreadNotificationCount: 0,
            favoriteItems: [],
          };
        }
        if (version === 2) {
          return {
            ...persistedState,
            signUpEmail: null,
            otpType: null,
            favoriteItems: persistedState.favoriteItems || [],
          };
        }
        return persistedState;
      },
    }
  )
);

// Utility hooks for specific parts of the store
export const useUser = () => useAppStore((state) => state.user);
export const useAuth = () =>
  useAppStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    login: state.login,
    logout: state.logout,
  }));
export const useTheme = () =>
  useAppStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));
export const useSettings = () =>
  useAppStore((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
  }));
export const useFavoritesStore = () =>
  useAppStore((state) => ({
    favoriteItems: state.favoriteItems,
    addToFavorites: state.addToFavorites,
    removeFromFavorites: state.removeFromFavorites,
    toggleFavorite: state.toggleFavorite,
    isFavorite: state.isFavorite,
  }));

// Type exports for external use
export type { User, NotificationTypes, AppSettings, AppState };
