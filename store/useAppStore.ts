import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Custom storage for cross-platform compatibility
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (
        Platform.OS === "web" &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        return localStorage.getItem(name);
      }
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.error(`Error getting item ${name}:`, error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (
        Platform.OS === "web" &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        localStorage.setItem(name, value);
      } else {
        await AsyncStorage.setItem(name, value);
      }
    } catch (error) {
      console.error(`Error setting item ${name}:`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (
        Platform.OS === "web" &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        localStorage.removeItem(name);
      } else {
        await AsyncStorage.removeItem(name);
      }
    } catch (error) {
      console.error(`Error removing item ${name}:`, error);
    }
  },
};

// Enhanced User interface
interface User {
  id: string;
  name: string;
  email: string;
  balance?: number;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    language?: string;
    currency?: string;
    notifications?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
  isVerified?: boolean;
  role?: "user" | "admin" | "moderator";
}

// Enhanced Notification interface
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  priority?: "low" | "medium" | "high";
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Application settings interface
interface AppSettings {
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
}

// Main AppState interface
interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // UI state
  theme: "light" | "dark" | "system";

  hasSeenOnboarding: boolean;

  // Notifications
  notifications: Notification[];
  unreadNotificationCount: number;

  // Authentication flow
  forgotPasswordEmail: string | null;
  otpVerified: boolean;

  // App settings
  settings: AppSettings;

  // Error handling
  error: string | null;

  // User Actions
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
  addNotification: (notification: Omit<Notification, "id">) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Authentication flow actions
  setForgotPasswordEmail: (email: string | null) => void;
  setOtpVerified: (verified: boolean) => void;

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

// Generate unique ID for notifications
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      forgotPasswordEmail: null,
      otpVerified: false,
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
          otpVerified: false,
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
      addNotification: (notification: Omit<Notification, "id">) => {
        const newNotification: Notification = {
          ...notification,
          id: generateId(),
        };

        const currentNotifications = get().notifications;
        const updatedNotifications = [newNotification, ...currentNotifications];

        set({
          notifications: updatedNotifications,
          unreadNotificationCount: get().unreadNotificationCount + 1,
        });
      },

      markNotificationAsRead: (id: string) => {
        const currentNotifications = get().notifications;
        const updatedNotifications = currentNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        );

        const wasUnread = currentNotifications.find(
          (n) => n.id === id && !n.read
        );

        set({
          notifications: updatedNotifications,
          unreadNotificationCount: wasUnread
            ? Math.max(0, get().unreadNotificationCount - 1)
            : get().unreadNotificationCount,
        });
      },

      markAllNotificationsAsRead: () => {
        const updatedNotifications = get().notifications.map(
          (notification) => ({
            ...notification,
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
            notificationToRemove && !notificationToRemove.read
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

      // Authentication flow actions
      setForgotPasswordEmail: (email: string | null) => {
        set({ forgotPasswordEmail: email });
      },

      setOtpVerified: (verified: boolean) => {
        set({ otpVerified: verified });
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
          otpVerified: false,
          settings: defaultSettings,
          error: null,
        });
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => storage),
      version: 2,
      // Specify what to persist
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        notifications: state.notifications,
        unreadNotificationCount: state.unreadNotificationCount,
        settings: state.settings,
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
export const useNotifications = () =>
  useAppStore((state) => ({
    notifications: state.notifications,
    unreadCount: state.unreadNotificationCount,
    addNotification: state.addNotification,
    markAsRead: state.markNotificationAsRead,
    markAllAsRead: state.markAllNotificationsAsRead,
    removeNotification: state.removeNotification,
    clearAll: state.clearAllNotifications,
  }));
export const useSettings = () =>
  useAppStore((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
  }));

// Type exports for external use
export type { User, Notification, AppSettings, AppState };
