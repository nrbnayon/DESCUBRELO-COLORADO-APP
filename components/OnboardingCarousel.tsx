import { useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { ArrowRight } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface OnboardingSlide {
  id: number;
  image: any;
  title: string;
  showSkip: boolean;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    image: require("@/assets/images/w1.png"),
    title: "Trails, events, and\nhidden gems",
    showSkip: true,
  },
  {
    id: 2,
    image: require("@/assets/images/w3.png"),
    title: "Find the best of\nColorado",
    showSkip: true,
  },
  {
    id: 3,
    image: require("@/assets/images/w4.png"),
    title: "Discover Colorado\nYour Way",
    showSkip: true,
  },
];

interface OnboardingCarouselProps {
  onFinish: () => void;
}

export function OnboardingCarousel({ onFinish }: OnboardingCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  // Create animated styles for each slide at the component level
  const animatedStyle0 = useAnimatedStyle(() => {
    const inputRange = [-1 * SCREEN_WIDTH, 0 * SCREEN_WIDTH, 1 * SCREEN_WIDTH];
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    return { width, opacity };
  });

  const animatedStyle1 = useAnimatedStyle(() => {
    const inputRange = [0 * SCREEN_WIDTH, 1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH];
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    return { width, opacity };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    const inputRange = [1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH, 3 * SCREEN_WIDTH];
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    return { width, opacity };
  });

  const animatedStyles = [animatedStyle0, animatedStyle1, animatedStyle2];

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffsetX;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    return (
      <View key={slide.id} style={{ width: SCREEN_WIDTH }} className="flex-1">
        {/* Background Image */}
        <View className="flex-1 relative">
          <Image
            source={slide.image}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
            }}
            contentFit="cover"
          />

          {/* Overlay */}
          <View className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <View className="absolute bottom-0 left-0 right-0">
            {/* White rounded container */}
            <View className="bg-white rounded-t-3xl px-6 pt-8 pb-12">
              {/* Progress indicators */}
              <View className="flex-row justify-center mb-6">
                {slides.map((_, i) => (
                  <Animated.View
                    key={i}
                    style={animatedStyles[i]}
                    className="h-2 bg-primary rounded-full mx-1"
                  />
                ))}
              </View>

              {/* Title */}
              <Text className="text-2xl font-bold text-navy-900 text-center mb-8 leading-8">
                {slide.title}
              </Text>

              {/* Action buttons */}
              <View className="flex-row justify-between items-center">
                {slide.showSkip && (
                  <TouchableOpacity onPress={handleSkip}>
                    <Text className="text-primary text-lg font-medium">
                      Skip
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleNext}
                  className="bg-primary w-12 h-12 rounded-full items-center justify-center ml-auto"
                >
                  <ArrowRight size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>
    </View>
  );
}
