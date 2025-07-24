import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto finish after 5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [fadeAnim, floatAnim, scaleAnim, slideAnim, onFinish]);

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View className='flex-1 bg-primary'>
      {/* Main gradient background */}

      {/* Diagonal crossing gradient dividers using image */}
      <Image
        source={require("@/assets/images/Diagonal-crossing.png")}
        className='absolute -top-32 left-28 w-full h-full'
        resizeMode='cover'
      />

      {/* Main content container */}
      <Animated.View
        className='flex-1 justify-center items-center px-8'
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        }}
      >
        {/* Logo container */}
        <Animated.View
          className='items-center justify-center'
          style={{
            transform: [{ translateY: floatingTransform }],
          }}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            className='w-60 h-32'
            resizeMode='stretch'
          />
        </Animated.View>
      </Animated.View>

      {/* Bottom section with background image and description */}
      <View className='absolute bottom-16 left-0 right-0 h-72'>
        <ImageBackground
          source={require("@/assets/images/bottombghill.png")}
          className='flex-1 justify-end'
          resizeMode='stretch'
        >
          <Animated.View
            className='px-8 pt-5'
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className='text-base text-black/50 text-center leading-6 opacity-80 font-normal'>
              Descubrelo Colorado is a exploring app for tourist and visitors,
              who can see events, locations and so on over the app.
            </Text>
          </Animated.View>
        </ImageBackground>
      </View>
      <Animated.View>
        <ActivityIndicator size='large' color='#1E293B' />
      </Animated.View>
    </View>
  );
}
