import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Image } from "expo-image";
import { ArrowRight } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
  useAnimatedScrollHandler,
  Easing,
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
    image: require("@/assets/images/w2.png"),
    title: "Find the best of\nColorado",
    showSkip: true,
  },
  {
    id: 3,
    image: require("@/assets/images/w3.png"),
    title: "Discover Colorado\nYour Way",
    showSkip: true,
  },
];

interface OnboardingCarouselProps {
  onFinish: () => void;
}

export function OnboardingCarousel({ onFinish }: OnboardingCarouselProps) {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  // Animation values for each slide
  const imageScale0 = useSharedValue(1);
  const imageScale1 = useSharedValue(1);
  const imageScale2 = useSharedValue(1);
  const imageScales = [imageScale0, imageScale1, imageScale2];

  // Content animation values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(0.8);

  // Floating animation for overlay elements
  const floatingY = useSharedValue(0);

  useEffect(() => {
    // Start floating animation
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Initial content animation
    contentOpacity.value = withTiming(1, { duration: 800 });
    contentTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    buttonScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.back(1.2),
    });
  }, [floatingY, contentOpacity, contentTranslateY, buttonScale]);

  // Start image scaling animation for current slide
  useEffect(() => {
    // Reset all scales
    imageScales.forEach((scale, index) => {
      if (index === currentIndex) {
        scale.value = withRepeat(
          withSequence(
            withTiming(1.05, {
              duration: 4000,
              easing: Easing.inOut(Easing.sin),
            }),
            withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) })
          ),
          -1,
          true
        );
      } else {
        scale.value = withTiming(1, { duration: 500 });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

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
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );
    return { width, opacity, transform: [{ scale }] };
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
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );
    return { width, opacity, transform: [{ scale }] };
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
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );
    return { width, opacity, transform: [{ scale }] };
  });

  const animatedStyles = [animatedStyle0, animatedStyle1, animatedStyle2];

  // Image animation styles for each slide
  const imageAnimatedStyle0 = useAnimatedStyle(() => {
    const inputRange = [-1 * SCREEN_WIDTH, 0 * SCREEN_WIDTH, 1 * SCREEN_WIDTH];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, imageScale0.value, 0.9],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }], opacity };
  });

  const imageAnimatedStyle1 = useAnimatedStyle(() => {
    const inputRange = [0 * SCREEN_WIDTH, 1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, imageScale1.value, 0.9],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }], opacity };
  });

  const imageAnimatedStyle2 = useAnimatedStyle(() => {
    const inputRange = [1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH, 3 * SCREEN_WIDTH];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, imageScale2.value, 0.9],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }], opacity };
  });

  const imageAnimatedStyles = [
    imageAnimatedStyle0,
    imageAnimatedStyle1,
    imageAnimatedStyle2,
  ];

  // Content animation styles
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  // Floating overlay animation
  const floatingAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatingY.value }],
    };
  });

  // Title animation for each slide
  const titleAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (currentIndex - 1) * SCREEN_WIDTH,
      currentIndex * SCREEN_WIDTH,
      (currentIndex + 1) * SCREEN_WIDTH,
    ];
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [30, 0, -30],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      runOnJS(setCurrentIndex)(index);
    },
  });

  const handleNext = () => {
    // Animate button press
    buttonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });

      // Animate content for next slide
      contentOpacity.value = withSequence(
        withTiming(0.7, { duration: 200 }),
        withTiming(1, { duration: 400 })
      );
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    return (
      <View key={slide.id} style={{ width: SCREEN_WIDTH }} className='flex-1'>
        {/* Image (80%) with animations */}
        <View className='relative'>
          <Animated.View style={imageAnimatedStyles[index]}>
            <Image
              source={slide.image}
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT * 0.8,
              }}
              contentFit='cover'
            />
          </Animated.View>

          {/* Animated overlay */}
          <Animated.View
            style={[
              {
                position: "absolute",
                inset: 0,
                height: SCREEN_HEIGHT * 0.8,
                backgroundColor: "rgba(0,0,0,0.2)",
              },
              floatingAnimatedStyle,
            ]}
          />
        </View>

        {/* White section overlaps the image */}
        <View className='absolute left-0 right-0 bottom-0'>
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
            <Animated.View style={contentAnimatedStyle}>
              {/* Progress indicators */}
              <View className='flex-row justify-center mb-6'>
                {slides.map((_, i) => (
                  <Animated.View
                    key={i}
                    style={animatedStyles[i]}
                    className='h-2 bg-primary rounded-full mx-1'
                  />
                ))}
              </View>

              {/* Title with animation */}
              <Animated.View style={titleAnimatedStyle}>
                <Text className='text-2xl font-bold text-navy-900 text-center mb-8 leading-8'>
                  {slide.title}
                </Text>
              </Animated.View>

              {/* Action buttons */}
              <View className='flex-row justify-between items-center'>
                {slide.showSkip && (
                  <TouchableOpacity onPress={handleSkip}>
                    <Animated.Text
                      style={[
                        { fontSize: 18, fontWeight: "500" },
                        contentAnimatedStyle,
                      ]}
                      className='text-primary'
                    >
                      Skip
                    </Animated.Text>
                  </TouchableOpacity>
                )}
                <Animated.View style={buttonAnimatedStyle}>
                  <TouchableOpacity
                    onPress={handleNext}
                    className='bg-primary w-12 h-12 rounded-full items-center justify-center ml-auto'
                  >
                    <ArrowRight size={24} color='white' />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </Animated.View>
          </ImageBackground>
        </View>
      </View>
    );
  };

  return (
    <View className='flex-1'>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </Animated.ScrollView>
    </View>
  );
}

// import { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
//   ImageBackground,
// } from "react-native";
// import { Image } from "expo-image";
// import { ArrowRight } from "lucide-react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   interpolate,
//   Extrapolate,
// } from "react-native-reanimated";

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// interface OnboardingSlide {
//   id: number;
//   image: any;
//   title: string;
//   showSkip: boolean;
// }

// const slides: OnboardingSlide[] = [
//   {
//     id: 1,
//     image: require("@/assets/images/w1.png"),
//     title: "Trails, events, and\nhidden gems",
//     showSkip: true,
//   },
//   {
//     id: 2,
//     image: require("@/assets/images/w3.png"),
//     title: "Find the best of\nColorado",
//     showSkip: true,
//   },
//   {
//     id: 3,
//     image: require("@/assets/images/w4.png"),
//     title: "Discover Colorado\nYour Way",
//     showSkip: true,
//   },
// ];

// interface OnboardingCarouselProps {
//   onFinish: () => void;
// }

// export function OnboardingCarousel({ onFinish }: OnboardingCarouselProps) {
//   const scrollViewRef = useRef<ScrollView>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const scrollX = useSharedValue(0);

//   const animatedStyle0 = useAnimatedStyle(() => {
//     const inputRange = [-1 * SCREEN_WIDTH, 0 * SCREEN_WIDTH, 1 * SCREEN_WIDTH];
//     const width = interpolate(
//       scrollX.value,
//       inputRange,
//       [8, 24, 8],
//       Extrapolate.CLAMP
//     );
//     const opacity = interpolate(
//       scrollX.value,
//       inputRange,
//       [0.3, 1, 0.3],
//       Extrapolate.CLAMP
//     );
//     return { width, opacity };
//   });

//   const animatedStyle1 = useAnimatedStyle(() => {
//     const inputRange = [0 * SCREEN_WIDTH, 1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH];
//     const width = interpolate(
//       scrollX.value,
//       inputRange,
//       [8, 24, 8],
//       Extrapolate.CLAMP
//     );
//     const opacity = interpolate(
//       scrollX.value,
//       inputRange,
//       [0.3, 1, 0.3],
//       Extrapolate.CLAMP
//     );
//     return { width, opacity };
//   });

//   const animatedStyle2 = useAnimatedStyle(() => {
//     const inputRange = [1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH, 3 * SCREEN_WIDTH];
//     const width = interpolate(
//       scrollX.value,
//       inputRange,
//       [8, 24, 8],
//       Extrapolate.CLAMP
//     );
//     const opacity = interpolate(
//       scrollX.value,
//       inputRange,
//       [0.3, 1, 0.3],
//       Extrapolate.CLAMP
//     );
//     return { width, opacity };
//   });

//   const animatedStyles = [animatedStyle0, animatedStyle1, animatedStyle2];

//   const handleScroll = (event: any) => {
//     const contentOffsetX = event.nativeEvent.contentOffset.x;
//     scrollX.value = contentOffsetX;
//     const index = Math.round(contentOffsetX / SCREEN_WIDTH);
//     setCurrentIndex(index);
//   };

//   const handleNext = () => {
//     if (currentIndex < slides.length - 1) {
//       const nextIndex = currentIndex + 1;
//       scrollViewRef.current?.scrollTo({
//         x: nextIndex * SCREEN_WIDTH,
//         animated: true,
//       });
//     } else {
//       onFinish();
//     }
//   };

//   const handleSkip = () => {
//     onFinish();
//   };

//   const renderSlide = (slide: OnboardingSlide, index: number) => {
//     return (
//       <View key={slide.id} style={{ width: SCREEN_WIDTH }} className='flex-1'>
//         {/* Image (80%) */}
//         <View className='relative'>
//           <Image
//             source={slide.image}
//             style={{
//               width: SCREEN_WIDTH,
//               height: SCREEN_HEIGHT * 0.8,
//             }}
//             contentFit='cover'
//           />
//           <View
//             className='absolute inset-0 bg-black/20'
//             style={{ height: SCREEN_HEIGHT * 0.8 }}
//           />
//         </View>

//         {/* White section overlaps the image */}
//         <View className='absolute left-0 right-0 bottom-0'>
//           <ImageBackground
//             source={require("@/assets/images/bottomwhitecurb.png")}
//             style={{
//               paddingTop: 60,
//               paddingHorizontal: 24,
//               paddingBottom: 40,
//               minHeight: 240,
//             }}
//             resizeMode='stretch'
//           >
//             {/* Progress indicators */}
//             <View className='flex-row justify-center mb-6'>
//               {slides.map((_, i) => (
//                 <Animated.View
//                   key={i}
//                   style={animatedStyles[i]}
//                   className='h-2 bg-primary rounded-full mx-1'
//                 />
//               ))}
//             </View>

//             {/* Title */}
//             <Text className='text-2xl font-bold text-navy-900 text-center mb-8 leading-8'>
//               {slide.title}
//             </Text>

//             {/* Action buttons */}
//             <View className='flex-row justify-between items-center'>
//               {slide.showSkip && (
//                 <TouchableOpacity onPress={handleSkip}>
//                   <Text className='text-primary text-lg font-medium'>Skip</Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 onPress={handleNext}
//                 className='bg-primary w-12 h-12 rounded-full items-center justify-center ml-auto'
//               >
//                 <ArrowRight size={24} color='white' />
//               </TouchableOpacity>
//             </View>
//           </ImageBackground>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View className='flex-1'>
//       <ScrollView
//         ref={scrollViewRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//       >
//         {slides.map((slide, index) => renderSlide(slide, index))}
//       </ScrollView>
//     </View>
//   );
// }
