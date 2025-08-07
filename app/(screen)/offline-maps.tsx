// app\(screen)\offline-maps.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  StatusBar,
  RefreshControl,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { MockDataService } from "@/services/mockDataService";
import type { AllDataStructure } from "@/types/homeTypes";
import {
  Download,
  CircleCheck as CheckCircle,
  MapPin,
  Trash2,
  RefreshCw,
  Wifi,
  WifiOff,
  HardDrive,
  Clock,
  Info,
  X,
  ChevronLeft,
} from "lucide-react-native";
import { router } from "expo-router";

interface OfflineRegion {
  id: string;
  name: string;
  size: string;
  sizeInMB: number;
  downloaded: boolean;
  downloading: boolean;
  coverage: string;
  locations: AllDataStructure[];
  bounds: {
    northeast: { latitude: number; longitude: number };
    southwest: { latitude: number; longitude: number };
  };
  downloadProgress?: number;
  lastUpdated?: number;
}

interface DownloadProgress {
  [regionId: string]: number;
}

export default function OfflineScreen() {
  const [regions, setRegions] = useState<OfflineRegion[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>(
    {}
  );
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<OfflineRegion | null>(
    null
  );
  const [isOnline, setIsOnline] = useState(true);

  // Load regions on component mount
  useEffect(() => {
    loadRegions();
    checkNetworkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkNetworkStatus = useCallback(() => {
    // In real app, use NetInfo or similar to check connectivity
    setIsOnline(!MockDataService.isOfflineMode());
  }, []);

  const loadRegions = useCallback(async () => {
    try {
      const offlineRegions = await MockDataService.generateOfflineRegions();
      setRegions(offlineRegions);
    } catch (error) {
      console.error("Error loading regions:", error);
      Alert.alert("Error", "Failed to load offline regions");
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadRegions();
      checkNetworkStatus();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  }, [loadRegions, checkNetworkStatus]);

  const handleDownload = useCallback(
    async (regionId: string) => {
      const region = regions.find((r) => r.id === regionId);
      if (!region) return;

      if (!isOnline) {
        Alert.alert(
          "No Internet Connection",
          "You need an internet connection to download offline maps."
        );
        return;
      }

      // Update region state to show downloading
      setRegions((prev) =>
        prev.map((r) =>
          r.id === regionId
            ? { ...r, downloading: true, downloadProgress: 0 }
            : r
        )
      );

      try {
        const success = await MockDataService.downloadOfflineRegion(
          regionId,
          (progress) => {
            setDownloadProgress((prev) => ({
              ...prev,
              [regionId]: progress,
            }));

            // Update region progress
            setRegions((prev) =>
              prev.map((r) =>
                r.id === regionId ? { ...r, downloadProgress: progress } : r
              )
            );
          }
        );

        if (success) {
          // Update region state to show downloaded
          setRegions((prev) =>
            prev.map((r) =>
              r.id === regionId
                ? {
                    ...r,
                    downloaded: true,
                    downloading: false,
                    downloadProgress: 100,
                    lastUpdated: Date.now(),
                  }
                : r
            )
          );

          Alert.alert(
            "Download Complete",
            `${region.name} is now available offline with ${region.locations.length} locations!`,
            [
              {
                text: "OK",
                onPress: () => {
                  // Clean up progress state
                  setDownloadProgress((prev) => {
                    const updated = { ...prev };
                    delete updated[regionId];
                    return updated;
                  });
                },
              },
            ]
          );
        } else {
          throw new Error("Download failed");
        }
      } catch (error) {
        console.error("Download error:", error);

        // Reset region state
        setRegions((prev) =>
          prev.map((r) =>
            r.id === regionId
              ? { ...r, downloading: false, downloadProgress: 0 }
              : r
          )
        );

        Alert.alert(
          "Download Failed",
          "Failed to download offline map. Please try again."
        );
      }
    },
    [regions, isOnline]
  );

  const handleDelete = useCallback(
    (regionId: string) => {
      const region = regions.find((r) => r.id === regionId);
      if (!region) return;

      Alert.alert(
        "Delete Offline Map",
        `Are you sure you want to delete the offline map for ${region.name}? This will remove ${region.locations.length} locations from offline access and free up ${region.size} of storage.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const success =
                  await MockDataService.deleteOfflineRegion(regionId);
                if (success) {
                  setRegions((prev) =>
                    prev.map((r) =>
                      r.id === regionId
                        ? {
                            ...r,
                            downloaded: false,
                            downloading: false,
                            lastUpdated: undefined,
                          }
                        : r
                    )
                  );
                } else {
                  throw new Error("Delete failed");
                }
              } catch (error) {
                console.error("Delete error:", error);
                Alert.alert("Error", "Failed to delete offline map");
              }
            },
          },
        ]
      );
    },
    [regions]
  );

  const handleSync = useCallback(async () => {
    if (!isOnline) {
      Alert.alert(
        "No Internet Connection",
        "You need an internet connection to sync offline data."
      );
      return;
    }

    setSyncing(true);
    try {
      const success = await MockDataService.syncOfflineData();
      if (success) {
        await loadRegions();
        Alert.alert("Sync Complete", "All offline data has been updated.");
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      console.error("Sync error:", error);
      Alert.alert(
        "Sync Failed",
        "Failed to sync offline data. Please try again."
      );
    } finally {
      setSyncing(false);
    }
  }, [isOnline, loadRegions]);

  const showRegionDetails = useCallback((region: OfflineRegion) => {
    setSelectedRegion(region);
    setShowInfoModal(true);
  }, []);

  const formatFileSize = useCallback((sizeInMB: number): string => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  }, []);

  const formatLastUpdated = useCallback((timestamp?: number): string => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  }, []);

  const renderRegion = useCallback(
    ({ item }: { item: OfflineRegion }) => {
      const progress = downloadProgress[item.id] || item.downloadProgress || 0;

      return (
        <View className="bg-white rounded-xl p-4 mb-4 mx-4 shadow-sm border border-gray-100">
          <View className="flex-row items-start justify-between mb-3">
            <TouchableOpacity
              onPress={() => showRegionDetails(item)}
              className="flex-1"
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {item.name}
                  </Text>
                  <Text
                    className="text-sm text-gray-600 mb-2"
                    numberOfLines={2}
                  >
                    {item.coverage}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => showRegionDetails(item)}
                  className="ml-2 p-1"
                >
                  <Info size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <HardDrive size={12} color="#22c55e" />
                  <Text className="text-xs text-green-600 font-medium ml-1">
                    {item.size}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MapPin size={12} color="#6b7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {item.locations.length} locations
                  </Text>
                </View>
                {item.downloaded && item.lastUpdated && (
                  <View className="flex-row items-center">
                    <Clock size={12} color="#6b7280" />
                    <Text className="text-xs text-gray-500 ml-1">
                      {formatLastUpdated(item.lastUpdated)}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center justify-end space-x-2">
            {item.downloaded ? (
              <>
                <View className="flex-row items-center mr-3">
                  <CheckCircle size={16} color="#22c55e" />
                  <Text className="text-green-600 text-sm font-medium ml-1">
                    <TranslatedText>Downloaded</TranslatedText>
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  className="bg-red-100 px-3 py-2 rounded-lg flex-row items-center"
                >
                  <Trash2 size={14} color="#dc2626" />
                  <Text className="text-red-600 text-sm font-medium ml-1">
                    <TranslatedText>Delete</TranslatedText>
                  </Text>
                </TouchableOpacity>
              </>
            ) : item.downloading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#22c55e" />
                <Text className="text-green-600 text-sm ml-2">
                  <TranslatedText>Downloading...</TranslatedText>{" "}
                  {Math.round(progress)}%
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => handleDownload(item.id)}
                disabled={!isOnline}
                className={`px-4 py-2 rounded-lg flex-row items-center ${
                  isOnline ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <Download size={16} color={isOnline ? "white" : "#9ca3af"} />
                <Text
                  className={`text-sm font-medium ml-2 ${
                    isOnline ? "text-white" : "text-gray-500"
                  }`}
                >
                  <TranslatedText>Download</TranslatedText>
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Progress Bar */}
          {item.downloading && (
            <View className="mt-3">
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>
          )}

          {/* Sample Locations Preview */}
          {item.locations.length > 0 && (
            <View className="mt-3 p-3 bg-gray-50 rounded-lg">
              <Text className="text-xs text-gray-600 mb-2">
                <TranslatedText>Sample locations:</TranslatedText>
              </Text>
              <Text className="text-xs text-gray-800" numberOfLines={2}>
                {item.locations
                  .slice(0, 3)
                  .map((loc) => loc.name || loc.title)
                  .join(", ")}
                {item.locations.length > 3 &&
                  ` and ${item.locations.length - 3} more...`}
              </Text>
            </View>
          )}
        </View>
      );
    },
    [
      downloadProgress,
      showRegionDetails,
      handleDownload,
      handleDelete,
      isOnline,
      formatLastUpdated,
    ]
  );

  const renderInfoModal = () => (
    <Modal
      visible={showInfoModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowInfoModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">
              {selectedRegion?.name}
            </Text>
            <TouchableOpacity
              onPress={() => setShowInfoModal(false)}
              className="p-2"
            >
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedRegion && (
              <>
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    <TranslatedText>Coverage Area</TranslatedText>
                  </Text>
                  <Text className="text-gray-600">
                    {selectedRegion.coverage}
                  </Text>
                </View>

                <View className="flex-row mb-4 space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-1">
                      <TranslatedText>Size</TranslatedText>
                    </Text>
                    <Text className="text-lg font-semibold text-green-600">
                      {selectedRegion.size}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-1">
                      <TranslatedText>Locations</TranslatedText>
                    </Text>
                    <Text className="text-lg font-semibold text-blue-600">
                      {selectedRegion.locations.length}
                    </Text>
                  </View>
                </View>

                {selectedRegion.downloaded && selectedRegion.lastUpdated && (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">
                      <TranslatedText>Last Updated</TranslatedText>
                    </Text>
                    <Text className="text-gray-600">
                      {formatLastUpdated(selectedRegion.lastUpdated)}
                    </Text>
                  </View>
                )}

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    <TranslatedText>Included Locations</TranslatedText>
                  </Text>
                  <View className="bg-gray-50 rounded-lg p-3 max-h-48">
                    <ScrollView>
                      {selectedRegion.locations.map((location) => (
                        <View key={location.id} className="mb-2">
                          <Text className="text-sm font-medium text-gray-800">
                            {location.name || location.title}
                          </Text>
                          <Text className="text-xs text-gray-600">
                            {location.type} • {location.location}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    <TranslatedText>Coordinates</TranslatedText>
                  </Text>
                  <Text className="text-xs text-gray-600">
                    Northeast:{" "}
                    {selectedRegion.bounds.northeast.latitude.toFixed(4)},{" "}
                    {selectedRegion.bounds.northeast.longitude.toFixed(4)}
                  </Text>
                  <Text className="text-xs text-gray-600">
                    Southwest:{" "}
                    {selectedRegion.bounds.southwest.latitude.toFixed(4)},{" "}
                    {selectedRegion.bounds.southwest.longitude.toFixed(4)}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Calculate statistics
  const downloadedCount = regions.filter((r) => r.downloaded).length;
  const totalSize = regions
    .filter((r) => r.downloaded)
    .reduce((acc, region) => acc + region.sizeInMB, 0);
  const totalLocations = regions
    .filter((r) => r.downloaded)
    .reduce((acc, region) => acc + region.locations.length, 0);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <StatusBar backgroundColor="#4CAF50" />

      {/* Header */}
      <View className="bg-green-500 -mt-16 pt-20 pb-5 px-5">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-8 h-8 bg-white/40 rounded-full items-center justify-center p-1 border border-[#E6E6E6]"
          >
            <ChevronLeft size={20} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            <TranslatedText>Offline Maps</TranslatedText>
          </Text>
          <View className="flex-row items-center space-x-2">
            {isOnline ? (
              <Wifi size={20} color="white" />
            ) : (
              <WifiOff size={20} color="#fbbf24" />
            )}
            <TouchableOpacity
              onPress={handleSync}
              disabled={!isOnline || syncing}
              className="p-2"
            >
              <RefreshCw
                size={20}
                color={isOnline ? "white" : "#9ca3af"}
                style={{ transform: [{ rotate: syncing ? "360deg" : "0deg" }] }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View className="bg-white/20 rounded-lg p-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/80 text-sm">
                <TranslatedText>Downloaded</TranslatedText>
              </Text>
              <Text className="text-white text-xl font-bold">
                {downloadedCount}
              </Text>
            </View>
            <View>
              <Text className="text-white/80 text-sm">
                <TranslatedText>Total Size</TranslatedText>
              </Text>
              <Text className="text-white text-xl font-bold">
                {formatFileSize(totalSize)}
              </Text>
            </View>
            <View>
              <Text className="text-white/80 text-sm">
                <TranslatedText>Locations</TranslatedText>
              </Text>
              <Text className="text-white text-xl font-bold">
                {totalLocations}
              </Text>
            </View>
          </View>
        </View>

        {!isOnline && (
          <View className="bg-yellow-500/20 rounded-lg p-3 mt-3">
            <View className="flex-row items-center">
              <WifiOff size={16} color="#fbbf24" />
              <Text className="text-yellow-100 text-sm ml-2">
                <TranslatedText>
                  You&apos;re offline. Only downloaded regions are available.
                </TranslatedText>
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Regions List */}
      <FlatList
        data={regions}
        renderItem={renderRegion}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="px-4 py-8">
            <Text className="text-center text-gray-500">
              <TranslatedText>No offline regions available</TranslatedText>
            </Text>
          </View>
        }
      />

      {renderInfoModal()}
    </SafeAreaView>
  );
}
