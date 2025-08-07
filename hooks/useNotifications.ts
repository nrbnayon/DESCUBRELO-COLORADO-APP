// hooks/useNotifications.ts
import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { NotificationTypes } from "@/types/allNotificationTypes";

export const useNotifications = () => {
  const {
    notifications,
    unreadNotificationCount,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearAllNotifications,
  } = useAppStore();

  // Generate unique ID for notifications
  const generateId = useCallback((): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add a new notification
  const addNewNotification = useCallback(
    (notification: Omit<NotificationTypes, "id" | "isRead">) => {
      const newNotification: NotificationTypes = {
        ...notification,
        id: generateId(),
        isRead: false,
        date: notification.date || new Date().toLocaleDateString(),
        time:
          notification.time ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
      };
      addNotification(newNotification);
    },
    [addNotification, generateId]
  );

  // Mark notification as read/unread
  const toggleNotificationReadStatus = useCallback(
    (id: string) => {
      markNotificationAsRead(id);
    },
    [markNotificationAsRead]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    markAllNotificationsAsRead();
  }, [markAllNotificationsAsRead]);

  // Remove a specific notification
  const deleteNotification = useCallback(
    (id: string) => {
      removeNotification(id);
    },
    [removeNotification]
  );

  // Clear all notifications
  const clearAll = useCallback(() => {
    clearAllNotifications();
  }, [clearAllNotifications]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter((notification) => !notification.isRead);
  }, [notifications]);

  // Get read notifications
  const getReadNotifications = useCallback(() => {
    return notifications.filter((notification) => notification.isRead);
  }, [notifications]);

  // Check if notification exists
  const notificationExists = useCallback(
    (id: string) => {
      return notifications.some((notification) => notification.id === id);
    },
    [notifications]
  );

  // Get notification by ID
  const getNotificationById = useCallback(
    (id: string) => {
      return notifications.find((notification) => notification.id === id);
    },
    [notifications]
  );

  return {
    // State
    notifications,
    unreadCount: unreadNotificationCount,

    // Actions
    addNotification: addNewNotification,
    markAsRead: toggleNotificationReadStatus,
    markAllAsRead,
    deleteNotification,
    clearAll,

    // Utilities
    getUnreadNotifications,
    getReadNotifications,
    notificationExists,
    getNotificationById,
  };
};
