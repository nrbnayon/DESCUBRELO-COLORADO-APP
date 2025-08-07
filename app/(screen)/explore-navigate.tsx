// app\(screen)\explore-navigate.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
  Polyline,
} from "react-native-maps";
import * as Location from "expo-location";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { MockDataService } from "@/services/mockDataService";
import type { AllDataStructure } from "@/types/homeTypes";
import {
  MapPin,
  Search,
  Navigation2,
  Locate,
  RotateCcw,
  X,
  Route,
  ArrowUpRight,
  ChevronLeft,
} from "lucide-react-native";

// Import custom pin images
const pinRegular = require("@/assets/images/pin_green.png"); // Green pin (#22c55e) with transparent center
const pinDestination = require("@/assets/images/pin_regular.png"); // Red pin (#BF0600) with transparent center

interface DirectionStep {
  latitude: number;
  longitude: number;
}

interface RouteData {
  coordinates: DirectionStep[];
  distance: string;
  duration: string;
  distanceValue: number;
  durationValue: number;
}

// Google Directions API key - Replace with your actual API key
const GOOGLE_DIRECTIONS_API_KEY = "AIzaSyD6ht_z9Zw53jO_zdasgQCBykcbJxIn1Gg";

export default function ExploreNavigateScreen() {
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<
    AllDataStructure[]
  >([]);
  const [allLocations, setAllLocations] = useState<AllDataStructure[]>([]);
  const [, setSelectedLocation] = useState<AllDataStructure | null>(null);
  const [destinationLocation, setDestinationLocation] =
    useState<AllDataStructure | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 39.5501,
    longitude: -105.7821,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  });
  const [routeCoordinates, setRouteCoordinates] = useState<DirectionStep[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationDistance, setNavigationDistance] = useState<string>("");
  const [navigationDuration, setNavigationDuration] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>(
    "Getting your location..."
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const mapRef = useRef<MapView>(null);

  // Load unified data on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locations = await MockDataService.getMapLocations();
        setAllLocations(locations);
        setFilteredLocations(locations);

        // Set default selected location (first featured location)
        const defaultLocation =
          locations.find((loc) => loc.isFeatured) || locations[0];
        if (defaultLocation) {
          setSelectedLocation(defaultLocation);
        }
      } catch (error) {
        console.error("Error loading locations:", error);
        Alert.alert("Error", "Unable to load locations");
      }
    };

    loadLocations();
  }, []);

  // Auto-setup destination from navigation params
  useEffect(() => {
    const setupDestinationFromParams = () => {
      if (
        params.destinationId &&
        params.destinationName &&
        params.destinationLat &&
        params.destinationLng
      ) {
        const lat = parseFloat(params.destinationLat as string);
        const lng = parseFloat(params.destinationLng as string);

        // Validate coordinates
        if (isNaN(lat) || isNaN(lng)) {
          console.warn(
            "Invalid coordinates from params:",
            params.destinationLat,
            params.destinationLng
          );
          return;
        }

        const destinationFromParams: AllDataStructure = {
          id: params.destinationId as string,
          name: params.destinationName as string,
          title: params.destinationName as string,
          latitude: lat,
          longitude: lng,
          address: `${params.destinationLat}, ${params.destinationLng}`,
          location: params.destinationName as string,
          type: "Destination",
          description: `Navigation destination: ${params.destinationName}`,
          rating: 0,
          eventCount: 0,
          dateRange: "",
          images: [],
          isFeatured: false,
          categories: ["Navigation"],
          offlineSupported: false,
        };

        console.log(
          "Setting up destination from params:",
          destinationFromParams.name
        );

        // Only set destination location, don't set selectedLocation to avoid loops
        setDestinationLocation(destinationFromParams);

        // Animate to destination location with a delay to ensure map is ready
        if (lat && lng && mapRef.current) {
          const newRegion: Region = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };

          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion(newRegion, 1000);
            }
          }, 500);
        }
      }
    };

    setupDestinationFromParams();
  }, [
    params.destinationId,
    params.destinationName,
    params.destinationLat,
    params.destinationLng,
  ]); // Added proper dependencies

  // Request location permissions and get user location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Location Permission",
            "Permission to access location was denied. Some features may not work properly."
          );
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation(location);

        // Get current address
        try {
          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (reverseGeocode.length > 0) {
            const address = reverseGeocode[0];
            const formattedAddress =
              `${address.streetNumber || ""} ${address.street || ""}, ${address.city || ""} ${address.postalCode || ""}`.trim();
            setCurrentAddress(formattedAddress || "Current Location");
          }
        } catch (error) {
          console.error("Error getting address:", error);
          setCurrentAddress("Current Location");
        }
      } catch (error) {
        console.error("Error getting location:", error);
        setCurrentAddress("Location unavailable");
        Alert.alert("Error", "Unable to get your current location");
      }
    };

    getUserLocation();
  }, []);

  // Enhanced search with external location support
  useEffect(() => {
    const filterLocations = async () => {
      if (searchQuery.trim() === "") {
        setFilteredLocations(allLocations);
      } else {
        try {
          // First search in local data
          const localSearchResults =
            await MockDataService.searchContent(searchQuery);
          const localResults = [
            ...localSearchResults.locations,
            ...localSearchResults.recommendations,
            ...localSearchResults.hiking,
            ...localSearchResults.travels,
          ];

          // Remove duplicates from local results
          const uniqueLocalResults = localResults.filter(
            (item, index, self) =>
              self.findIndex((t) => t.id === item.id) === index
          );

          // If no local results or query looks like an external location, search externally
          if (uniqueLocalResults.length === 0 || searchQuery.length > 3) {
            try {
              const externalResults =
                await searchExternalLocations(searchQuery);
              // Combine local and external results, prioritizing local
              setFilteredLocations([...uniqueLocalResults, ...externalResults]);
            } catch (error) {
              console.log(
                "External search failed, using local results only",
                error
              );
              setFilteredLocations(uniqueLocalResults);
            }
          } else {
            setFilteredLocations(uniqueLocalResults);
          }
        } catch (error) {
          console.error("Error searching locations:", error);
          setFilteredLocations([]);
        }
      }
    };

    const debounceTimer = setTimeout(filterLocations, 300); // Debounce for external API calls
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, allLocations]);

  // Calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    return MockDataService.calculateDistance(lat1, lon1, lat2, lon2);
  };

  // External location search using geocoding
  const searchExternalLocations = async (
    query: string
  ): Promise<AllDataStructure[]> => {
    try {
      // Use Expo Location's geocoding service
      const geocodeResults = await Location.geocodeAsync(query);

      if (geocodeResults && geocodeResults.length > 0) {
        const externalLocations: AllDataStructure[] = geocodeResults
          .slice(0, 5)
          .map((result, index) => ({
            id: `external-${Date.now()}-${index}`,
            name: query,
            title: query,
            address: `${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`,
            location: query,
            latitude: result.latitude,
            longitude: result.longitude,
            type: "External Location",
            description: `Search result for "${query}"`,
            rating: 0,
            eventCount: 0,
            dateRange: "",
            images: [],
            isFeatured: false,
            categories: ["Search Result"],
            offlineSupported: false,
          }));

        // Try to get more detailed address information for the first result
        if (externalLocations.length > 0) {
          try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
              latitude: geocodeResults[0].latitude,
              longitude: geocodeResults[0].longitude,
            });

            if (reverseGeocode.length > 0) {
              const addressInfo = reverseGeocode[0];
              const formattedAddress = [
                addressInfo.streetNumber,
                addressInfo.street,
                addressInfo.city,
                addressInfo.region,
                addressInfo.country,
                addressInfo.postalCode,
              ]
                .filter(Boolean)
                .join(", ");

              externalLocations[0].address =
                formattedAddress || externalLocations[0].address;
              externalLocations[0].location =
                addressInfo.city || addressInfo.region || query;
              externalLocations[0].description = `${addressInfo.city || query}, ${addressInfo.country || "Unknown"}`;
            }
          } catch (error) {
            console.log("Mapper error", error);
            console.log("Reverse geocoding failed, using basic info");
          }
        }

        return externalLocations;
      }

      return [];
    } catch (error) {
      console.error("External location search failed:", error);
      return [];
    }
  };

  // Get real route coordinates using Google Directions API
  const getRealRouteCoordinates = async (
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number }
  ): Promise<RouteData | DirectionStep[]> => {
    try {
      const origin = `${start.latitude},${start.longitude}`;
      const destination = `${end.latitude},${end.longitude}`;

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_DIRECTIONS_API_KEY}&mode=driving`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        // Decode the polyline points
        const points = decodePolyline(route.overview_polyline.points);

        // Return route info and coordinates
        return {
          coordinates: points,
          distance: leg.distance.text,
          duration: leg.duration.text,
          distanceValue: leg.distance.value,
          durationValue: leg.duration.value,
        };
      } else {
        // Fallback to straight line if API fails
        console.warn("Google Directions API failed, using fallback route");
        return generateFallbackRoute(start, end);
      }
    } catch (error) {
      console.error("Error fetching route from Google Directions:", error);
      // Fallback to straight line if API fails
      return generateFallbackRoute(start, end);
    }
  };

  // Decode Google's polyline format
  const decodePolyline = (encoded: string): DirectionStep[] => {
    const points: DirectionStep[] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  // Fallback route generation (improved version of original)
  const generateFallbackRoute = (
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number }
  ): DirectionStep[] => {
    const steps = 50; // More steps for smoother fallback route
    const coordinates: DirectionStep[] = [];

    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      // Reduce curve factor for more realistic fallback
      const curveFactor = Math.sin(ratio * Math.PI) * 0.003;
      const latitude =
        start.latitude + (end.latitude - start.latitude) * ratio + curveFactor;
      const longitude =
        start.longitude +
        (end.longitude - start.longitude) * ratio +
        curveFactor;
      coordinates.push({ latitude, longitude });
    }

    return coordinates;
  };

  const handleLocationSelect = (location: AllDataStructure) => {
    if (isAnimating) return; // Prevent multiple simultaneous selections

    setDestinationLocation(location);
    setSelectedLocation(location);
    setIsSearching(false);
    setSearchQuery("");

    // Only animate to location if it has valid coordinates
    if (location.latitude && location.longitude && mapRef.current) {
      setIsAnimating(true);

      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      // Use only animateToRegion, don't update state immediately
      mapRef.current.animateToRegion(newRegion, 1000);

      // Reset animation flag after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 1100);
    }
  };

  const handleSetDirection = async () => {
    if (!destinationLocation || !userLocation) {
      Alert.alert(
        "Location Required",
        "Please select a destination and make sure location services are enabled."
      );
      return;
    }

    if (!destinationLocation.latitude || !destinationLocation.longitude) {
      Alert.alert(
        "Error",
        "Selected destination doesn't have valid coordinates."
      );
      return;
    }

    try {
      setIsNavigating(true);

      const start = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };

      const end = {
        latitude: destinationLocation.latitude,
        longitude: destinationLocation.longitude,
      };

      // Get real route coordinates from Google Directions API
      const routeData = await getRealRouteCoordinates(start, end);

      if (Array.isArray(routeData)) {
        // Fallback route (array of DirectionStep)
        setRouteCoordinates(routeData);

        // Calculate distance and estimated duration using fallback method
        const distance = calculateDistance(
          start.latitude,
          start.longitude,
          end.latitude,
          end.longitude
        );

        setNavigationDistance(`${distance.toFixed(1)} km`);
        setNavigationDuration(`${Math.round(distance * 1.2)} min`);
      } else {
        // Real Google Directions route (RouteData object)
        setRouteCoordinates(routeData.coordinates);
        setNavigationDistance(routeData.distance);
        setNavigationDuration(routeData.duration);
      }

      // Fit the route in view
      if (mapRef.current) {
        const coordinates = [start, end];
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 100,
            right: 50,
            bottom: 400,
            left: 50,
          },
          animated: true,
        });
      }

      Alert.alert(
        "Navigation Started",
        `Route to ${destinationLocation.name}: ${navigationDistance}, estimated ${navigationDuration}`
      );
    } catch (error) {
      console.error("Error calculating route:", error);
      Alert.alert("Error", "Unable to calculate route");
      setIsNavigating(false);
    }
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setRouteCoordinates([]);
    setNavigationDistance("");
    setNavigationDuration("");

    // Return to Colorado overview
    const defaultRegion = {
      latitude: 39.5501,
      longitude: -105.7821,
      latitudeDelta: 2.5,
      longitudeDelta: 2.5,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(defaultRegion, 1000);
    }
  };

  const handleMyLocation = async () => {
    if (isAnimating) return; // Prevent multiple simultaneous animations

    try {
      let location = userLocation;

      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation(location);
      }

      if (mapRef.current) {
        setIsAnimating(true);

        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };

        mapRef.current.animateToRegion(newRegion, 1000);

        setTimeout(() => {
          setIsAnimating(false);
        }, 1100);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Unable to get your current location");
    }
  };

  const handleResetView = () => {
    if (isAnimating) return; // Prevent multiple simultaneous animations

    setIsAnimating(true);

    const defaultRegion = {
      latitude: 39.5501,
      longitude: -105.7821,
      latitudeDelta: 2.5,
      longitudeDelta: 2.5,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(defaultRegion, 1000);
    }

    setIsNavigating(false);
    setRouteCoordinates([]);

    setTimeout(() => {
      setIsAnimating(false);
    }, 1100);
  };

  const handleMarkerPress = (location: AllDataStructure) => {
    if (isAnimating) return; // Prevent multiple simultaneous selections

    setDestinationLocation(location);
    setSelectedLocation(location);

    if (location.latitude && location.longitude && mapRef.current) {
      setIsAnimating(true);

      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      mapRef.current.animateToRegion(newRegion, 1000);

      setTimeout(() => {
        setIsAnimating(false);
      }, 1100);
    }
  };

  // Handle map region changes more carefully
  const handleRegionChangeComplete = (region: Region) => {
    // Only update state if not currently animating
    if (!isAnimating) {
      setMapRegion(region);
    }
  };

  const renderLocationItem = ({ item }: { item: AllDataStructure }) => (
    <TouchableOpacity
      onPress={() => handleLocationSelect(item)}
      className='p-4 border-b border-gray-100 bg-white'
      style={[
        styles.locationItem,
        item.type === "External Location" && { borderLeftColor: "#3b82f6" },
      ]}
      activeOpacity={0.7}
    >
      <View className='flex-row items-start'>
        <View
          className={`p-2 rounded-lg mr-3 ${
            item.type === "External Location" ? "bg-blue-100" : "bg-green-100"
          }`}
        >
          <MapPin
            size={16}
            color={item.type === "External Location" ? "#3b82f6" : "#22c55e"}
          />
        </View>
        <View className='flex-1'>
          <Text
            className='font-semibold text-black text-base'
            numberOfLines={1}
          >
            {item.name || item.title}
          </Text>
          <Text className='text-sm text-gray-600 mt-1' numberOfLines={2}>
            {item.address || item.location}
          </Text>
          {item.description && (
            <Text className='text-xs text-gray-500 mt-1' numberOfLines={1}>
              {item.description}
            </Text>
          )}
          <View className='flex-row items-center justify-between mt-2'>
            <Text
              className={`text-xs font-medium px-2 py-1 rounded ${
                item.type === "External Location"
                  ? "text-blue-600 bg-blue-50"
                  : "text-green-600 bg-green-50"
              }`}
            >
              {item.type}
            </Text>
            {(item.rating ?? 0) > 0 && (
              <View className='flex-row items-center'>
                <Text className='text-xs text-orange-500 mr-1'>★</Text>
                <Text className='text-xs text-gray-600'>{item.rating}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className='flex-1 bg-white' edges={["top"]}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      {/* Map Container */}
      <View className='flex-1' style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={mapRegion}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          showsBuildings={true}
          showsTraffic={false}
          loadingEnabled={true}
          mapType='standard'
          onPress={() => setIsSearching(false)}
        >
          {/* Location Markers with Custom Images */}
          {allLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude || 0,
                longitude: location.longitude || 0,
              }}
              title={location.name || location.title}
              description={location.description || location.address}
              onPress={() => handleMarkerPress(location)}
              image={
                destinationLocation?.id === location.id
                  ? pinDestination // #BF0600 with transparent center for destination
                  : pinRegular // #22c55e with transparent center for others
              }
            />
          ))}

          {/* Destination Marker from Params (if not in allLocations) */}
          {destinationLocation &&
            !allLocations.find((loc) => loc.id === destinationLocation.id) && (
              <Marker
                key={`destination-${destinationLocation.id}`}
                coordinate={{
                  latitude: destinationLocation.latitude || 0,
                  longitude: destinationLocation.longitude || 0,
                }}
                title={destinationLocation.name || destinationLocation.title}
                description={
                  destinationLocation.description || destinationLocation.address
                }
                onPress={() => handleMarkerPress(destinationLocation)}
                image={pinDestination} // Red pin for destination
              />
            )}

          {/* Route Polyline */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={6}
              strokeColor='#22c55e'
              lineJoin='round'
              lineCap='round'
            />
          )}
        </MapView>

        {/* Header - Transparent overlay on top of map */}
        <View style={styles.headerOverlay}>
          <View className='flex-row items-center justify-between mb-4'>
            <TouchableOpacity
              onPress={() => router.back()}
              className='w-8 h-8 bg-white/40 rounded-full items-center justify-center p-2 border border-[#E6E6E6]'
            >
              <ChevronLeft size={24} color='#1F2937' />
            </TouchableOpacity>
            <Text className='text-gray-900 text-xl font-semibold'>
              <TranslatedText>Navigate</TranslatedText>
            </Text>
            <TouchableOpacity className='p-2  rounded-full shadow-md'>
              {/* <Menu size={24} color="#1f2937" /> */}
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className='bg-white rounded-base flex-row items-center px-3 py-2 shadow-sm border border-gray-200'>
            <Search size={20} color='#666' />
            <TextInput
              className='flex-1 ml-3 text-black'
              placeholder='Search destinations...'
              placeholderTextColor='#999'
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearching(true)}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={20} color='#666' />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results Overlay */}
        {isSearching && (
          <View style={styles.searchResults}>
            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item.id}
              renderItem={renderLocationItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className='p-4'>
                  <Text className='text-gray-500 text-center'>
                    <TranslatedText>No locations found</TranslatedText>
                  </Text>
                </View>
              }
            />
          </View>
        )}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            onPress={handleMyLocation}
            className='bg-white p-3 rounded-full shadow-lg border border-gray-200 mb-3'
            style={styles.controlButton}
            disabled={isAnimating}
          >
            <Locate size={20} color='#22c55e' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleResetView}
            className='bg-white p-3 rounded-full shadow-lg border border-gray-200'
            style={styles.controlButton}
            disabled={isAnimating}
          >
            <RotateCcw size={20} color='#22c55e' />
          </TouchableOpacity>
        </View>

        {/* Navigation Status */}
        {isNavigating && (
          <View style={styles.navigationStatus}>
            <View className='bg-green-500 rounded-lg p-3 flex-row items-center justify-between shadow-lg'>
              <View className='flex-row items-center flex-1'>
                <Route size={16} color='white' />
                <View className='ml-2'>
                  <Text className='text-white font-semibold text-sm'>
                    Navigating to {destinationLocation?.name}
                  </Text>
                  <Text className='text-green-100 text-xs'>
                    {navigationDistance} • {navigationDuration}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleStopNavigation}
                className='bg-green-600 rounded p-2 ml-2'
              >
                <X size={16} color='white' />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Navigation Card - Matching the image design */}
        <View style={styles.bottomCard}>
          <View className='bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl'>
            {/* Current Location with orange pin */}
            <View className='flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg'>
              <View className='bg-orange-500 p-2 rounded-full mr-3'>
                <MapPin size={16} color='white' />
              </View>
              <Text
                className='flex-1 text-gray-900 font-medium'
                numberOfLines={1}
              >
                {currentAddress}
              </Text>
            </View>

            {/* Destination with green pin */}
            <TouchableOpacity
              onPress={() => setIsSearching(true)}
              className='flex-row items-center mb-6 p-3 border border-gray-200 rounded-lg'
            >
              <View className='bg-green-500 p-2 rounded-full mr-3'>
                <MapPin size={16} color='white' />
              </View>
              <View className='flex-1'>
                {destinationLocation ? (
                  <Text className='text-gray-900 font-medium' numberOfLines={1}>
                    {destinationLocation.name || destinationLocation.title}
                  </Text>
                ) : (
                  <Text className='text-gray-500'>
                    <TranslatedText>Destination</TranslatedText>
                  </Text>
                )}
              </View>
              <ArrowUpRight size={20} color='#666' />
            </TouchableOpacity>

            {/* Set Direction Button */}
            <TouchableOpacity
              onPress={handleSetDirection}
              disabled={!destinationLocation || !userLocation}
              className={`rounded-base py-3 flex-row items-center justify-center ${
                destinationLocation && userLocation
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
              style={styles.setDirectionButton}
            >
              <Navigation2 size={20} color='white' />
              <Text className='text-white font-semibold text-base ml-2'>
                <TranslatedText>Set Direction</TranslatedText>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 5,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 1000,
  },
  searchInput: {
    fontSize: 16,
  },
  searchResults: {
    position: "absolute",
    top: 120,
    left: 16,
    right: 16,
    maxHeight: 300,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  locationItem: {
    borderLeftWidth: 3,
    borderLeftColor: "#22c55e",
  },
  mapControls: {
    position: "absolute",
    right: 16,
    top: 200,
    zIndex: 998,
  },
  controlButton: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navigationStatus: {
    position: "absolute",
    top: 130,
    left: 16,
    right: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 997,
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  setDirectionButton: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});
