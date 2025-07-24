import { View, Text, Dimensions, ImageBackground } from "react-native";
import { Image } from "expo-image";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface WelcomeScreenProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({
  onCreateAccount,
  onLogin,
}: WelcomeScreenProps) {
  // Animation values
  const floatingY = useSharedValue(0);
  const imageScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const buttonScale1 = useSharedValue(0.9);
  const buttonScale2 = useSharedValue(0.9);

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

    // Background image scaling animation
    imageScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Content animation
    setTimeout(() => {
      contentOpacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      contentTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }, 500);

    // Button animations with stagger
    setTimeout(() => {
      buttonScale1.value = withTiming(1, {
        duration: 600,
        easing: Easing.back(1.1),
      });
    }, 800);

    setTimeout(() => {
      buttonScale2.value = withTiming(1, {
        duration: 600,
        easing: Easing.back(1.1),
      });
    }, 1000);
  }, [
    floatingY,
    imageScale,
    contentOpacity,
    contentTranslateY,
    logoOpacity,
    logoScale,
    buttonScale1,
    buttonScale2,
  ]);

  // Animated styles
  const backgroundImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageScale.value }],
    };
  });

  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatingY.value }],
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  const button1Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale1.value }],
    };
  });

  const button2Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale2.value }],
    };
  });

  const handleCreateAccount = () => {
    // Button press animation
    buttonScale1.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    onCreateAccount();
  };

  const handleLogin = () => {
    // Button press animation
    buttonScale2.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    onLogin();
  };

  return (
    <View className='flex-1'>
      {/* Background Image with animation */}
      <View className='flex-1 relative'>
        <Animated.View style={backgroundImageStyle}>
          <Image
            source={require("@/assets/images/w4.png")}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.8,
            }}
            contentFit='cover'
          />
        </Animated.View>

        {/* Subtle overlay */}
        {/* <View className='absolute inset-0 bg-black/5' /> */}

        {/* Logo positioned in upper portion */}
        <View
          className='absolute left-0 right-0 items-center'
          style={{
            top: SCREEN_HEIGHT * 0.18, // Position logo in upper 15% of screen
            zIndex: 10,
          }}
        >
          <Animated.View style={[logoStyle, floatingStyle]}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{
                width: 200,
                height: 80,
              }}
              contentFit='contain'
            />
          </Animated.View>
        </View>

        {/* Bottom Content */}
        <View className='absolute bottom-0 left-0 right-0'>
          <ImageBackground
            source={require("@/assets/images/bottomwhitecurb.png")}
            style={{
              paddingTop: 60,
              paddingHorizontal: 24,
              paddingBottom: 40,
              minHeight: 240,
            }}
            resizeMode='stretch'
          >
            <Animated.View style={contentStyle}>
              <View className='mb-8'>
                <Text className='text-2xl font-bold text-black text-center leading-8'>
                  Welcome to
                </Text>
                <Text className='text-xl font-semibold text-[#0D2D00] text-center'>
                  Descuberelo Colorado
                </Text>
              </View>

              {/* Buttons */}
              <View style={{ gap: 12 }}>
                <Animated.View style={button1Style}>
                  <Button
                    variant='primary'
                    size='lg'
                    onPress={handleCreateAccount}
                    className='w-full bg-primary'
                  >
                    Create New Account
                  </Button>
                </Animated.View>

                <Animated.View style={button2Style}>
                  <Button
                    variant='secondary'
                    size='lg'
                    onPress={handleLogin}
                    className='w-full bg-gray'
                    textClassName='!text-black'
                  >
                    Login
                  </Button>
                </Animated.View>
              </View>
            </Animated.View>
          </ImageBackground>
        </View>
      </View>
    </View>
  );
}
