// app/(main)/detail/[id].tsx
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Linking,
  ImageBackground,
  ActivityIndicator,
  Platform,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { Button } from "@/components/ui/Button";
import { MockDataService } from "@/services/mockDataService";
import type { AllDataStructure } from "@/types/homeTypes";
import {
  ChevronLeft,
  Star,
  Calendar,
  MapPin,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Heart,
  Clock,
  Phone,
  DollarSign,
  Tag,
  ExternalLink,
  MapPinned,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { CategoryService } from "@/services/homeService";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function DetailScreen() {
  const params = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [detailData, setDetailData] = useState<AllDataStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoSlideIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    loadDetailData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Auto slide functionality
  useEffect(() => {
    const images = detailData?.images;
    if (images && images.length > 1) {
      startAutoSlide();
    }
    return () => {
      stopAutoSlide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailData]);

  const startAutoSlide = () => {
    stopAutoSlide(); // Clear any existing interval
    autoSlideIntervalRef.current = setTimeout(() => {
      const images = detailData?.images;
      if (images && images.length > 1) {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          // Scroll to the next image
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              x: nextIndex * SCREEN_WIDTH,
              animated: true,
            });
          }
          return nextIndex;
        });
      }
      // Restart the interval
      startAutoSlide();
    }, 3000); // Change image every 3 seconds
  };

  const stopAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearTimeout(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  };

  const loadDetailData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to get data from navigation params
      if (params.itemData) {
        try {
          const parsedData = JSON.parse(params.itemData as string);
          console.log(
            "Using data from navigation params:",
            parsedData.title || parsedData.name
          );
          setDetailData(parsedData);
          return;
        } catch (parseError) {
          console.warn("Failed to parse itemData from params:", parseError);
          // Continue to ID-based lookup
        }
      }

      // Fallback: Search by ID in all available data sources
      const itemId = params.id as string;
      console.log("Searching for item with ID:", itemId);

      // Try MockDataService first
      const mockLocations = await MockDataService.fetchAllLocations();
      let item = mockLocations.find((location) => location.id === itemId);

      if (item) {
        console.log("Found item in MockDataService:", item.title || item.name);
        setDetailData(item);
        return;
      }

      // Try CategoryService data
      const exploreItems = CategoryService.getExploreItems();
      item = exploreItems.find((location) => location.id === itemId);

      if (item) {
        console.log(
          "Found item in CategoryService explore items:",
          item.title || item.name
        );
        setDetailData(item);
        return;
      }

      // Try recommended items
      const recommendedItems = CategoryService.getRecommendedItems();
      item = recommendedItems.find((location) => location.id === itemId);

      if (item) {
        console.log(
          "Found item in CategoryService recommended items:",
          item.title || item.name
        );
        setDetailData(item);
        return;
      }

      // If still not found, log available IDs for debugging
      const allAvailableIds = [
        ...mockLocations.map((item) => item.id),
        ...exploreItems.map((item) => item.id),
        ...recommendedItems.map((item) => item.id),
      ];
      console.log("Available IDs:", allAvailableIds);
      console.log("Item not found for ID:", itemId);
      setError("Item not found");
    } catch (err) {
      console.error("Error loading detail data:", err);
      setError("Failed to load item details");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!detailData) return;

    try {
      await Share.share({
        message: `Check out ${detailData.title || detailData.name} - ${detailData.description || ""}`,
        title: detailData.title || detailData.name,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleSocialPress = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const handlePhonePress = () => {
    if (detailData?.phone) {
      Linking.openURL(`tel:${detailData.phone}`);
    }
  };

  const handleGetDirections = () => {
    // Navigate to the internal map screen instead of external app
    if (detailData?.latitude && detailData?.longitude) {
      // Pass the location data to the internal map/navigation screen
      router.push({
        pathname: "/(screen)/explore-navigate",
        params: {
          destinationId: detailData.id,
          destinationName: detailData.name || detailData.title || "",
          destinationLat: detailData.latitude.toString(),
          destinationLng: detailData.longitude.toString(),
        },
      });
    } else {
      // Fallback to general map screen
      router.push("/(screen)/explore-navigate");
    }
  };

  const getPriceLevelText = (priceLevel?: number) => {
    switch (priceLevel) {
      case 1:
        return "$";
      case 2:
        return "$$";
      case 3:
        return "$$$";
      case 4:
        return "$$$$";
      default:
        return "Free";
    }
  };

  const renderMarkdownText = (text: string) => {
    // Simple markdown-like text parsing
    // Replace **bold** with bold styling
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return (
      <Text className='text-gray-700 text-base leading-6'>
        {parts.map((part, index) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <Text key={index} className='font-bold'>
                <TranslatedText>{part.slice(2, -2)}</TranslatedText>
              </Text>
            );
          }
          return <TranslatedText key={index}>{part}</TranslatedText>;
        })}
      </Text>
    );
  };

  const renderImageSlider = () => {
    const images = detailData?.images || [];
    const hasImages = images.length > 0;

    return (
      <View className='relative' style={{ height: SCREEN_HEIGHT * 0.4 }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onTouchStart={stopAutoSlide}
          onTouchEnd={startAutoSlide}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / SCREEN_WIDTH
            );
            setCurrentImageIndex(index);
          }}
        >
          {hasImages ? (
            images.map((image, index) => {
              // Handle both string URLs and ImageSourcePropType
              const imageSource =
                typeof image === "string"
                  ? { uri: image }
                  : (image as ImageSourcePropType);

              return (
                <Image
                  key={index}
                  source={imageSource}
                  style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.4 }}
                  resizeMode='stretch'
                />
              );
            })
          ) : (
            <Image
              source={require("@/assets/images/placeholder.png")}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.4 }}
              resizeMode='cover'
            />
          )}
        </ScrollView>

        {/* Gradient overlay at the bottom */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)"]}
          className='absolute bottom-0 left-0 right-0 h-20'
        />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className='absolute top-3 left-4 w-10 h-10 bg-white/90 rounded-full items-center justify-center border border-gray-200/50'
          activeOpacity={0.8}
        >
          <ChevronLeft size={22} color='#1F2937' />
        </TouchableOpacity>

        {/* Favorite button */}
        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          className='absolute top-3 right-4 w-10 h-10 bg-white/90 rounded-full items-center justify-center border border-gray-200'
          activeOpacity={0.8}
        >
          <Heart
            size={20}
            color={isFavorite ? "#EF4444" : "#6B7280"}
            fill={isFavorite ? "#EF4444" : "none"}
          />
        </TouchableOpacity>

        {/* Share button */}
        <TouchableOpacity
          onPress={handleShare}
          className='absolute top-3 right-16 w-10 h-10 bg-white/90 rounded-full items-center justify-center border border-gray-200/50'
          activeOpacity={0.8}
        >
          <Share2 size={18} color='#6B7280' />
        </TouchableOpacity>

        {/* Rating badge */}
        {detailData?.rating && (
          <View className='absolute bottom-6 left-4 bg-black/80 px-3 py-1 rounded-full flex-row items-center'>
            <Star size={12} color='#FCD34D' fill='#FCD34D' />
            <Text className='text-white text-sm font-semibold ml-1'>
              {detailData.rating.toFixed(1)}
            </Text>
          </View>
        )}

        {/* Featured badge */}
        {detailData?.isFeatured && (
          <View className='absolute bottom-6 right-4 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full'>
            <Text className='text-white text-xs font-bold'>
              <TranslatedText>Featured</TranslatedText>
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderSocialLinks = () => {
    if (!detailData?.socialLinks) return null;

    const socialPlatforms = [
      {
        key: "facebook",
        icon: Facebook,
        color: "#1877F2",
        url: detailData.socialLinks.facebook,
      },
      {
        key: "instagram",
        icon: Instagram,
        color: "#E4405F",
        url: detailData.socialLinks.instagram,
      },
      {
        key: "twitter",
        icon: Twitter,
        color: "#1DA1F2",
        url: detailData.socialLinks.twitter,
      },
      {
        key: "youtube",
        icon: Youtube,
        color: "#FF0000",
        url: detailData.socialLinks.youtube,
      },
      {
        key: "linkedin",
        icon: Linkedin,
        color: "#0A66C2",
        url: detailData.socialLinks.linkedin,
      },
    ];

    const availableSocials = socialPlatforms.filter((platform) => platform.url);

    if (availableSocials.length === 0) return null;

    return (
      <View className='mb-6'>
        <Text className='text-lg font-semibold text-gray-900 mb-3'>
          <TranslatedText>Socials</TranslatedText>
        </Text>
        <View className='flex-row justify-start flex-wrap'>
          {availableSocials.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <TouchableOpacity
                key={platform.key}
                onPress={() => handleSocialPress(platform.url!)}
                className='w-10 h-10 rounded-full items-center justify-center mr-3 mb-2'
                style={{ backgroundColor: platform.color }}
                activeOpacity={0.8}
              >
                <IconComponent size={20} color='white' />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderInfoSection = () => (
    <View className='mb-6'>
      <Text className='text-lg font-semibold text-gray-900 mb-4'>
        <TranslatedText>Information</TranslatedText>
      </Text>

      <View className='space-y-4'>
        {/* Location */}
        {(detailData?.location || detailData?.address) && (
          <View className='flex-row items-start'>
            <MapPin size={18} color='#6B7280' className='mt-1' />
            <View className='flex-1 ml-3'>
              <Text className='text-gray-700 text-base leading-6'>
                <TranslatedText>
                  {(detailData.address || detailData.location) ?? ""}
                </TranslatedText>
              </Text>
            </View>
          </View>
        )}

        {/* Phone */}
        {detailData?.phone && (
          <TouchableOpacity
            onPress={handlePhonePress}
            className='flex-row items-center'
            activeOpacity={0.7}
          >
            <Phone size={18} color='#6B7280' />
            <Text className='text-blue-600 text-base ml-3 underline'>
              {detailData.phone}
            </Text>
          </TouchableOpacity>
        )}

        {/* Opening Hours */}
        {detailData?.openingHours && (
          <View className='flex-row items-center'>
            <Clock size={18} color='#6B7280' />
            <Text className='text-gray-700 text-base ml-3'>
              <TranslatedText>{detailData.openingHours}</TranslatedText>
            </Text>
          </View>
        )}

        {/* Date Range */}
        {detailData?.dateRange && (
          <View className='flex-row items-center'>
            <Calendar size={18} color='#6B7280' />
            <Text className='text-gray-700 text-base ml-3'>
              <TranslatedText>{detailData.dateRange}</TranslatedText>
            </Text>
          </View>
        )}

        {/* Price Level */}
        {detailData?.priceLevel && (
          <View className='flex-row items-center'>
            <DollarSign size={18} color='#059669' />
            <Text className='text-emerald-600 text-base font-semibold ml-3'>
              {getPriceLevelText(detailData.priceLevel)}
            </Text>
          </View>
        )}

        {/* Type */}
        {detailData?.type && (
          <View className='flex-row items-center'>
            <Tag size={18} color='#8B5CF6' />
            <Text className='text-purple-600 text-base ml-3'>
              <TranslatedText>{detailData.type}</TranslatedText>
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCategories = () => {
    if (!detailData?.categories || detailData.categories.length === 0)
      return null;

    return (
      <View className='mb-6'>
        <Text className='text-lg font-semibold text-gray-900 mb-3'>
          <TranslatedText>Categories</TranslatedText>
        </Text>
        <View className='flex-row flex-wrap'>
          {detailData.categories.map((category, index) => (
            <View
              key={index}
              className='bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-full mr-2 mb-2'
            >
              <Text className='text-indigo-600 text-sm font-medium'>
                <TranslatedText>{category}</TranslatedText>
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Loading State
  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-surface'>
        <StatusBar style='dark' />

        {/* Header Background */}
        <View className='absolute -top-16 left-0 right-0'>
          <ImageBackground
            source={require("@/assets/images/top-cloud.png")}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.4,
            }}
            resizeMode='cover'
          />
        </View>

        {/* Header */}
        <View className='flex-row items-center px-5 py-2 z-10'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='w-10 h-10 bg-white/95 rounded-xl items-center justify-center shadow-sm border border-gray-100'
            activeOpacity={0.8}
          >
            <ChevronLeft size={22} color='#1F2937' />
          </TouchableOpacity>
          <Text className='text-xl font-bold text-gray-900 ml-3'>
            <TranslatedText>Loading...</TranslatedText>
          </Text>
        </View>

        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#6366F1' />
          <Text className='text-gray-500 mt-4'>
            <TranslatedText>Loading details...</TranslatedText>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error || !detailData) {
    return (
      <SafeAreaView className='flex-1 bg-surface'>
        <StatusBar style='dark' />

        {/* Header Background */}
        <View className='absolute -top-16 left-0 right-0'>
          <ImageBackground
            source={require("@/assets/images/top-cloud.png")}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.4,
            }}
            resizeMode='cover'
          />
        </View>

        {/* Header */}
        <View className='flex-row items-center px-5 py-2 z-10'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='w-10 h-10 bg-white/95 rounded-xl items-center justify-center shadow-sm border border-gray-100'
            activeOpacity={0.8}
          >
            <ChevronLeft size={22} color='#1F2937' />
          </TouchableOpacity>
          <Text className='text-xl font-bold text-gray-900 ml-3'>
            <TranslatedText>Error</TranslatedText>
          </Text>
        </View>

        <View className='flex-1 items-center justify-center px-5'>
          <View className='w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6'>
            <ExternalLink size={32} color='#DC2626' />
          </View>
          <Text className='text-xl font-semibold text-gray-700 mb-2 text-center'>
            <TranslatedText>Item Not Found</TranslatedText>
          </Text>
          <Text className='text-gray-500 text-center max-w-sm leading-6 mb-6'>
            <TranslatedText>
              {error || "The item you're looking for could not be found."}
            </TranslatedText>
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className='bg-indigo-600 px-6 py-3 rounded-xl'
            activeOpacity={0.8}
          >
            <Text className='text-white font-semibold'>
              <TranslatedText>Go Back</TranslatedText>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const images = detailData?.images || [];
  const hasImages = images.length > 0;

  // Main Content
  return (
    <SafeAreaView className='flex-1 bg-surface' edges={["top"]}>
      {/* <StatusBar style="auto" /> */}
      <View className='absolute -top-16 left-0 right-0'>
        <ImageBackground
          source={require("@/assets/images/top-cloud.png")}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.4,
          }}
          resizeMode='cover'
        />
      </View>
      <View className='flex-1'>
        {/* Image Background with auto-changing slider */}
        {renderImageSlider()}

        {/* Content Section - Overlaying with rounded top */}
        <View
          className='flex-1 bg-white rounded-t-3xl'
          style={{
            marginTop: -25, // Overlap the image
            minHeight: SCREEN_HEIGHT * 0.4,
          }}
        >
          {/* Image indicators in the top white space center */}
          {hasImages && images.length > 1 && (
            <View className='flex-row justify-center pt-4 pb-2'>
              {images.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentImageIndex
                      ? "bg-primary w-4"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </View>
          )}

          <ScrollView
            className='flex-1'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {/* Content */}
            <View className='px-5 pt-4'>
              {/* Title and Subtitle */}
              <View className='mb-6'>
                <Text className='text-2xl font-bold text-gray-900 mb-2 leading-tight'>
                  <TranslatedText>
                    {detailData.title || detailData.name || "Untitled"}
                  </TranslatedText>
                </Text>

                {detailData.location && (
                  <View className='flex-row items-center mb-2'>
                    <MapPin size={16} color='#6B7280' />
                    <Text className='text-gray-600 text-base ml-1'>
                      <TranslatedText>{detailData.location}</TranslatedText>
                    </Text>
                  </View>
                )}

                {/* Event Count */}
                {detailData.eventCount && (
                  <Text className='text-indigo-600 text-sm font-medium'>
                    <TranslatedText>
                      {`${detailData.eventCount} events available`}
                    </TranslatedText>
                  </Text>
                )}
              </View>

              {/* Social Links */}
              {renderSocialLinks()}

              {/* Description */}
              {detailData.description && (
                <View className='mb-5'>
                  <Text className='text-lg font-semibold text-gray-900 mb-3'>
                    <TranslatedText>Description</TranslatedText>
                  </Text>
                  {renderMarkdownText(detailData.description)}
                </View>
              )}

              {/* Information Section */}
              {renderInfoSection()}

              {/* Categories */}
              {renderCategories()}

              {/* Offline Support Info */}
              {detailData.offlineSupported && (
                <View className='mb-8 p-4 bg-green-50 rounded-xl border border-green-200'>
                  <Text className='text-green-800 font-semibold mb-1'>
                    <TranslatedText>Offline Support Available</TranslatedText>
                  </Text>
                  <Text className='text-green-700 text-sm'>
                    <TranslatedText>
                      This location supports offline access including maps and
                      navigation.
                    </TranslatedText>
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Bottom Action Button - Fixed at bottom */}
        <View
          className='absolute bottom-0 left-0 right-0 px-5 py-2 bg-white border-t border-gray-100'
          style={{ paddingBottom: Platform.OS === "ios" ? 34 : 20 }}
        >
          <Button
            onPress={handleGetDirections}
            className='w-full bg-primary'
            size='lg'
            textClassName='!text-black font-semibold'
          >
            <View className='flex-row items-center justify-center'>
              <MapPinned size={20} color='black' />
              <Text className='text-black font-semibold ml-2'>
                <TranslatedText>Get Directions</TranslatedText>
              </Text>
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
