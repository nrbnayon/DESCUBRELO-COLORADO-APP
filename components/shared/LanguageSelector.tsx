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
