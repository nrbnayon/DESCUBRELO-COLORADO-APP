import AsyncStorage from "@react-native-async-storage/async-storage";

// Google Translate API configuration
const GOOGLE_TRANSLATE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY ||
  "your-EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY-here";
const GOOGLE_TRANSLATE_URL =
  "https://translation.googleapis.com/language/translate/v2";

// Cache keys
const TRANSLATION_CACHE_KEY = "translation_cache";
const CACHE_EXPIRY_KEY = "translation_cache_expiry";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Translation cache interface
interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

// Language detection and translation service
class TranslationService {
  private cache: TranslationCache = {};
  private cacheLoaded = false;

  // Initialize cache from storage
  async initializeCache(): Promise<void> {
    if (this.cacheLoaded) return;

    try {
      const cachedData = await AsyncStorage.getItem(TRANSLATION_CACHE_KEY);
      const cacheExpiry = await AsyncStorage.getItem(CACHE_EXPIRY_KEY);

      if (cachedData && cacheExpiry) {
        const expiryTime = Number.parseInt(cacheExpiry, 10);
        if (Date.now() < expiryTime) {
          this.cache = JSON.parse(cachedData);
        } else {
          // Cache expired, clear it
          await this.clearCache();
        }
      }

      this.cacheLoaded = true;
    } catch (error) {
      console.error("Error loading translation cache:", error);
      this.cacheLoaded = true;
    }
  }

  // Save cache to storage
  private async saveCache(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        TRANSLATION_CACHE_KEY,
        JSON.stringify(this.cache)
      );
      await AsyncStorage.setItem(
        CACHE_EXPIRY_KEY,
        (Date.now() + CACHE_DURATION).toString()
      );
    } catch (error) {
      console.error("Error saving translation cache:", error);
    }
  }

  // Clear cache
  async clearCache(): Promise<void> {
    this.cache = {};
    try {
      await AsyncStorage.removeItem(TRANSLATION_CACHE_KEY);
      await AsyncStorage.removeItem(CACHE_EXPIRY_KEY);
    } catch (error) {
      console.error("Error clearing translation cache:", error);
    }
  }

  // Get cached translation
  private getCachedTranslation(
    text: string,
    targetLang: string
  ): string | null {
    const normalizedText = text.trim().toLowerCase();
    return this.cache[normalizedText]?.[targetLang] || null;
  }

  // Cache translation
  private setCachedTranslation(
    text: string,
    targetLang: string,
    translation: string
  ): void {
    const normalizedText = text.trim().toLowerCase();
    if (!this.cache[normalizedText]) {
      this.cache[normalizedText] = {};
    }
    this.cache[normalizedText][targetLang] = translation;
    this.saveCache();
  }

  // Translate single text
  async translateText(
    text: string,
    targetLang: string,
    sourceLang = "en"
  ): Promise<string> {
    if (!text || text.trim() === "") return text;
    if (targetLang === sourceLang) return text;

    await this.initializeCache();

    // Check cache first
    const cachedTranslation = this.getCachedTranslation(text, targetLang);
    if (cachedTranslation) {
      return cachedTranslation;
    }

    try {
      const response = await fetch(
        `${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: "text",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;

      // Cache the translation
      this.setCachedTranslation(text, targetLang, translatedText);

      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text if translation fails
    }
  }

  // Translate multiple texts in batch
  async translateBatch(
    texts: string[],
    targetLang: string,
    sourceLang = "en"
  ): Promise<string[]> {
    if (targetLang === sourceLang) return texts;

    await this.initializeCache();

    const results: string[] = [];
    const textsToTranslate: { text: string; index: number }[] = [];

    // Check cache for each text
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      if (!text || text.trim() === "") {
        results[i] = text;
        continue;
      }

      const cachedTranslation = this.getCachedTranslation(text, targetLang);
      if (cachedTranslation) {
        results[i] = cachedTranslation;
      } else {
        textsToTranslate.push({ text, index: i });
      }
    }

    // Translate uncached texts
    if (textsToTranslate.length > 0) {
      try {
        const response = await fetch(
          `${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              q: textsToTranslate.map((item) => item.text),
              source: sourceLang,
              target: targetLang,
              format: "text",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Translation API error: ${response.status}`);
        }

        const data = await response.json();
        const translations = data.data.translations;

        // Process translations
        for (let i = 0; i < textsToTranslate.length; i++) {
          const { text, index } = textsToTranslate[i];
          const translatedText = translations[i].translatedText;

          results[index] = translatedText;
          this.setCachedTranslation(text, targetLang, translatedText);
        }
      } catch (error) {
        console.error("Batch translation error:", error);
        // Fill remaining with original texts
        for (const { text, index } of textsToTranslate) {
          results[index] = text;
        }
      }
    }

    return results;
  }

  // Get supported languages
  async getSupportedLanguages(): Promise<{ code: string; name: string }[]> {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2/languages?key=${GOOGLE_TRANSLATE_API_KEY}&target=en`
      );

      if (!response.ok) {
        throw new Error(`Languages API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.languages.map((lang: any) => ({
        code: lang.language,
        name: lang.name,
      }));
    } catch (error) {
      console.error("Error fetching supported languages:", error);
      return this.getDefaultLanguages();
    }
  }

  // Fallback languages if API fails
  private getDefaultLanguages(): { code: string; name: string }[] {
    return [
      { code: "en", name: "English" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" },
      { code: "pt", name: "Portuguese" },
      { code: "ru", name: "Russian" },
      { code: "ja", name: "Japanese" },
      { code: "ko", name: "Korean" },
      { code: "zh", name: "Chinese" },
      { code: "ar", name: "Arabic" },
      { code: "hi", name: "Hindi" },
    ];
  }
}

export const translationService = new TranslationService();
