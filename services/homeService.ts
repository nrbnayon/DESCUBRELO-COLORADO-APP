// services/categoryService.ts
import type {
  Category,
  ExploreItem,
  RecommendedItem,
  HeroSlide,
} from "@/types/homeTypes";

export class CategoryService {
  // Mock categories data - in real app, this would come from API
  static getCategories(): Category[] {
    return [
      {
        id: "1",
        name: "Concert",
        icon: "🎵",
        image: require("@/assets/categories/concert.png"),
        color: "purple",
        priority: 1,
      },
      {
        id: "2",
        name: "Food",
        icon: "🍟",
        image: require("@/assets/categories/food.png"),
        color: "orange",
        priority: 2,
      },
      {
        id: "3",
        name: "Hiking",
        icon: "🏔️",
        image: require("@/assets/categories/hiking.png"),
        color: "green",
        priority: 3,
      },
      {
        id: "4",
        name: "Towns",
        icon: "🏢",
        image: require("@/assets/categories/town.png"),
        color: "blue",
        priority: 4,
      },
      {
        id: "5",
        name: "Resources",
        icon: "📱",
        image: require("@/assets/categories/resources.png"),
        color: "indigo",
        priority: 5,
      },
      {
        id: "6",
        name: "Events",
        icon: "🎉",
        image: require("@/assets/categories/events.png"),
        color: "pink",
        priority: 6,
      },
      {
        id: "7",
        name: "Store",
        icon: "🏪",
        image: require("@/assets/categories/store.png"),
        color: "yellow",
        priority: 7,
      },
      {
        id: "8",
        name: "Q&A",
        icon: "❓",
        image: require("@/assets/categories/qna.png"),
        color: "red",
        priority: 8,
      },
      {
        id: "9",
        name: "Local Business",
        icon: "📍",
        image: require("@/assets/categories/business.png"),
        color: "teal",
        priority: 9,
      },
      {
        id: "10",
        name: "Attraction",
        icon: "🎢",
        image: require("@/assets/categories/attraction.png"),
        color: "cyan",
        priority: 10,
      },
      {
        id: "11",
        name: "Lodging",
        icon: "🏨",
        image: require("@/assets/categories/lodging.png"),
        color: "violet",
        priority: 11,
      },
      {
        id: "12",
        name: "21+",
        icon: "🔞",
        image: require("@/assets/categories/store.png"),
        color: "amber",
        priority: 12,
      },
      {
        id: "13",
        name: "Sports",
        icon: "⚽",
        image: require("@/assets/categories/store.png"),
        color: "emerald",
        priority: 13,
      },
      {
        id: "14",
        name: "Art & Culture",
        icon: "🎨",
        image: require("@/assets/categories/store.png"),
        color: "rose",
        priority: 14,
      },
      {
        id: "15",
        name: "Shopping",
        icon: "🛍️",
        image: require("@/assets/categories/store.png"),
        color: "lime",
        priority: 15,
      },
      {
        id: "16",
        name: "Health",
        icon: "🏥",
        image: require("@/assets/categories/store.png"),
        color: "sky",
        priority: 16,
      },
    ];
  }

  // Get explore items
  static getExploreItems(): ExploreItem[] {
    return [
      {
        id: "1",
        title: "Hiking",
        eventCount: 10,
        image: require("@/assets/explores/explore1.png"),
        category: "outdoor",
        description: "Discover amazing hiking trails",
        location: "Colorado",
        rating: 4.7,
      },
      {
        id: "2",
        title: "Business",
        eventCount: 15,
        image: require("@/assets/explores/explore2.png"),
        category: "business",
        description: "Connect with local businesses",
        location: "Denver",
        rating: 4.5,
      },
      {
        id: "3",
        title: "Attractions",
        eventCount: 8,
        image: require("@/assets/explores/explore3.png"),
        category: "attractions",
        description: "Must-visit attractions",
        location: "Colorado Springs",
        rating: 4.8,
      },
      {
        id: "4",
        title: "Business",
        eventCount: 12,
        image: require("@/assets/explores/explore4.png"),
        category: "food",
        description: "Best restaurants and cafes",
        location: "Boulder",
        rating: 4.6,
      },
    ];
  }

  // Get recommended items
  static getRecommendedItems(): RecommendedItem[] {
    return [
      {
        id: "1",
        title: "Explore Colorado",
        dateRange: "12 Feb - 30 Mar",
        image: require("@/assets/recommend/recommend1.png"),
        description: "Complete Colorado adventure guide",
        location: "Statewide",
        price: 0,
        rating: 4.9,
        isFeatured: true,
      },
      {
        id: "2",
        title: "Hiking & Moving",
        dateRange: "12 Feb - 30 Mar",
        image: require("@/assets/recommend/recommend2.png"),
        description: "Active lifestyle experiences",
        location: "Mountain Region",
        price: 25,
        rating: 4.7,
        isFeatured: false,
      },
      {
        id: "3",
        title: "Local Discoveries",
        dateRange: "12 Feb",
        image: require("@/assets/recommend/recommend3.png"),
        description: "Hidden gems in your area",
        location: "Various",
        price: 15,
        rating: 4.8,
        isFeatured: false,
      },
      {
        id: "4",
        title: "Cultural Treasures",
        dateRange: "20 Mar - 25 Apr",
        image: require("@/assets/recommend/recommend4.png"),
        description: "Dive into regional culture and art",
        location: "Downtown Areas",
        price: 10,
        rating: 4.6,
        isFeatured: false,
      },
      {
        id: "5",
        title: "Snow Adventures",
        dateRange: "1 Dec - 15 Feb",
        image: require("@/assets/recommend/recommend5.png"),
        description: "Winter sports and snowy escapes",
        location: "Northern Peaks",
        price: 35,
        rating: 4.9,
        isFeatured: true,
      },
      {
        id: "6",
        title: "City Highlights",
        dateRange: "1 Jan - 28 Feb",
        image: require("@/assets/recommend/recommend6.png"),
        description: "Top-rated urban experiences",
        location: "City Centers",
        price: 20,
        rating: 4.5,
        isFeatured: false,
      },
      {
        id: "7",
        title: "Lake Getaways",
        dateRange: "15 May - 30 Jun",
        image: require("@/assets/recommend/recommend7.png"),
        description: "Relax by the lakeside",
        location: "Lake Districts",
        price: 18,
        rating: 4.6,
        isFeatured: false,
      },
      {
        id: "8",
        title: "Farm to Table",
        dateRange: "5 Apr - 10 May",
        image: require("@/assets/recommend/recommend8.png"),
        description: "Culinary and farm tours",
        location: "Countryside",
        price: 22,
        rating: 4.7,
        isFeatured: true,
      },
      {
        id: "9",
        title: "Historic Trails",
        dateRange: "10 Mar - 5 Apr",
        image: require("@/assets/recommend/recommend9.png"),
        description: "Walk through history",
        location: "Historic Sites",
        price: 12,
        rating: 4.4,
        isFeatured: false,
      },
      {
        id: "10",
        title: "Wildlife Watch",
        dateRange: "1 Jun - 30 Jul",
        image: require("@/assets/recommend/recommend10.png"),
        description: "Nature and wildlife experiences",
        location: "National Parks",
        price: 30,
        rating: 4.8,
        isFeatured: true,
      },
    ];
  }

  // Get hero slides
  static getHeroSlides(): HeroSlide[] {
    return [
      {
        id: "1",
        title: "EXPLORE MORE",
        subtitle: "Find local business, events and more",
        rating: "4.7",
        image: require("@/assets/images/hero1.png"),
        actionUrl: "/explore",
        ctaText: "Start Exploring",
      },
      {
        id: "2",
        title: "DISCOVER PLACES",
        subtitle: "Amazing destinations await you",
        rating: "4.8",
        image: require("@/assets/images/hero2.png"),
        actionUrl: "/discover",
        ctaText: "Discover Now",
      },
      {
        id: "3",
        title: "CONNECT LOCALLY",
        subtitle: "Join your community events",
        rating: "4.9",
        image: require("@/assets/images/hero3.png"),
        actionUrl: "/events",
        ctaText: "Join Events",
      },
      {
        id: "4",
        title: "CRICKET",
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
