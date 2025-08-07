// services/mockDataService.ts
import type { AllDataStructure } from "@/types/homeTypes";

interface OfflineRegionConfig {
  id: string;
  name: string;
  coverage: string;
  bounds: {
    northeast: { latitude: number; longitude: number };
    southwest: { latitude: number; longitude: number };
  };
  baseSize: number; // Base size in MB
}

interface OfflineDataCache {
  [regionId: string]: {
    locations: AllDataStructure[];
    mapTiles: boolean;
    lastUpdated: number;
    size: number;
  };
}

export class MockDataService {
  private static offlineCache: OfflineDataCache = {};
  private static apiEndpoint = "https://api.yourapp.com"; // Replace with your actual API endpoint

  // Predefined region configurations that work for any location data
  private static regionConfigs: OfflineRegionConfig[] = [
    {
      id: "denver",
      name: "Greater Denver Area",
      coverage: "Denver, Boulder, Aurora, Lakewood",
      bounds: {
        northeast: { latitude: 40.1, longitude: -104.5 },
        southwest: { latitude: 39.4, longitude: -105.3 },
      },
      baseSize: 120,
    },
    {
      id: "colorado-springs",
      name: "Colorado Springs Region",
      coverage: "Colorado Springs, Manitou Springs, Fountain",
      bounds: {
        northeast: { latitude: 39.0, longitude: -104.6 },
        southwest: { latitude: 38.7, longitude: -105.2 },
      },
      baseSize: 95,
    },
    {
      id: "rocky-mountains",
      name: "Rocky Mountain National Park",
      coverage: "Estes Park, Grand Lake, Trail Ridge Road",
      bounds: {
        northeast: { latitude: 40.6, longitude: -105.4 },
        southwest: { latitude: 40.1, longitude: -106.0 },
      },
      baseSize: 80,
    },
    {
      id: "western-colorado",
      name: "Western Colorado",
      coverage: "Grand Junction, Aspen, Vail, Durango",
      bounds: {
        northeast: { latitude: 40.8, longitude: -106.0 },
        southwest: { latitude: 37.0, longitude: -109.0 },
      },
      baseSize: 150,
    },
    {
      id: "central-colorado",
      name: "Central Colorado",
      coverage: "Mesa Verde, Great Sand Dunes, Black Canyon",
      bounds: {
        northeast: { latitude: 38.5, longitude: -105.0 },
        southwest: { latitude: 37.0, longitude: -109.0 },
      },
      baseSize: 110,
    },
  ];

  // Static data for demonstration - this would be replaced by API calls
  private static getStaticData(): AllDataStructure[] {
    return [
      {
        id: "item-1",
        title: "Rocky Mountain Adventure",
        name: "Rocky Mountain National Park",
        address: "1000 US Hwy 36, Estes Park, CO 80517",
        location: "Estes Park",
        latitude: 40.3428,
        longitude: -105.6836,
        eventCount: 12,
        type: "National Park",
        description: "Breathtaking mountain vistas and wildlife viewing",
        rating: 4.8,
        dateRange: "Year-round",
        images: [
          require("@/assets/images/hero1.png"),
          require("@/assets/recommend/recommend1.png"),
        ],
        isFeatured: true,
        phone: "(970) 586-1206",
        socialLinks: {
          facebook: "https://facebook.com/rockymountainnp",
          instagram: "https://instagram.com/rockynps",
          twitter: "https://twitter.com/rockynps",
          youtube: "https://youtube.com/rockymountainnp",
        },
        openingHours: "24 hours",
        priceLevel: 2,
        categories: [
          "Hiking",
          "Wildlife Viewing",
          "Photography",
          "Camping",
          "Nature",
        ],
        offlineSupported: true,
        offlineData: {
          mapTiles: true,
          detailsAvailable: true,
          navigationSupported: true,
        },
      },
      {
        id: "item-2",
        title: "Garden of the Gods Exploration",
        name: "Garden of the Gods",
        address: "1805 N 30th St, Colorado Springs, CO 80904",
        location: "Colorado Springs",
        latitude: 38.8719,
        longitude: -104.8761,
        eventCount: 10,
        type: "Park",
        description: "Stunning red rock formations and scenic trails",
        rating: 4.9,
        dateRange: "Year-round",
        images: [
          require("@/assets/recommend/recommend2.png"),
          require("@/assets/explores/explore1.png"),
        ],
        isFeatured: true,
        phone: "(719) 634-6666",
        socialLinks: {
          facebook: "https://facebook.com/gardenofthegods",
          instagram: "https://instagram.com/gardenofthegods",
          twitter: "https://twitter.com/gardenofthegods",
        },
        openingHours: "5:00 AM - 11:00 PM",
        priceLevel: 1,
        categories: [
          "Hiking",
          "Photography",
          "Free Admission",
          "Visitor Center",
          "Guided Tours",
        ],
        offlineSupported: true,
        offlineData: {
          mapTiles: true,
          detailsAvailable: true,
          navigationSupported: true,
        },
      },
      {
        id: "item-3",
        title: "Red Rocks Concert Experience",
        name: "Red Rocks Amphitheatre",
        address: "18300 W Alameda Pkwy, Morrison, CO 80465",
        location: "Morrison",
        latitude: 39.6654,
        longitude: -105.2057,
        eventCount: 15,
        type: "Entertainment",
        description: "Iconic outdoor concert venue with stunning acoustics",
        rating: 4.7,
        dateRange: "Seasonal",
        images: [
          require("@/assets/recommend/recommend3.png"),
          require("@/assets/explores/explore2.png"),
        ],
        isFeatured: true,
        phone: "(720) 865-2494",
        socialLinks: {
          facebook: "https://facebook.com/redrocksamphitheatre",
          instagram: "https://instagram.com/redrocksamphitheatre",
          twitter: "https://twitter.com/redrocks",
        },
        openingHours: "Varies by event",
        priceLevel: 3,
        categories: ["Concerts", "Hiking", "Museum", "Events", "Photography"],
        offlineSupported: true,
        offlineData: {
          mapTiles: true,
          detailsAvailable: true,
          navigationSupported: true,
        },
      },
      {
        id: "item-4",
        title: "Mesa Verde Cultural Journey",
        name: "Mesa Verde National Park",
        address: "Mesa Verde National Park, CO 81330",
        location: "Mesa Verde",
        latitude: 37.2308,
        longitude: -108.4618,
        eventCount: 8,
        type: "National Park",
        description: "Explore ancient cliff dwellings and archaeological sites",
        rating: 4.6,
        dateRange: "Year-round",
        images: [
          require("@/assets/recommend/recommend4.png"),
          require("@/assets/images/hero2.png"),
        ],
        isFeatured: false,
        phone: "(970) 529-4465",
        socialLinks: {
          facebook: "https://facebook.com/mesaverdenps",
          instagram: "https://instagram.com/mesaverdenps",
          twitter: "https://twitter.com/mesaverdenps",
        },
        openingHours: "8:00 AM - 5:00 PM",
        priceLevel: 2,
        categories: [
          "History",
          "Archaeology",
          "Guided Tours",
          "Museum",
          "Hiking",
        ],
        offlineSupported: true,
        offlineData: {
          mapTiles: true,
          detailsAvailable: true,
          navigationSupported: true,
        },
      },
      {
        id: "item-5",
        title: "Pikes Peak Summit Adventure",
        name: "Pikes Peak",
        address: "Pikes Peak, Colorado Springs, CO",
        location: "Colorado Springs",
        latitude: 38.8405,
        longitude: -105.0442,
        eventCount: 10,
        type: "Mountain",
        description: "Summit America's Mountain for panoramic views",
        rating: 4.8,
        dateRange: "Seasonal",
        images: [
          require("@/assets/recommend/recommend5.png"),
          require("@/assets/explores/explore3.png"),
        ],
        isFeatured: true,
        phone: "(719) 385-7325",
        socialLinks: {
          facebook: "https://facebook.com/pikespeak",
          instagram: "https://instagram.com/pikespeak",
          twitter: "https://twitter.com/pikespeak",
        },
        openingHours: "Seasonal hours vary",
        priceLevel: 3,
        categories: [
          "Hiking",
          "Photography",
          "Cog Railway",
          "Scenic Drive",
          "Adventure",
        ],
        offlineSupported: true,
        offlineData: {
          mapTiles: true,
          detailsAvailable: true,
          navigationSupported: true,
        },
      },
      {
        id: "item-6",
        title: "Great Sand Dunes Exploration",
        name: "Great Sand Dunes National Park",
        address: "11999 State Highway 150, Mosca, CO 81146",
        location: "Mosca",
        latitude: 37.7916,
        longitude: -105.5943,
        eventCount: 7,
        type: "National Park",
        description: "Experience North America's tallest sand dunes",
        rating: 4.5,
        dateRange: "Year-round",
        images: [
          require("@/assets/recommend/recommend6.png"),
          require("@/assets/explores/explore4.png"),
        ],
        isFeatured: false,
        phone: "(719) 378-6395",
        socialLinks: {
          facebook: "https://facebook.com/greatsanddunesnps",
          instagram: "https://instagram.com/greatsanddunesnps",
          twitter: "https://twitter.com/greatsanddunesnps",
        },
        openingHours: "24 hours",
        priceLevel: 2,
        categories: [
          "Sand Surfing",
          "Hiking",
          "Camping",
          "Stargazing",
          "Photography",
        ],
        offlineSupported: true,
        offlineData: {
          mapTiles: true,
          detailsAvailable: true,
          navigationSupported: true,
        },
      },
      {
        id: "item-7",
        title: "Black Canyon Exploration",
        name: "Black Canyon of the Gunnison",
        address: "1 Hwy 347, Montrose, CO 81401",
        location: "Montrose",
        latitude: 38.5753,
        longitude: -107.7416,
        eventCount: 6,
        type: "National Park",
        description: "Discover dramatic canyon walls and geological wonders",
        rating: 4.4,
        dateRange: "Year-round",
        images: [
          require("@/assets/recommend/recommend7.png"),
          require("@/assets/images/hero3.png"),
        ],
        isFeatured: false,
        phone: "(970) 249-1914",
        socialLinks: {
          facebook: "https://facebook.com/blackcanyonnps",
          instagram: "https://instagram.com/blackcanyonnps",
          twitter: "https://twitter.com/blackcanyonnps",
        },
        openingHours: "24 hours",
        priceLevel: 2,
        categories: [
          "Hiking",
          "Rock Climbing",
          "Scenic Drives",
          "Camping",
          "Photography",
        ],
        offlineSupported: true,
        offlineData: {
          mapTiles: true,
          detailsAvailable: true,
          navigationSupported: true,
        },
      },
      {
        id: "item-8",
        title: "Maroon Bells Scenic Tour",
        name: "Maroon Bells",
        address: "Maroon Creek Rd, Aspen, CO 81611",
        location: "Aspen",
        latitude: 39.0708,
        longitude: -106.989,
        eventCount: 9,
        type: "Mountain",
        description: "Most photographed peaks with alpine lakes",
        rating: 4.9,
        dateRange: "Seasonal",
        images: [
          require("@/assets/recommend/recommend8.png"),
          require("@/assets/explores/explore1.png"),
        ],
        isFeatured: true,
        phone: "(970) 925-3445",
        socialLinks: {
          facebook: "https://facebook.com/maroonbells",
          instagram: "https://instagram.com/maroonbells",
          twitter: "https://twitter.com/maroonbells",
        },
        openingHours: "Seasonal access",
        priceLevel: 2,
        categories: [
          "Photography",
          "Hiking",
          "Fishing",
          "Scenic Views",
          "Nature",
        ],
        offlineSupported: true,
        offlineData: {
          mapTiles: true,
          detailsAvailable: true,
          navigationSupported: true,
        },
      },
    ];
  }

  // API Methods - These would connect to your backend
  static async fetchAllLocations(): Promise<AllDataStructure[]> {
    try {
      // In real app, this would be an actual API call
      // const response = await fetch(`${this.apiEndpoint}/locations`);
      // const data = await response.json();
      // return data;

      // For now, return static data
      return this.getStaticData();
    } catch (error) {
      console.error("Error fetching locations:", error);
      // Return cached data or static data as fallback
      return this.getStaticData();
    }
  }

  static async fetchLocationsByRegion(
    regionId: string
  ): Promise<AllDataStructure[]> {
    try {
      // In real app:
      // const response = await fetch(`${this.apiEndpoint}/locations/region/${regionId}`);
      // const data = await response.json();
      // return data;

      // For now, filter static data by region
      const allLocations = await this.fetchAllLocations();
      return this.categorizeLocationsByRegion(allLocations, regionId);
    } catch (error) {
      console.error(`Error fetching locations for region ${regionId}:`, error);
      return [];
    }
  }

  static async fetchOfflineMapData(regionId: string): Promise<{
    locations: AllDataStructure[];
    mapTiles: string[];
    metadata: any;
  }> {
    try {
      // In real app:
      // const response = await fetch(`${this.apiEndpoint}/offline/region/${regionId}`);
      // const data = await response.json();
      // return data;

      const locations = await this.fetchLocationsByRegion(regionId);
      return {
        locations,
        mapTiles: this.generateMockMapTiles(regionId),
        metadata: {
          lastUpdated: Date.now(),
          version: "1.0.0",
          regionId,
        },
      };
    } catch (error) {
      console.error(
        `Error fetching offline data for region ${regionId}:`,
        error
      );
      throw error;
    }
  }

  // Dynamic region categorization
  private static categorizeLocationsByRegion(
    locations: AllDataStructure[],
    regionId: string
  ): AllDataStructure[] {
    const regionConfig = this.regionConfigs.find((r) => r.id === regionId);
    if (!regionConfig) return [];

    return locations.filter((location) => {
      // Check if location has coordinates
      if (!location.latitude || !location.longitude) return false;

      // Check if location is within region bounds
      const withinBounds = this.isLocationWithinBounds(
        location,
        regionConfig.bounds
      );

      // Also check location name/address for keywords
      const matchesKeywords = this.locationMatchesRegionKeywords(
        location,
        regionId
      );

      return withinBounds || matchesKeywords;
    });
  }

  private static isLocationWithinBounds(
    location: AllDataStructure,
    bounds: OfflineRegionConfig["bounds"]
  ): boolean {
    if (!location.latitude || !location.longitude) return false;

    return (
      location.latitude >= bounds.southwest.latitude &&
      location.latitude <= bounds.northeast.latitude &&
      location.longitude >= bounds.southwest.longitude &&
      location.longitude <= bounds.northeast.longitude
    );
  }

  private static locationMatchesRegionKeywords(
    location: AllDataStructure,
    regionId: string
  ): boolean {
    const locationText = [
      location.name,
      location.location,
      location.address,
      location.title,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const regionKeywords: { [key: string]: string[] } = {
      denver: [
        "denver",
        "boulder",
        "aurora",
        "lakewood",
        "thornton",
        "westminster",
      ],
      "colorado-springs": [
        "colorado springs",
        "manitou springs",
        "fountain",
        "security",
      ],
      "rocky-mountains": [
        "estes park",
        "rocky mountain",
        "grand lake",
        "trail ridge",
      ],
      "western-colorado": [
        "aspen",
        "vail",
        "durango",
        "grand junction",
        "montrose",
        "gunnison",
        "steamboat",
      ],
      "central-colorado": [
        "mesa verde",
        "mosca",
        "great sand dunes",
        "alamosa",
        "pueblo",
      ],
    };

    const keywords = regionKeywords[regionId] || [];
    return keywords.some((keyword) => locationText.includes(keyword));
  }

  // Generate mock map tiles URLs - in real app, these would be actual tile URLs
  private static generateMockMapTiles(regionId: string): string[] {
    const baseUrl =
      "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles";
    const tiles: string[] = [];

    // Generate tile URLs for different zoom levels
    for (let z = 8; z <= 16; z++) {
      tiles.push(`${baseUrl}/${z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN`);
    }

    return tiles;
  }

  // Offline Data Management
  static async downloadOfflineRegion(
    regionId: string,
    onProgress?: (progress: number) => void
  ): Promise<boolean> {
    try {
      onProgress?.(0);

      // Fetch offline data
      const offlineData = await this.fetchOfflineMapData(regionId);
      onProgress?.(30);

      // Simulate downloading map tiles
      await this.simulateMapTileDownload(regionId, onProgress);
      onProgress?.(80);

      // Cache the data
      this.offlineCache[regionId] = {
        locations: offlineData.locations,
        mapTiles: true,
        lastUpdated: Date.now(),
        size: this.calculateRegionSize(offlineData.locations.length),
      };

      // Store in device storage (AsyncStorage in real app)
      await this.storeOfflineData(regionId, offlineData);
      onProgress?.(100);

      return true;
    } catch (error) {
      console.error(`Error downloading offline region ${regionId}:`, error);
      return false;
    }
  }

  private static async simulateMapTileDownload(
    regionId: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    // Simulate downloading process
    const totalSteps = 10;
    for (let i = 0; i < totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const progress = 30 + (50 * (i + 1)) / totalSteps;
      onProgress?.(progress);
    }
  }

  private static async storeOfflineData(
    regionId: string,
    data: any
  ): Promise<void> {
    try {
      // In real app, use AsyncStorage:
      // await AsyncStorage.setItem(`offline_region_${regionId}`, JSON.stringify(data));

      // For now, just log
      console.log(`Stored offline data for region ${regionId}`);
    } catch (error) {
      console.error(
        `Error storing offline data for region ${regionId}:`,
        error
      );
      throw error;
    }
  }

  static async loadOfflineData(regionId: string): Promise<AllDataStructure[]> {
    try {
      // In real app:
      // const data = await AsyncStorage.getItem(`offline_region_${regionId}`);
      // if (data) {
      //   const parsedData = JSON.parse(data);
      //   return parsedData.locations;
      // }

      // For now, return cached data
      return this.offlineCache[regionId]?.locations || [];
    } catch (error) {
      console.error(
        `Error loading offline data for region ${regionId}:`,
        error
      );
      return [];
    }
  }

  static async deleteOfflineRegion(regionId: string): Promise<boolean> {
    try {
      // Remove from cache
      delete this.offlineCache[regionId];

      // Remove from device storage
      // await AsyncStorage.removeItem(`offline_region_${regionId}`);

      return true;
    } catch (error) {
      console.error(`Error deleting offline region ${regionId}:`, error);
      return false;
    }
  }

  static isRegionDownloaded(regionId: string): boolean {
    return !!this.offlineCache[regionId];
  }

  static getOfflineRegionSize(regionId: string): number {
    return this.offlineCache[regionId]?.size || 0;
  }

  private static calculateRegionSize(locationCount: number): number {
    // Calculate size based on number of locations and base region size
    const baseSize = 50; // MB
    const sizePerLocation = 2; // MB per location
    return baseSize + locationCount * sizePerLocation;
  }

  // Generate dynamic offline regions from any data source
  static async generateOfflineRegions(customData?: AllDataStructure[]): Promise<
    {
      id: string;
      name: string;
      size: string;
      sizeInMB: number;
      downloaded: boolean;
      downloading: boolean;
      coverage: string;
      locations: AllDataStructure[];
      bounds: OfflineRegionConfig["bounds"];
    }[]
  > {
    try {
      const allLocations = customData || (await this.fetchAllLocations());

      return this.regionConfigs
        .map((config) => {
          const regionLocations = this.categorizeLocationsByRegion(
            allLocations,
            config.id
          );
          const sizeInMB = config.baseSize + regionLocations.length * 2;

          return {
            id: config.id,
            name: config.name,
            size: `${sizeInMB} MB`,
            sizeInMB,
            downloaded: this.isRegionDownloaded(config.id),
            downloading: false,
            coverage: config.coverage,
            locations: regionLocations,
            bounds: config.bounds,
          };
        })
        .filter((region) => region.locations.length > 0);
    } catch (error) {
      console.error("Error generating offline regions:", error);
      return [];
    }
  }

  // Existing methods (corrected and enhanced)
  static async getUnifiedData(): Promise<AllDataStructure[]> {
    return await this.fetchAllLocations();
  }

  static async getExploreData(): Promise<{
    hiking: AllDataStructure[];
    travels: AllDataStructure[];
  }> {
    const data = await this.fetchAllLocations();
    return {
      hiking: data.filter(
        (item) =>
          item.categories?.includes("Hiking") ||
          item.type === "National Park" ||
          item.type === "Mountain"
      ),
      travels: data.filter(
        (item) =>
          item.categories?.includes("Photography") ||
          item.categories?.includes("Scenic Views") ||
          item.type === "Park"
      ),
    };
  }

  static async getEnhancedRecommendations(): Promise<AllDataStructure[]> {
    const data = await this.fetchAllLocations();
    return data.filter((item) => item.isFeatured);
  }

  static async getMapLocations(): Promise<AllDataStructure[]> {
    return await this.fetchAllLocations();
  }

  static async getOfflineSupportedLocations(): Promise<AllDataStructure[]> {
    const data = await this.fetchAllLocations();
    return data.filter((item) => item.offlineSupported);
  }

  static async getLocationsByOfflineRegion(
    regionId: string
  ): Promise<AllDataStructure[]> {
    // First try to get from offline cache
    const offlineData = await this.loadOfflineData(regionId);
    if (offlineData.length > 0) {
      return offlineData;
    }

    // Otherwise fetch from API
    return await this.fetchLocationsByRegion(regionId);
  }

  static async getCategoryExploreItems(
    categoryId: string
  ): Promise<AllDataStructure[]> {
    const data = await this.fetchAllLocations();
    return data.filter((item) =>
      item.categories?.some((cat) =>
        cat.toLowerCase().includes(categoryId.toLowerCase())
      )
    );
  }

  static async searchContent(query: string) {
    const data = await this.fetchAllLocations();
    const lowercaseQuery = query.toLowerCase();

    return {
      hiking: data.filter(
        (item) =>
          item.categories?.includes("Hiking") &&
          (item.title?.toLowerCase().includes(lowercaseQuery) ||
            item.description?.toLowerCase().includes(lowercaseQuery) ||
            item.location?.toLowerCase().includes(lowercaseQuery) ||
            item.name?.toLowerCase().includes(lowercaseQuery))
      ),
      travels: data.filter(
        (item) =>
          item.categories?.includes("Photography") &&
          (item.title?.toLowerCase().includes(lowercaseQuery) ||
            item.description?.toLowerCase().includes(lowercaseQuery) ||
            item.location?.toLowerCase().includes(lowercaseQuery) ||
            item.name?.toLowerCase().includes(lowercaseQuery))
      ),
      recommendations: data.filter(
        (item) =>
          item.isFeatured &&
          (item.title?.toLowerCase().includes(lowercaseQuery) ||
            item.description?.toLowerCase().includes(lowercaseQuery) ||
            item.location?.toLowerCase().includes(lowercaseQuery) ||
            item.name?.toLowerCase().includes(lowercaseQuery))
      ),
      locations: data.filter(
        (item) =>
          item.name?.toLowerCase().includes(lowercaseQuery) ||
          item.address?.toLowerCase().includes(lowercaseQuery) ||
          item.type?.toLowerCase().includes(lowercaseQuery) ||
          item.description?.toLowerCase().includes(lowercaseQuery)
      ),
    };
  }

  static async getNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<AllDataStructure[]> {
    const locations = await this.getMapLocations();

    return locations
      .filter((location) => {
        if (!location.latitude || !location.longitude) return false;
        const distance = this.calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        );
        return distance <= radiusKm;
      })
      .sort((a, b) => {
        const distanceA = this.calculateDistance(
          latitude,
          longitude,
          a.latitude || 0,
          a.longitude || 0
        );
        const distanceB = this.calculateDistance(
          latitude,
          longitude,
          b.latitude || 0,
          b.longitude || 0
        );
        return distanceA - distanceB;
      });
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static async getLocationById(
    id: string
  ): Promise<AllDataStructure | undefined> {
    const locations = await this.getMapLocations();
    return locations.find((location) => location.id === id);
  }

  static async getFeaturedLocations(
    count: number = 3
  ): Promise<AllDataStructure[]> {
    const locations = await this.getMapLocations();
    const featured = locations.filter((item) => item.isFeatured);
    const shuffled = featured.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static async getLocationsByType(type: string): Promise<AllDataStructure[]> {
    const locations = await this.getMapLocations();
    return locations.filter(
      (location) => location.type?.toLowerCase() === type.toLowerCase()
    );
  }

  static async getLocationsByCategory(
    category: string
  ): Promise<AllDataStructure[]> {
    const locations = await this.getMapLocations();
    return locations.filter((location) =>
      location.categories?.some((cat) =>
        cat.toLowerCase().includes(category.toLowerCase())
      )
    );
  }

  static async getLocationsByRating(
    minRating: number,
    maxRating: number = 5
  ): Promise<AllDataStructure[]> {
    const locations = await this.getMapLocations();
    return locations.filter(
      (location) =>
        location.rating &&
        location.rating >= minRating &&
        location.rating <= maxRating
    );
  }

  static async getLocationsByPriceLevel(
    priceLevel: number
  ): Promise<AllDataStructure[]> {
    const locations = await this.getMapLocations();
    return locations.filter((location) => location.priceLevel === priceLevel);
  }

  static async getExploreItemsByCategory(
    category: string
  ): Promise<AllDataStructure[]> {
    const data = await this.fetchAllLocations();
    return data.filter((item) =>
      item.categories?.some((cat) =>
        cat.toLowerCase().includes(category.toLowerCase())
      )
    );
  }

  static async getFeaturedRecommendations(): Promise<AllDataStructure[]> {
    return await this.getEnhancedRecommendations();
  }

  static async getRecommendationsByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<AllDataStructure[]> {
    const recommendations = await this.getEnhancedRecommendations();
    return recommendations.filter(
      (item) =>
        item.priceLevel !== undefined &&
        item.priceLevel >= minPrice &&
        item.priceLevel <= maxPrice
    );
  }

  static async getAllLocationCategories(): Promise<string[]> {
    const locations = await this.getMapLocations();
    const categories = new Set<string>();

    locations.forEach((location) => {
      location.categories?.forEach((category) => categories.add(category));
    });

    return Array.from(categories).sort();
  }

  static async getAllLocationTypes(): Promise<string[]> {
    const locations = await this.getMapLocations();
    const types = new Set<string>();

    locations.forEach((location) => types.add(location.type || "Unknown"));

    return Array.from(types).sort();
  }

  static async getLocationStatistics() {
    const locations = await this.getMapLocations();
    const recommendations = await this.getEnhancedRecommendations();
    const exploreData = await this.getExploreData();
    const types = await this.getAllLocationTypes();

    return {
      totalLocations: locations.length,
      totalRecommendations: recommendations.length,
      totalHikingItems: exploreData.hiking.length,
      totalTravelItems: exploreData.travels.length,
      averageRating:
        locations.reduce((sum, loc) => sum + (loc.rating || 0), 0) /
        locations.length,
      locationsByType: await Promise.all(
        types.map(async (type) => ({
          type,
          count: (await this.getLocationsByType(type)).length,
        }))
      ),
      locationsByPriceLevel: await Promise.all(
        [1, 2, 3].map(async (level) => ({
          level,
          count: (await this.getLocationsByPriceLevel(level)).length,
        }))
      ),
    };
  }

  static async getRandomDiscoveryItems(
    count: number = 5
  ): Promise<AllDataStructure[]> {
    const allItems = await this.fetchAllLocations();
    const shuffled = allItems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static async filterItems(criteria: {
    category?: string;
    minRating?: number;
    maxPrice?: number;
    location?: string;
    type?: string;
  }) {
    let filteredItems = await this.fetchAllLocations();

    // Apply filters
    if (criteria.category) {
      filteredItems = filteredItems.filter((item) =>
        item.categories?.some((cat) =>
          cat.toLowerCase().includes(criteria.category!.toLowerCase())
        )
      );
    }

    if (criteria.minRating) {
      filteredItems = filteredItems.filter(
        (item) => item.rating && item.rating >= criteria.minRating!
      );
    }

    if (criteria.maxPrice) {
      filteredItems = filteredItems.filter(
        (item) => item.priceLevel && item.priceLevel <= criteria.maxPrice!
      );
    }

    if (criteria.location) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.location
            ?.toLowerCase()
            .includes(criteria.location!.toLowerCase()) ||
          item.name?.toLowerCase().includes(criteria.location!.toLowerCase()) ||
          item.address?.toLowerCase().includes(criteria.location!.toLowerCase())
      );
    }

    if (criteria.type) {
      filteredItems = filteredItems.filter(
        (item) => item.type?.toLowerCase() === criteria.type!.toLowerCase()
      );
    }

    return {
      hiking: filteredItems.filter((item) =>
        item.categories?.includes("Hiking")
      ),
      travels: filteredItems.filter((item) =>
        item.categories?.includes("Photography")
      ),
      recommendations: filteredItems.filter((item) => item.isFeatured),
      locations: filteredItems,
    };
  }

  // Network status methods for offline functionality
  static async syncOfflineData(): Promise<boolean> {
    try {
      // Check which regions are downloaded
      const downloadedRegions = Object.keys(this.offlineCache);

      for (const regionId of downloadedRegions) {
        // Fetch latest data for each region
        const latestData = await this.fetchLocationsByRegion(regionId);

        // Update offline cache
        this.offlineCache[regionId] = {
          ...this.offlineCache[regionId],
          locations: latestData,
          lastUpdated: Date.now(),
        };

        // Update stored data
        await this.storeOfflineData(regionId, {
          locations: latestData,
          mapTiles: this.generateMockMapTiles(regionId),
          metadata: {
            lastUpdated: Date.now(),
            version: "1.0.0",
            regionId,
          },
        });
      }

      return true;
    } catch (error) {
      console.error("Error syncing offline data:", error);
      return false;
    }
  }

  static getOfflineDataInfo(): {
    totalRegions: number;
    totalSize: number;
    totalLocations: number;
    lastSyncTime: number;
    regions: {
      id: string;
      name: string;
      size: number;
      locationCount: number;
    }[];
  } {
    const regions = Object.entries(this.offlineCache).map(([id, data]) => {
      const config = this.regionConfigs.find((r) => r.id === id);
      return {
        id,
        name: config?.name || id,
        size: data.size,
        locationCount: data.locations.length,
      };
    });

    return {
      totalRegions: regions.length,
      totalSize: regions.reduce((sum, region) => sum + region.size, 0),
      totalLocations: regions.reduce(
        (sum, region) => sum + region.locationCount,
        0
      ),
      lastSyncTime: Math.max(
        ...Object.values(this.offlineCache).map((data) => data.lastUpdated),
        0
      ),
      regions,
    };
  }

  // Utility method to check if app is in offline mode
  static isOfflineMode(): boolean {
    // In real app, this would check network connectivity
    // For now, assume online
    return false;
  }

  // Method to get data with offline fallback
  static async getDataWithOfflineFallback<T>(
    onlineMethod: () => Promise<T>,
    offlineMethod: () => Promise<T>
  ): Promise<T> {
    try {
      if (this.isOfflineMode()) {
        return await offlineMethod();
      } else {
        return await onlineMethod();
      }
    } catch (error) {
      console.warn("Online method failed, falling back to offline:", error);
      return await offlineMethod();
    }
  }
}
