// components/shared/AnimatedHeader.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { ChevronLeft } from "lucide-react-native";

interface AnimatedHeaderProps {
  title: string;
  titleClassName?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  titleClassName = "text-black text-2xl font-semibold text-center leading-8",
  showBackButton = true,
  onBackPress,
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  // Animation values
  const floatingY = useSharedValue(0);
  const logoOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.8);

  useEffect(() => {
    // Logo entrance animation
    logoOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.back(1.2),
    });

    // Floating animation for logo
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(8, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatingY.value }],
    };
  });

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Back Button */}
      {showBackButton && (
        <View className="flex-row items-center px-5" style={{ zIndex: 10 }}>
          <TouchableOpacity
            onPress={handleBackPress}
            className="bg-white/70 rounded-full p-2"
          >
            <ChevronLeft size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      )}

      {/* Header Background */}
      <View className="absolute top-0 left-0 right-0">
        <ImageBackground
          source={require("@/assets/images/top-cloud.png")}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.5,
          }}
          resizeMode="stretch"
        >
          {/* Logo Section */}
          <View
            className="items-center"
            style={{
              marginTop: SCREEN_HEIGHT * 0.1,
              zIndex: 100,
              opacity: 1,
            }}
          >
            <Animated.View style={[logoStyle, floatingStyle]}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={{
                  width: 160,
                  height: 50,
                }}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* Title Section */}
          <View
            className="items-center px-6"
            style={{
              marginTop: SCREEN_HEIGHT * 0.06,
            }}
          >
            <Text className={titleClassName}>{title}</Text>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};
