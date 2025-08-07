import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import {
  MapPinned,
  Settings,
  MessageCircle,
  Star,
  House,
} from "lucide-react-native";
import { View, TouchableOpacity } from "react-native";

export default function MainLayout() {
  const colorScheme = useColorScheme();

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
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: focused ? 0 : 1,
          borderColor: "transparent",
        }}
      >
        <Icon size={size} color={focused ? "#FFFFFF" : color} />
      </View>
    );
  };

  // Custom tab button component to remove press effects
  const CustomTabButton = (props: any) => {
    return (
      <TouchableOpacity
        {...props}
        activeOpacity={1} // This removes the opacity change on press
        style={[props.style, { flex: 1 }]}
      />
    );
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: 95,
          paddingBottom: 8,
          paddingTop: 20,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        // Use custom tab button to remove press effects
        tabBarButton: CustomTabButton,
      })}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={House} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='ask-ai'
        options={{
          title: "Ask AI",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              Icon={MessageCircle}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='map'
        options={{
          title: "Map",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              Icon={MapPinned}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='favorites'
        options={{
          title: "Favorite",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Star} color={color} size={size} focused={focused} />
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

      {/* Hidden screens */}
      <Tabs.Screen
        name='recommendations'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='detail/[id]'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
