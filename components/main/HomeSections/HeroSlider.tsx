// components/sections/HeroSlider.tsx
import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Star } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { HeroSliderProps, HeroSlide } from "@/types/homeTypes";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_WIDTH = SCREEN_WIDTH - 40; // Account for horizontal margins
const SLIDE_SPACING = 20;

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showIndicators = true,
  onSlidePress,
  containerClassName = "",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        scrollToSlide(nextSlide);
        return nextSlide;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length]);

  const scrollToSlide = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (SLIDE_WIDTH + SLIDE_SPACING),
        animated: true,
      });
    }
  };

  const handleSlidePress = (slide: HeroSlide) => {
    if (onSlidePress) {
      onSlidePress(slide);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / (SLIDE_WIDTH + SLIDE_SPACING)
    );
    setCurrentSlide(slideIndex);
  };

  const renderSlide = (slide: HeroSlide, index: number) => {
    const inputRange = [
      (index - 1) * (SLIDE_WIDTH + SLIDE_SPACING),
      index * (SLIDE_WIDTH + SLIDE_SPACING),
      (index + 1) * (SLIDE_WIDTH + SLIDE_SPACING),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.95, 1, 0.95],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        key={slide.id}
        style={{
          width: SLIDE_WIDTH,
          marginRight: index === slides.length - 1 ? 0 : SLIDE_SPACING,
          transform: [{ scale }],
          opacity,
        }}
      >
        <TouchableOpacity
          onPress={() => handleSlidePress(slide)}
          activeOpacity={0.9}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <ImageBackground
            source={slide.image}
            className="h-48 rounded-base overflow-hidden justify-end"
            resizeMode="cover"
            style={{
              borderRadius: 16,
            }}
          >
            {/* Gradient Overlay */}
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.6)"]}
              locations={[0, 0.5, 1]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 16,
              }}
            />

            {/* Content */}
            <View className="p-5 pb-6">
              <View className="flex-row items-end justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-white text-xl font-semibold">
                    {slide.title}
                  </Text>
                  <Text className="text-white text-xs">{slide.subtitle}</Text>
                </View>

                {/* Rating Badge */}
                <View className="flex-row items-center px-3 py-2 rounded-full">
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text
                    className="text-white text-base font-semibold ml-1.5"
                    style={{
                      letterSpacing: -0.2,
                    }}
                  >
                    {slide.rating}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderIndicators = () => {
    if (!showIndicators || slides.length <= 1) return null;

    return (
      <View className="flex-row justify-center mt-4">
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * (SLIDE_WIDTH + SLIDE_SPACING),
            index * (SLIDE_WIDTH + SLIDE_SPACING),
            (index + 1) * (SLIDE_WIDTH + SLIDE_SPACING),
          ];

          const dotScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentSlide(index);
                scrollToSlide(index);
              }}
              style={{ padding: 4 }}
            >
              <Animated.View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    index === currentSlide ? "#22C55E" : "#D1D5DB",
                  transform: [{ scale: dotScale }],
                  opacity: dotOpacity,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <View className={`mb-6 ${containerClassName}`}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        snapToInterval={SLIDE_WIDTH + SLIDE_SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        {slides.map(renderSlide)}
      </ScrollView>

      {renderIndicators()}
    </View>
  );
};

export default HeroSlider;
