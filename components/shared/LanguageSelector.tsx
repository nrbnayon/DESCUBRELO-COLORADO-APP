// components\shared\LanguageSelector.tsx
import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/hooks/useTranslation";
import { Check, Search, Globe, X } from "lucide-react-native";

interface Language {
  code: string;
  name: string;
  flag?: string;
}

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
  onLanguageSelect?: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
  onLanguageSelect,
}) => {
  const {
    currentLanguage,
    changeLanguage,
    getSupportedLanguages,
    isTranslating,
  } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  // Load supported languages
  useEffect(() => {
    const loadLanguages = async () => {
      setLoading(true);
      try {
        const supportedLanguages = await getSupportedLanguages();
        const languagesWithFlags = supportedLanguages.map((lang) => ({
          ...lang,
          flag: getLanguageFlag(lang.code),
        }));
        setLanguages(languagesWithFlags);
        setFilteredLanguages(languagesWithFlags);
      } catch (error) {
        console.error("Error loading languages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      loadLanguages();
    }
  }, [visible, getSupportedLanguages]);

  // Filter languages based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLanguages(languages);
    } else {
      const filtered = languages.filter(
        (lang) =>
          lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lang.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLanguages(filtered);
    }
  }, [searchQuery, languages]);

  // Get flag emoji for language code
  const getLanguageFlag = (code: string): string => {
    const flagMap: { [key: string]: string } = {
      en: "🇺🇸",
      es: "🇪🇸",
      fr: "🇫🇷",
      de: "🇩🇪",
      it: "🇮🇹",
      pt: "🇵🇹",
      ru: "🇷🇺",
      ja: "🇯🇵",
      ko: "🇰🇷",
      zh: "🇨🇳",
      ar: "🇸🇦",
      hi: "🇮🇳",
      nl: "🇳🇱",
      sv: "🇸🇪",
      da: "🇩🇰",
      no: "🇳🇴",
      fi: "🇫🇮",
      pl: "🇵🇱",
      tr: "🇹🇷",
      th: "🇹🇭",
      vi: "🇻🇳",
    };
    return flagMap[code] || "🌐";
  };

  const handleLanguageSelect = async (language: Language) => {
    setSelectedLanguage(language.code);
    try {
      await changeLanguage(language.code);
      onLanguageSelect?.(language);
      onClose();
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      onPress={() => handleLanguageSelect(item)}
      className={`flex-row items-center justify-between p-4 border-b border-gray-100 ${
        selectedLanguage === item.code ? "bg-primary/5" : "bg-white"
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
          <Text className="text-lg">{item.flag}</Text>
        </View>
        <View className="flex-1">
          <Text
            className={`text-base font-medium ${selectedLanguage === item.code ? "text-primary-dark" : "text-black"}`}
          >
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {item.code.toUpperCase()}
          </Text>
        </View>
      </View>
      {selectedLanguage === item.code && (
        <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
          <Check size={14} color="white" strokeWidth={3} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <Globe size={24} color="#4DBA28" />
            <Text className="text-xl font-semibold text-black ml-2">
              Select Language
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2">
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="p-4 border-b border-gray-100">
          <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2">
            <Search size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base text-black"
              placeholder="Search languages..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Languages List */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4DBA28" />
            <Text className="text-gray-500 mt-2">Loading languages...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredLanguages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: SCREEN_HEIGHT * 0.7 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center p-8">
                <Globe size={48} color="#ccc" />
                <Text className="text-gray-500 text-center mt-4">
                  No languages found matching `{searchQuery}`
                </Text>
              </View>
            }
          />
        )}

        {/* Loading Indicator */}
        {isTranslating && (
          <View className="absolute bottom-20 left-0 right-0 items-center">
            <View className="bg-black/80 rounded-full px-4 py-2 flex-row items-center">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white ml-2">Applying language...</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};


// only two language 
// components/shared/LanguageSelector.tsx
// import type React from "react";
// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   FlatList,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useTranslation } from "@/hooks/useTranslation";
// import { TranslatedText } from "@/components/ui/TranslatedText";
// import { showToast } from "@/utils/toast";
// import { Check, Globe, X } from "lucide-react-native";

// interface Language {
//   id: string;
//   code: string;
//   name: string;
//   flag: any; // React Native Image source
// }

// interface LanguageSelectorProps {
//   visible: boolean;
//   onClose: () => void;
//   onLanguageSelect?: (language: Language) => void;
// }

// // Define the two supported languages
// const supportedLanguages: Language[] = [
//   {
//     id: "1",
//     code: "en",
//     name: "English United States",
//     flag: require("@/assets/images/us-flag.png"),
//   },
//   {
//     id: "2",
//     code: "es",
//     name: "Spanish",
//     flag: require("@/assets/images/spain-flag.png"),
//   },
// ];

// export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
//   visible,
//   onClose,
//   onLanguageSelect,
// }) => {
//   const { currentLanguage, changeLanguage, isTranslating, translateBatch } =
//     useTranslation();
//   const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
//   const [loading, setLoading] = useState(false);

//   // Update selected language when current language changes
//   useEffect(() => {
//     setSelectedLanguage(currentLanguage);
//   }, [currentLanguage]);

//   const handleLanguageSelect = async (language: Language) => {
//     if (language.code === currentLanguage) {
//       onClose();
//       return;
//     }

//     setSelectedLanguage(language.code);
//     setLoading(true);

//     try {
//       // Change language
//       await changeLanguage(language.code);

//       // Preload common translations for better UX
//       if (language.code !== "en") {
//         const commonTexts = [
//           "Welcome",
//           "Search here",
//           "Categories",
//           "Explore",
//           "Recommended",
//           "Explore Colorado",
//           "Loading...",
//           "Error",
//           "Success",
//           "Cancel",
//           "Confirm",
//           "Continue",
//           "Back",
//         ];

//         try {
//           await translateBatch(commonTexts);
//         } catch (error) {
//           console.error("Failed to preload common translations:", error);
//         }
//       }

//       // Show success toast
//       showToast(
//         "success",
//         "Language Changed",
//         `${language.name} has been set as your preferred language.`
//       );

//       // Call callback if provided
//       onLanguageSelect?.(language);

//       // Small delay to ensure translations are processed
//       setTimeout(() => {
//         onClose();
//       }, 100);
//     } catch (error) {
//       console.error("Error changing language:", error);
//       showToast("error", "Language Change Failed", "Please try again.");
//       setSelectedLanguage(currentLanguage); // Revert selection
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderLanguageItem = ({ item }: { item: Language }) => (
//     <TouchableOpacity
//       onPress={() => handleLanguageSelect(item)}
//       className={`flex-row items-center justify-between p-4 mb-3 mx-4 rounded-xl border-2 ${
//         selectedLanguage === item.code
//           ? "border-primary bg-primary/5"
//           : "border-gray-200 bg-white"
//       }`}
//       activeOpacity={0.7}
//       disabled={loading || isTranslating}
//     >
//       <View className='flex-row items-center flex-1'>
//         {/* Flag */}
//         <View className='w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4 overflow-hidden'>
//           <Image source={item.flag} className='w-6 h-6' resizeMode='contain' />
//         </View>

//         {/* Language Info */}
//         <View className='flex-1'>
//           <Text
//             className={`text-base font-semibold ${
//               selectedLanguage === item.code
//                 ? "text-primary-dark"
//                 : "text-black"
//             }`}
//           >
//             <TranslatedText>{item.name}</TranslatedText>
//           </Text>
//           <Text className='text-sm text-gray-500 mt-1'>
//             {item.code.toUpperCase()}
//           </Text>
//         </View>
//       </View>

//       {/* Selection Indicator */}
//       <View
//         className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
//           selectedLanguage === item.code
//             ? "border-primary bg-primary"
//             : "border-gray-300 bg-transparent"
//         }`}
//       >
//         {selectedLanguage === item.code && (
//           <Check size={14} color='white' strokeWidth={3} />
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <Modal
//       visible={visible}
//       animationType='slide'
//       presentationStyle='pageSheet'
//       onRequestClose={onClose}
//     >
//       <SafeAreaView className='flex-1 bg-gray-50'>
//         {/* Header */}
//         <View className='flex-row items-center justify-between p-4 bg-white border-b border-gray-200'>
//           <View className='flex-row items-center'>
//             <Globe size={24} color='#4DBA28' />
//             <Text className='text-xl font-bold text-black ml-3'>
//               <TranslatedText>Select Language</TranslatedText>
//             </Text>
//           </View>
//           <TouchableOpacity
//             onPress={onClose}
//             className='p-2 rounded-full'
//             disabled={loading || isTranslating}
//           >
//             <X size={24} color='#666' />
//           </TouchableOpacity>
//         </View>

//         {/* Language Description */}
//         <View className='p-4 bg-white'>
//           <Text className='text-sm text-gray-600 text-center'>
//             <TranslatedText>
//               Choose your preferred language for the app
//             </TranslatedText>
//           </Text>
//         </View>

//         {/* Languages List */}
//         <View className='flex-1 pt-4'>
//           <FlatList
//             data={supportedLanguages}
//             renderItem={renderLanguageItem}
//             keyExtractor={(item) => item.id}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 20 }}
//           />
//         </View>

//         {/* Loading Overlay */}
//         {(loading || isTranslating) && (
//           <View className='absolute inset-0 bg-black/50 items-center justify-center'>
//             <View className='bg-white rounded-2xl p-6 items-center min-w-[200px]'>
//               <ActivityIndicator size='large' color='#4DBA28' />
//               <Text className='text-gray-700 mt-3 text-base font-medium'>
//                 <TranslatedText>Applying language...</TranslatedText>
//               </Text>
//             </View>
//           </View>
//         )}
//       </SafeAreaView>
//     </Modal>
//   );
// };
