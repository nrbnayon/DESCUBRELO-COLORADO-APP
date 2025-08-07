// services/homeService.ts
import type { Category, HeroSlide, AllDataStructure } from "@/types/homeTypes";

export class CategoryService {
  // Mock categories data
  static getCategories(): Category[] {
    return [
      {
        id: "1",
        name: "Concert",
        icon: "🎵",
        image: require("@/assets/categories/concert.png"),
        color: "purple",
        priority: 1,
        isActive: true,
      },
      {
        id: "2",
        name: "Food",
        icon: "🍟",
        image: require("@/assets/categories/food.png"),
        color: "orange",
        priority: 2,
        isActive: true,
      },
      {
        id: "3",
        name: "Hiking",
        icon: "🏔️",
        image: require("@/assets/categories/hiking.png"),
        color: "green",
        priority: 3,
        isActive: true,
      },
      {
        id: "4",
        name: "Towns",
        icon: "🏢",
        image: require("@/assets/categories/town.png"),
        color: "blue",
        priority: 4,
        isActive: true,
      },
      {
        id: "5",
        name: "Resources",
        icon: "📱",
        image: require("@/assets/categories/resources.png"),
        color: "indigo",
        priority: 5,
        isActive: true,
      },
      {
        id: "6",
        name: "Events",
        icon: "🎉",
        image: require("@/assets/categories/events.png"),
        color: "pink",
        priority: 6,
        isActive: true,
      },
      {
        id: "7",
        name: "Store",
        icon: "🏪",
        image: require("@/assets/categories/store.png"),
        color: "yellow",
        priority: 7,
        isActive: true,
      },
      {
        id: "8",
        name: "Q&A",
        icon: "❓",
        image: require("@/assets/categories/qna.png"),
        color: "red",
        priority: 8,
        isActive: true,
      },
      {
        id: "9",
        name: "Local Business",
        icon: "📍",
        image: require("@/assets/categories/business.png"),
        color: "teal",
        priority: 9,
        isActive: true,
      },
      {
        id: "10",
        name: "Attraction",
        icon: "🎢",
        image: require("@/assets/categories/attraction.png"),
        color: "cyan",
        priority: 10,
        isActive: true,
      },
      {
        id: "11",
        name: "Lodging",
        icon: "🏨",
        image: require("@/assets/categories/lodging.png"),
        color: "violet",
        priority: 11,
        isActive: true,
      },
      {
        id: "12",
        name: "21+",
        icon: "🔞",
        image: require("@/assets/categories/lodging.png"),
        color: "amber",
        priority: 12,
        isActive: true,
      },
      {
        id: "13",
        name: "Sports",
        icon: "⚽",
        image: require("@/assets/categories/sports.png"),
        color: "emerald",
        priority: 13,
        isActive: true,
      },
      {
        id: "14",
        name: "Art & Culture",
        icon: "🎨",
        image: require("@/assets/categories/art.png"),
        color: "rose",
        priority: 14,
        isActive: true,
      },
      {
        id: "15",
        name: "Shopping",
        icon: "🛍️",
        image: require("@/assets/categories/store.png"),
        color: "lime",
        priority: 15,
        isActive: true,
      },
      {
        id: "16",
        name: "Health",
        icon: "🏥",
        image: require("@/assets/categories/health.png"),
        color: "sky",
        priority: 16,
        isActive: true,
      },
    ];
  }

  // Get explore items
  static getExploreItems(): AllDataStructure[] {
    return [
      {
        id: "explore-1",
        title: "Hiking Adventures",
        name: "Rocky Mountain Trails",
        address: "1000 US Hwy 36, Estes Park, CO 80517",
        location: "Rocky Mountain National Park",
        latitude: 40.3428,
        longitude: -105.6836,
        eventCount: 10,
        type: "Outdoor",
        description: "Discover amazing hiking trails with stunning views",
        rating: 4.7,
        dateRange: "Year-round",
        images: [
          require("@/assets/explores/explore1.png"),
          require("@/assets/explores/explore2.png"),
        ],
        isFeatured: true,
        phone: "(970) 586-1206",
        socialLinks: {
          facebook: "https://facebook.com/rockymountainnp",
          instagram: "https://instagram.com/rockynps",
          twitter: "https://twitter.com/rockynps",
        },
        openingHours: "24 hours",
        priceLevel: 2,
        categories: ["Hiking", "Nature", "Adventure"],
      },
      {
        id: "explore-2",
        title: "Local Dining",
        name: "Boulder Eateries",
        address: "Pearl St, Boulder, CO 80302",
        location: "Boulder",
        latitude: 40.015,
        longitude: -105.2705,
        eventCount: 15,
        type: "Food",
        description: "Explore the best restaurants and cafes in Boulder",
        rating: 4.5,
        dateRange: "Year-round",
        images: [
          require("@/assets/explores/explore3.png"),
          require("@/assets/explores/explore4.png"),
        ],
        isFeatured: false,
        phone: "(303) 442-0413",
        socialLinks: {
          facebook: "https://facebook.com/boulderdining",
          instagram: "https://instagram.com/boulderdining",
        },
        openingHours: "10:00 AM - 10:00 PM",
        priceLevel: 3,
        categories: ["Food", "Dining", "Local Cuisine"],
      },
      {
        id: "explore-3",
        title: "City Attractions",
        name: "Denver Highlights",
        address: "1701 Wynkoop St, Denver, CO 80202",
        location: "Denver",
        latitude: 39.7392,
        longitude: -104.9903,
        eventCount: 8,
        type: "Attractions",
        description: "Must-visit attractions in the heart of Denver",
        rating: 4.8,
        dateRange: "Year-round",
        images: [require("@/assets/explores/explore2.png")],
        isFeatured: true,
        phone: "(303) 892-1112",
        socialLinks: {
          facebook: "https://facebook.com/visitdenver",
          instagram: "https://instagram.com/visitdenver",
          twitter: "https://twitter.com/visitdenver",
        },
        openingHours: "9:00 AM - 6:00 PM",
        priceLevel: 2,
        categories: ["Attractions", "Culture", "Tourism"],
      },
      {
        id: "explore-4",
        title: "Cultural Events",
        name: "Colorado Springs Festivals",
        address: "1045 Lower Gold Camp Rd, Colorado Springs, CO 80905",
        location: "Colorado Springs",
        latitude: 38.8339,
        longitude: -104.8214,
        eventCount: 12,
        type: "Events",
        description: "Vibrant festivals and cultural events",
        rating: 4.6,
        dateRange: "Seasonal",
        images: [require("@/assets/explores/explore3.png")],
        isFeatured: false,
        phone: "(719) 635-7506",
        socialLinks: {
          facebook: "https://facebook.com/coloradosprings",
          instagram: "https://instagram.com/coloradosprings",
        },
        openingHours: "Varies by event",
        priceLevel: 1,
        categories: ["Events", "Culture", "Festivals"],
      },
    ];
  }

  // Get recommended items
  static getRecommendedItems(): AllDataStructure[] {
    return [
      {
        id: "item-1",
        title: "Colorado Adventure Guide",
        name: "Statewide Exploration",
        address: "Various locations, CO",
        location: "Statewide",
        latitude: 39.5501,
        longitude: -105.7821,
        eventCount: 20,
        type: "Adventure",
        description: "Complete guide to Colorado's adventures",
        rating: 4.9,
        dateRange: "12 Feb - 30 Mar",
        images: [
          require("@/assets/recommend/recommend1.png"),
          require("@/assets/recommend/recommend2.png"),
        ],
        isFeatured: true,
        phone: "(303) 892-1112",
        socialLinks: {
          facebook: "https://facebook.com/explorecolorado",
          instagram: "https://instagram.com/explorecolorado",
          twitter: "https://twitter.com/explorecolorado",
        },
        openingHours: "24/7",
        priceLevel: 1,
        categories: ["Adventure", "Tourism", "Outdoor"],
      },
      {
        id: "item-2",
        title: "Mountain Hiking",
        name: "Rocky Mountain Excursions",
        address: "1000 US Hwy 36, Estes Park, CO 80517",
        location: "Mountain Region",
        latitude: 40.3428,
        longitude: -105.6836,
        eventCount: 15,
        type: "Hiking",
        description: "Active lifestyle hiking experiences",
        rating: 4.7,
        dateRange: "12 Feb - 30 Mar",
        images: [
          require("@/assets/recommend/recommend3.png"),
          require("@/assets/recommend/recommend4.png"),
        ],
        isFeatured: false,
        phone: "(970) 586-1206",
        socialLinks: {
          facebook: "https://facebook.com/rockymountainhiking",
          instagram: "https://instagram.com/rockymountainhiking",
        },
        openingHours: "Dawn to Dusk",
        priceLevel: 2,
        categories: ["Hiking", "Nature", "Fitness"],
      },
      {
        id: "item-3",
        title: "Local Gems",
        name: "Hidden Spots",
        address: "Various locations, CO",
        location: "Various",
        latitude: 39.7392,
        longitude: -104.9903,
        eventCount: 10,
        type: "Exploration",
        description: "Discover hidden gems across Colorado",
        rating: 4.8,
        dateRange: "Year-round",
        images: [require("@/assets/recommend/recommend5.png")],
        isFeatured: true,
        phone: "(303) 892-1100",
        socialLinks: {
          facebook: "https://facebook.com/coloradogems",
          instagram: "https://instagram.com/coloradogems",
        },
        openingHours: "Varies by location",
        priceLevel: 1,
        categories: ["Exploration", "Local", "Adventure"],
      },
      {
        id: "item-4",
        title: "Cultural Immersion",
        name: "Art & History Tour",
        address: "200 E Colfax Ave, Denver, CO 80203",
        location: "Downtown Areas",
        latitude: 39.7392,
        longitude: -104.9903,
        eventCount: 8,
        type: "Culture",
        description: "Dive into Colorado's art and history",
        rating: 4.6,
        dateRange: "20 Mar - 25 Apr",
        images: [require("@/assets/recommend/recommend6.png")],
        isFeatured: false,
        phone: "(303) 866-2604",
        socialLinks: {
          facebook: "https://facebook.com/coloradoculture",
          instagram: "https://instagram.com/coloradoculture",
          twitter: "https://twitter.com/coloradoculture",
        },
        openingHours: "9:00 AM - 5:00 PM",
        priceLevel: 2,
        categories: ["Culture", "Art", "History"],
      },
    ];
  }

  // Get hero slides
  static getHeroSlides(): HeroSlide[] {
    return [
      {
        id: "hero-1",
        title: "EXPLORE MORE",
        subtitle: "Find local businesses, events, and more",
        rating: "4.7",
        image: require("@/assets/images/hero1.png"),
        actionUrl: "/explore",
        ctaText: "Start Exploring",
      },
      {
        id: "hero-2",
        title: "DISCOVER PLACES",
        subtitle: "Amazing destinations await you",
        rating: "4.8",
        image: require("@/assets/images/hero2.png"),
        actionUrl: "/discover",
        ctaText: "Discover Now",
      },
      {
        id: "hero-3",
        title: "CONNECT LOCALLY",
        subtitle: "Join your community events",
        rating: "4.9",
        image: require("@/assets/images/hero3.png"),
        actionUrl: "/events",
        ctaText: "Join Events",
      },
    ];
  }

  // Filter categories by active status
  static getActiveCategories(): Category[] {
    return this.getCategories().filter(
      (category) => category.isActive !== false
    );
  }

  // Get categories by priority
  static getCategoriesByPriority(): Category[] {
    return this.getCategories().sort(
      (a, b) => (a.priority || 999) - (b.priority || 999)
    );
  }

  // Search categories
  static searchCategories(query: string): Category[] {
    const categories = this.getCategories();
    const lowercaseQuery = query.toLowerCase();

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(lowercaseQuery) ||
        category.description?.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get category by ID
  static getCategoryById(id: string): Category | undefined {
    return this.getCategories().find((category) => category.id === id);
  }
}
