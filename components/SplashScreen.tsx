import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const loadingOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800 });

    // Text animation with delay
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    // Loading animation with delay
    loadingOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));

    // Auto finish after 3 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [loadingOpacity, logoOpacity, logoScale, onFinish, textOpacity]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  return (
    <View className="flex-1 bg-primary justify-center items-center px-8">
      {/* Background gradient effect */}
      <View className="absolute inset-0 bg-gradient-to-br from-primary-300 to-primary-600" />

      <Animated.View style={logoAnimatedStyle} className="items-center mb-8">
        <Text className="text-4xl font-bold text-navy-900 mb-2 tracking-wider">
          DESCUBRELO
        </Text>
        <View className="flex-row items-center">
          <Text className="text-4xl font-bold text-navy-900 tracking-wider">
            COLORADO
          </Text>
        </View>
        {/* Mountain silhouette */}
        <View className="mt-2">
          <Text className="text-2xl text-navy-900">⛰️</Text>
        </View>
      </Animated.View>

      <Animated.View style={textAnimatedStyle} className="mb-12">
        <Text className="text-navy-700 text-center text-base leading-6 px-4">
          Descubrelo Colorado is a exploring app for tourist and visitors, who
          can see events, locations and so on over the app.
        </Text>
      </Animated.View>

      <Animated.View style={loadingAnimatedStyle}>
        <ActivityIndicator size="large" color="#1E293B" />
      </Animated.View>
    </View>
  );
}
