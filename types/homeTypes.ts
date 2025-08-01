// types/homeTypes.ts

// Base Category interface
export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: any; 
  imageUrl?: string; 
  description?: string;
  color?: string;
  isActive?: boolean;
  priority?: number;
  metadata?: Record<string, any>;
}

// Explore item interface
export interface ExploreItem {
  id: string;
  title: string;
  eventCount: number;
  image: any;
  category: string;
  description?: string;
  location?: string;
  rating?: number;
}

// Recommended item interface
export interface RecommendedItem {
  id: string;
  title: string;
  dateRange: string;
  image: any;
  description?: string;
  location?: string;
  price?: number;
  rating?: number;
  isFeatured?: boolean;
}

// Hero slide interface
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  rating: string;
  image: any;
  actionUrl?: string;
  ctaText?: string;
}

// Component prop interfaces
export interface DynamicCategoriesSectionProps {
  categories: Category[];
  categoryShow?: number;
  title?: string;
  onCategoryPress?: (category: Category) => void;
  showTitle?: boolean;
  containerClassName?: string;
  itemClassName?: string;
  columns?: number;
  showMoreText?: string;
  showLessText?: string;
  showMoreIcon?: string;
  showLessIcon?: string;
}

export interface CategoryItemProps {
  category: Category;
  onPress: (category: Category) => void;
  itemWidth: string;
  itemClassName?: string;
  isShowMoreButton?: boolean;
}

export interface ExploreSectionProps {
  items: ExploreItem[];
  title?: string;
  onItemPress?: (item: ExploreItem) => void;
  showTitle?: boolean;
  columns?: number;
  containerClassName?: string;
}

export interface RecommendedSectionProps {
  items: RecommendedItem[];
  title?: string;
  onItemPress?: (item: RecommendedItem) => void;
  showTitle?: boolean;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  containerClassName?: string;
}

export interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  onSlidePress?: (slide: HeroSlide) => void;
  containerClassName?: string;
}

// Utility types
export type CategoryLayoutType = "grid" | "list" | "carousel";
export type CategoryDisplayMode = "compact" | "detailed" | "minimal";

// Animation configuration
export interface CategoryAnimationConfig {
  enabled: boolean;
  duration: number;
  type: "spring" | "easeInEaseOut" | "linear";
}
