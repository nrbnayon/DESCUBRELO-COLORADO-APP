// app\(screen)\notifications.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { ChevronLeft, Bell, X, Trash2, CheckCircle } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationTypes } from "@/types/allNotificationTypes";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const SWIPE_THRESHOLD = screenWidth * 0.3;

const NotificationItem: React.FC<{
  item: NotificationTypes;
  onPress: (item: NotificationTypes) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = React.memo(({ item, onPress, onMarkAsRead, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const handleStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      if (Math.abs(translationX) > SWIPE_THRESHOLD) {
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: translationX > 0 ? screenWidth : -screenWidth,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          onDelete(item.id);
        });
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const deleteButtonOpacity = translateX.interpolate({
    inputRange: [-screenWidth * 0.3, -50, 0],
    outputRange: [1, 0.8, 0],
    extrapolate: "clamp",
  });

  const getNotificationColors = (type?: string) => {
    switch (type) {
      case "security":
        return {
          borderColor: "border-l-red-500",
          iconBg: "bg-red-100",
          iconColor: "#EF4444",
        };
      case "update":
        return {
          borderColor: "border-l-blue-500",
          iconBg: "bg-blue-100",
          iconColor: "#3B82F6",
        };
      case "promotion":
        return {
          borderColor: "border-l-yellow-500",
          iconBg: "bg-yellow-100",
          iconColor: "#F59E0B",
        };
      case "system":
        return {
          borderColor: "border-l-gray-500",
          iconBg: "bg-gray-100",
          iconColor: "#6B7280",
        };
      case "welcome":
        return {
          borderColor: "border-l-purple-500",
          iconBg: "bg-purple-100",
          iconColor: "#8B5CF6",
        };
      default:
        return {
          borderColor: item.isRead ? "border-l-gray-300" : "border-l-green-500",
          iconBg: item.isRead ? "bg-gray-100" : "bg-green-100",
          iconColor: item.isRead ? "#9CA3AF" : "#10B981",
        };
    }
  };

  const colors = getNotificationColors(item.type);

  return (
    <View className="mb-3 relative">
      <Animated.View
        className="absolute right-0 top-0 bottom-0 bg-red-500 rounded-2xl justify-center items-center"
        style={{
          opacity: deleteButtonOpacity,
          width: 80,
        }}
      >
        <Trash2 size={24} color="#ffffff" />
      </Animated.View>

      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
            opacity,
          }}
        >
          <TouchableOpacity
            onPress={() => onPress(item)}
            className={`bg-white rounded-2xl mx-5 p-4 shadow-sm border-l-4 ${colors.borderColor}`}
            activeOpacity={0.7}
            onLongPress={() => {
              Alert.alert(
                "Notification Options",
                "What would you like to do?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: item.isRead ? "Mark as Unread" : "Mark as Read",
                    onPress: () => onMarkAsRead(item.id),
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete(item.id),
                  },
                ]
              );
            }}
          >
            <View className="flex-row items-start">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${colors.iconBg}`}
              >
                <Bell size={20} color={colors.iconColor} />
              </View>

              <View className="flex-1">
                <View className="flex-row items-start justify-between mb-1">
                  <Text
                    className={`text-base font-semibold flex-1 mr-2 ${
                      item.isRead ? "text-gray-700" : "text-gray-900"
                    }`}
                  >
                    <TranslatedText>{item.title || "No title"}</TranslatedText>
                  </Text>
                  <Text className="text-xs text-gray-500">
                    <TranslatedText>{item.date || "No date"}</TranslatedText>
                  </Text>
                </View>

                <Text
                  className={`text-sm leading-5 ${
                    item.isRead ? "text-gray-500" : "text-gray-600"
                  }`}
                  numberOfLines={2}
                >
                  <TranslatedText>
                    {item.description || "No description"}
                  </TranslatedText>
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-xs text-gray-400">
                    <TranslatedText>{item.time || "No time"}</TranslatedText>
                  </Text>
                  {item.type && (
                    <View
                      className={`px-2 py-0.5 rounded-full ${colors.iconBg}`}
                    >
                      <Text
                        className="text-xs font-medium capitalize"
                        style={{ color: colors.iconColor }}
                      >
                        <TranslatedText>{item.type}</TranslatedText>
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {!item.isRead && (
                <View className="w-3 h-3 bg-green-500 rounded-full ml-2 mt-1" />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
});

NotificationItem.displayName = "NotificationItem";

const NotificationModal: React.FC<{
  visible: boolean;
  notification: NotificationTypes | null;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ visible, notification, onClose, onMarkAsRead, onDelete }) => {
  if (!notification) return null;

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "security":
        return { color: "#EF4444", bgColor: "#FEF2F2" };
      case "update":
        return { color: "#3B82F6", bgColor: "#EFF6FF" };
      case "promotion":
        return { color: "#F59E0B", bgColor: "#FFFBEB" };
      case "system":
        return { color: "#6B7280", bgColor: "#F9FAFB" };
      case "welcome":
        return { color: "#8B5CF6", bgColor: "#F5F3FF" };
      default:
        return {
          color: notification.isRead ? "#9CA3AF" : "#10B981",
          bgColor: notification.isRead ? "#F3F4F6" : "#F0FDF4",
        };
    }
  };

  const iconStyle = getNotificationIcon(notification.type);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Pressable className="flex-1" onPress={onClose} />

        <View
          className="bg-white rounded-t-3xl"
          style={{ maxHeight: screenHeight * 0.85 }}
        >
          <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-900">
              <TranslatedText>Notification Details</TranslatedText>
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="p-5"
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: screenHeight * 0.7 }}
          >
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4 self-center"
              style={{ backgroundColor: iconStyle.bgColor }}
            >
              <Bell size={28} color={iconStyle.color} />
            </View>

            <Text className="text-xl font-bold text-gray-900 text-center mb-2">
              <TranslatedText>
                {notification.title || "No title"}
              </TranslatedText>
            </Text>

            <Text className="text-sm text-gray-500 text-center mb-6">
              <TranslatedText>{`${notification.date || "No date"} • ${notification.time || "No time"}`}</TranslatedText>
            </Text>

            {notification.type && (
              <View className="self-center mb-4">
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: iconStyle.bgColor }}
                >
                  <Text
                    className="text-sm font-medium capitalize"
                    style={{ color: iconStyle.color }}
                  >
                    <TranslatedText>{notification.type}</TranslatedText>
                  </Text>
                </View>
              </View>
            )}

            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Text className="text-sm font-semibold text-gray-800 mb-2">
                <TranslatedText>Description</TranslatedText>
              </Text>
              <Text className="text-base text-gray-700 leading-6">
                <TranslatedText>
                  {notification.description || "No description available"}
                </TranslatedText>
              </Text>
            </View>

            {notification.message &&
              notification.message !== notification.description && (
                <View className="bg-blue-50 rounded-2xl p-4 mb-4">
                  <Text className="text-sm font-semibold text-blue-800 mb-2">
                    <TranslatedText>Additional Information</TranslatedText>
                  </Text>
                  <Text className="text-sm text-blue-700 leading-5">
                    <TranslatedText>{notification.message}</TranslatedText>
                  </Text>
                </View>
              )}

            {notification.metadata &&
              Object.keys(notification.metadata).length > 0 && (
                <View className="bg-yellow-50 rounded-2xl p-4 mb-4">
                  <Text className="text-sm font-semibold text-yellow-800 mb-3">
                    <TranslatedText>Details</TranslatedText>
                  </Text>
                  {Object.entries(notification.metadata).map(([key, value]) => (
                    <View
                      key={key}
                      className="flex-row justify-between items-center mb-2"
                    >
                      <Text className="text-sm text-yellow-700 font-medium capitalize flex-1">
                        <TranslatedText>
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </TranslatedText>
                        :
                      </Text>
                      <Text className="text-sm text-yellow-600 ml-2 flex-1 text-right">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

            <View className="flex-row items-center justify-center mb-6">
              <View
                className={`flex-row items-center px-3 py-1.5 rounded-full ${notification.isRead ? "bg-gray-100" : "bg-green-100"}`}
              >
                <View
                  className={`w-2 h-2 rounded-full mr-2 ${notification.isRead ? "bg-gray-400" : "bg-green-500"}`}
                />
                <Text
                  className={`text-sm font-medium ${notification.isRead ? "text-gray-600" : "text-green-700"}`}
                >
                  <TranslatedText>
                    {notification.isRead ? "Read" : "Unread"}
                  </TranslatedText>
                </Text>
              </View>
            </View>

            <View className="pb-16" style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  onMarkAsRead(notification.id);
                  onClose();
                }}
                className={`flex-row items-center justify-center py-3 px-6 rounded-xl ${notification.isRead ? "bg-gray-500" : "bg-green-500"}`}
              >
                <CheckCircle size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-2">
                  <TranslatedText>
                    {notification.isRead ? "Mark as Unread" : "Mark as Read"}
                  </TranslatedText>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onDelete(notification.id);
                  onClose();
                }}
                className="flex-row items-center justify-center py-3 px-6 rounded-xl bg-red-500"
              >
                <Trash2 size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-2">
                  <TranslatedText>Delete Notification</TranslatedText>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function NotificationsScreen() {
  const {
    notifications: storeNotifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAll,
    addNotification,
  } = useNotifications();

  const [notifications, setNotifications] = useState<NotificationTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationTypes | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Initialize with mock data if store is empty
  useEffect(() => {
    const initializeNotifications = () => {
      if (storeNotifications.length > 0) {
        setNotifications(storeNotifications);
      } else {
        // Fallback to mock data if store is empty
        const mockNotifications: NotificationTypes[] = [
          {
            id: "1",
            title: "Welcome to our app!",
            description:
              "Thank you for downloading our app. Get started by exploring all the features we have to offer.",
            message:
              "Complete your profile setup to unlock personalized recommendations and exclusive offers.",
            date: "2025-08-07",
            time: "12:00 PM",
            type: "welcome",
            isRead: false,
            metadata: {
              category: "onboarding",
              priority: "high",
              actionRequired: true,
            },
          },
          {
            id: "2",
            title: "Security Alert",
            description:
              "We detected a new login from an unrecognized device. If this wasn't you, please secure your account immediately.",
            message:
              "Login detected from: iPhone 15 Pro, Location: Dhaka, BD. Time: 12:46 PM +06.",
            date: "2025-08-07",
            time: "12:46 PM",
            type: "security",
            isRead: true,
            metadata: {
              device: "iPhone 15 Pro",
              location: "Dhaka, BD",
              riskLevel: "medium",
            },
          },
        ];
        setNotifications(mockNotifications);
        mockNotifications.forEach((notif) => addNotification(notif)); // Sync mock data to store
      }
      setLoading(false);
    };

    initializeNotifications();
  }, [storeNotifications, addNotification]);

  useEffect(() => {
    if (storeNotifications.length > 0) {
      setNotifications(storeNotifications);
    }
  }, [storeNotifications]);

  const handleNotificationPress = (notification: NotificationTypes) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    markAsRead(id);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
    deleteNotification(id);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    markAllAsRead();
  };

  const handleDeleteAllNotifications = () => {
    Alert.alert(
      "Delete All Notifications",
      "Are you sure you want to delete all notifications? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            setNotifications([]);
            clearAll();
          },
        },
      ]
    );
  };

  const displayUnreadCount =
    storeNotifications.length > 0
      ? unreadCount
      : notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="mt-2 text-gray-600">
            <TranslatedText>Loading notifications...</TranslatedText>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <StatusBar style="auto" />

      <View className="absolute -top-16 left-0 right-0">
        <ImageBackground
          source={require("@/assets/images/top-cloud.png")}
          style={{ width: screenWidth, height: screenHeight * 0.35 }}
          resizeMode="cover"
        />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center justify-between px-5 py-3">
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-8 h-8 bg-white/40 rounded-full items-center justify-center p-2 border border-[#E6E6E6]"
            >
              <ChevronLeft size={20} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-black">
              <TranslatedText>Notification</TranslatedText>
            </Text>
            {displayUnreadCount > 0 && (
              <View className="bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1.5">
                <Text className="text-white text-xs font-bold">
                  {displayUnreadCount}
                </Text>
              </View>
            )}
          </View>

          {notifications.length > 0 && (
            <View className="flex-row items-center" style={{ gap: 8 }}>
              {displayUnreadCount > 0 && (
                <TouchableOpacity
                  onPress={handleMarkAllAsRead}
                  className="bg-green-500 px-3 py-1.5 rounded-lg"
                >
                  <Text className="text-white text-sm font-medium">
                    <TranslatedText>Mark All</TranslatedText>
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleDeleteAllNotifications}
                className="p-1.5"
              >
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {notifications.length > 0 ? (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="py-4">
              {notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onPress={handleNotificationPress}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center px-5">
            <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-4">
              <Bell size={32} color="#9CA3AF" />
            </View>
            <Text className="text-gray-900 text-xl font-semibold text-center mb-2">
              <TranslatedText>No notifications</TranslatedText>
            </Text>
            <Text className="text-gray-500 text-center">
              <TranslatedText>
                You&apos;re all caught up! New notifications will appear here.
              </TranslatedText>
            </Text>
          </View>
        )}
      </View>

      <NotificationModal
        visible={modalVisible}
        notification={selectedNotification}
        onClose={() => {
          setModalVisible(false);
          setSelectedNotification(null);
        }}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDeleteNotification}
      />
    </SafeAreaView>
  );
}
