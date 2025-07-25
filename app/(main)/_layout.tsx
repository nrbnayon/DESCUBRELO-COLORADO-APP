// app\(main)\_layout.tsx
import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Home, User, Settings } from "lucide-react-native";
import { View } from "react-native";

export default function MainLayout() {
  const colorScheme = useColorScheme();

  // Solution 1: Always render background to maintain consistent layout
  const TabIcon = ({
    Icon,
    color,
    size,
    focused,
  }: {
    Icon: any;
    color: string;
    size: number;
    focused: boolean;
  }) => {
    return (
      <View
        style={{
          backgroundColor: focused ? "#94E474" : "transparent",
          borderRadius: 20,
          // Keep consistent dimensions for all states
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          // Add border to maintain visual consistency
          borderWidth: focused ? 0 : 1,
          borderColor: "transparent",
        }}
      >
        <Icon size={size} color={focused ? "#FFFFFF" : color} />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: 95,
          paddingBottom: 10,
          paddingTop: 20,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        // Critical: Remove default margins and ensure consistent positioning
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          marginBottom: 4, // Small consistent margin from label
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Home} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={User} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              Icon={Settings}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
