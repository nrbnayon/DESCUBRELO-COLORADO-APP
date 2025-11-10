# 🏔️ DESCUBRELO COLORADO APP

A modern React Native mobile app built with TypeScript and Tailwind CSS for discovering Colorado's outdoor paradise. Available on iOS App Store and Android.

[![iOS App Store](https://img.shields.io/badge/App_Store-Download-blue?style=flat&logo=apple)](https://apps.apple.com/us/app/descubrelo-colorado-guide/id6754084053)
[![React Native](https://img.shields.io/badge/React_Native-0.79.5-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-53.0.20-000020?style=flat&logo=expo)](https://expo.dev/)

## 🌟 Features

### 🥾 Outdoor Discovery
- **Hiking & Biking Trails**: Comprehensive database of scenic trails across Colorado
- **Hidden Gems**: Discover secluded waterfalls, pristine alpine lakes, and secret spots
- **Local Favorites**: Curated recommendations from local experts
- **Real-time Conditions**: Weather updates and trail conditions

### 🗺️ Navigation & Maps
- **Interactive Maps**: GPS navigation with location tracking
- **Offline Maps**: Download maps for offline access in remote areas (Premium)
- **Points of Interest**: All attractions, national parks, and destinations
- **Route Planning**: Smart navigation to Colorado's best destinations

### 🤖 AI Travel Assistant (Premium)
- **Personalized Recommendations**: AI-powered trail suggestions based on preferences
- **Smart Itinerary Planning**: Day trip and adventure planning
- **24/7 Assistance**: Expert advice on gear, timing, and trail selection
- **Ask AI Feature**: Interactive AI chat for outdoor questions

### 📱 User Experience
- **Cross-Platform**: iOS & Android support
- **Fast & Responsive**: Lightning-fast search and navigation
- **Modern UI**: Beautiful interface with Tailwind CSS
- **Multi-language Support**: English and Spanish
- **Dark/Light Mode**: Automatic theme switching

### 🔐 Authentication & Profiles
- **Secure Authentication**: Email/password with OTP verification
- **User Profiles**: Personal information and preferences
- **Favorites System**: Save and manage favorite locations
- **Settings Management**: Language, notifications, and preferences

### 💎 Premium Features
- **Offline Map Downloads**: Unlimited offline access
- **AI Assistant**: Unlimited AI chat and recommendations
- **Ad-Free Experience**: Clean, uninterrupted usage
- **Priority Support**: Exclusive customer service
- **Early Access**: New features and content first

## 🚀 Tech Stack

### Core Technologies
- **React Native 0.79.5**: Cross-platform mobile development
- **TypeScript 5.8.3**: Type-safe JavaScript
- **Expo 53.0.20**: React Native platform and tooling
- **Expo Router 5.1.4**: File-based routing system

### UI & Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **NativeWind 4.1.23**: Tailwind CSS for React Native
- **React Native Reanimated 3.17.4**: Smooth animations
- **React Native Gesture Handler 2.24.0**: Touch gestures

### State Management & Data
- **Zustand 5.0.1**: Lightweight state management
- **React Query 5.59.20**: Data fetching and caching
- **Zod 3.23.8**: Schema validation
- **React Hook Form**: Form handling with validation

### Maps & Location
- **React Native Maps 1.20.1**: Map components
- **React Native Maps Directions 1.9.0**: Route directions
- **Expo Location 18.1.6**: Location services
- **Expo Geolocation**: GPS positioning

### Additional Features
- **Lucide React Native 0.525.0**: Beautiful icons
- **React Native Toast Message 2.3.3**: User notifications
- **AsyncStorage**: Local data persistence
- **Expo WebView**: Web content integration

## 📱 App Structure

### Navigation Flow
```
Index → Splash → Onboarding → Welcome → Auth → Main App
```

### Main Screens
- **Home**: Featured content and categories
- **Explore**: Discover places and activities
- **Map**: Navigation and location services
- **Favorites**: Saved locations
- **Profile**: User account and settings
- **Ask AI**: AI assistant interface

### Authentication Flow
- **Language Selection**: Multi-language onboarding
- **Sign Up**: Email registration with validation
- **Sign In**: Secure login with validation
- **OTP Verification**: Two-factor authentication
- **Forgot Password**: Password recovery

### Premium Integration
- **Feature Limiting**: Free tier with usage limits
- **Premium Modal**: Subscription upgrade prompts
- **Payment Processing**: Secure subscription handling
- **Feature Usage Tracking**: Analytics for premium features

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nrbnayon/DESCUBRELO-COLORADO-APP.git
   cd DESCUBRELO-COLORADO-APP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start --lan
   ```

4. **Run on your preferred platform**
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

### Available Scripts

```bash
npm start              # Start Expo development server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run in web browser
npm run build:ios      # Build for iOS
npm run build:android  # Build for Android
npm run lint           # Run ESLint
npm run type-check     # Run TypeScript type checking
npm run reset-project  # Reset project to clean state
```

## 📱 Building & Deployment

### EAS Build Configuration
The app uses Expo Application Services (EAS) for building and deployment:

```bash
eas build --platform ios      # Build for iOS
eas build --platform android # Build for Android
eas build --platform all     # Build for both platforms
```

### App Store Deployment
- **iOS**: Available on [App Store](https://apps.apple.com/us/app/descubrelo-colorado-guide/id6754084053)
- **Android**: Configure for Google Play Store
- **Bundle ID**: `com.descubrelocolorado.app`

## 🔧 Configuration

### Environment Variables
Key configurations in `app.json`:
- **Google Maps API**: Configured for location services
- **Bundle Identifiers**: iOS and Android package names
- **Permissions**: Location and camera access
- **EAS Project**: Connected to Expo Application Services

### Premium Features Configuration
Located in `hooks/usePremium.ts`:
- **AI Chat**: 5 free uses per month
- **Offline Maps**: 3 free downloads per month  
- **Navigation**: 5 free uses per month

## 📊 Project Structure

```
DESCUBRELO-COLORADO-APP/
├── app/                    # Main application screens
│   ├── (auth)/            # Authentication screens
│   ├── (main)/            # Main app screens
│   └── (screen)/          # Additional screens
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── shared/           # Shared components
│   └── main/             # Main screen components
├── hooks/                # Custom React hooks
├── services/             # API and data services
├── store/                # State management
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── assets/               # Images, fonts, and resources
```

## 🔒 Security & Privacy

- **Secure Authentication**: OTP-based verification
- **Data Encryption**: Sensitive data protection
- **Privacy Policy**: Compliant with app store requirements
- **Location Permissions**: Transparent location usage
- **Privacy Policy**: [Privacy & Terms](https://appdescubrelocolorado.com/app-privacy-terms)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved by DESCUBRELO COLORADO.

---

**Made with ❤️ for Colorado outdoor enthusiasts**

*Discover Colorado's outdoor paradise with AI-powered guidance and seamless navigation.*
