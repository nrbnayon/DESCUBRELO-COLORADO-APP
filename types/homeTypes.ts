// types/homeTypes.ts
import { ImageSourcePropType } from "react-native";

// Base Category interface
export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: ImageSourcePropType;
  imageUrl?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  priority?: number;
  metadata?: Record<string, any>;
}


interface AddressLocation {
  address?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
}

interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  [key: string]: unknown;
}

// all app will follow same data structure 
export interface AllDataStructure extends AddressLocation {
  id: string;
  title?: string;
  name?: string;
  address?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  eventCount?: number;
  type?: string;
  description?: string;
  rating?: number;
  dateRange?: string;
  images?: (string | ImageSourcePropType)[];
  isFeatured?: boolean;
  phone?: string;
  socialLinks?: SocialMediaLinks;
  openingHours?: string;
  priceLevel?: number;
  categories?: string[];
  offlineSupported?: boolean;
  offlineData?: {
    mapTiles?: boolean;
    detailsAvailable?: boolean;
    navigationSupported?: boolean;
  };
  [key: string]: any;
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
  items: AllDataStructure[];
  title?: string;
  onItemPress?: (item: AllDataStructure) => void;
  showTitle?: boolean;
  columns?: number;
  containerClassName?: string;
  showSeeAll?: boolean;
  onSeeAllExplore?: () => void;
}

export interface RecommendedSectionProps {
  items: AllDataStructure[];
  title?: string;
  onItemPress?: (item: AllDataStructure) => void;
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


