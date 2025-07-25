"use client";

import { useState, useCallback, useRef } from "react";
import { translationService } from "@/services/translationService";
import { useAppStore } from "@/store/useAppStore";

// Translation hook interface
interface UseTranslationReturn {
  t: (text: string) => string;
  translateAsync: (text: string) => Promise<string>;
  translateBatch: (texts: string[]) => Promise<string[]>;
  isTranslating: boolean;
  currentLanguage: string;
  changeLanguage: (languageCode: string) => Promise<void>;
  getSupportedLanguages: () => Promise<{ code: string; name: string }[]>;
}

// Translation cache for hook
const translationCache = new Map<string, Map<string, string>>();

export const useTranslation = (): UseTranslationReturn => {
  const { settings, updateSettings } = useAppStore();
  const [isTranslating, setIsTranslating] = useState(false);
  const currentLanguage = settings.language || "en";
  const pendingTranslations = useRef(new Set<string>());

  // Get cached translation
  const getCachedTranslation = useCallback(
    (text: string, lang: string): string | null => {
      const langCache = translationCache.get(lang);
      return langCache?.get(text.trim().toLowerCase()) || null;
    },
    []
  );

  // Set cached translation
  const setCachedTranslation = useCallback(
    (text: string, lang: string, translation: string): void => {
      const normalizedText = text.trim().toLowerCase();
      if (!translationCache.has(lang)) {
        translationCache.set(lang, new Map());
      }
      translationCache.get(lang)!.set(normalizedText, translation);
    },
    []
  );

  // Asynchronous translation function
  const translateAsync = useCallback(
    async (text: string): Promise<string> => {
      if (!text || text.trim() === "") return text;
      if (currentLanguage === "en") return text;

      const cached = getCachedTranslation(text, currentLanguage);
      if (cached) return cached;

      const cacheKey = `${text.trim().toLowerCase()}-${currentLanguage}`;

      // Prevent duplicate requests
      if (pendingTranslations.current.has(cacheKey)) {
        return text;
      }

      try {
        pendingTranslations.current.add(cacheKey);
        setIsTranslating(true);

        const translated = await translationService.translateText(
          text,
          currentLanguage
        );
        setCachedTranslation(text, currentLanguage, translated);
        return translated;
      } catch (error) {
        console.error("Translation error:", error);
        return text;
      } finally {
        pendingTranslations.current.delete(cacheKey);
        setIsTranslating(false);
      }
    },
    [currentLanguage, getCachedTranslation, setCachedTranslation]
  );

  // Synchronous translation function (uses cache only)
  const t = useCallback(
    (text: string): string => {
      if (!text || text.trim() === "") return text;
      if (currentLanguage === "en") return text;

      const cached = getCachedTranslation(text, currentLanguage);
      if (cached) return cached;

      // Don't trigger async translation in render - return original text
      return text;
    },
    [currentLanguage, getCachedTranslation]
  );

  // Batch translation function
  const translateBatch = useCallback(
    async (texts: string[]): Promise<string[]> => {
      if (currentLanguage === "en") return texts;

      const results: string[] = [];
      const textsToTranslate: { text: string; index: number }[] = [];

      // Check cache first
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        if (!text || text.trim() === "") {
          results[i] = text;
          continue;
        }

        const cached = getCachedTranslation(text, currentLanguage);
        if (cached) {
          results[i] = cached;
        } else {
          textsToTranslate.push({ text, index: i });
        }
      }

      // Translate uncached texts
      if (textsToTranslate.length > 0) {
        try {
          setIsTranslating(true);
          const translations = await translationService.translateBatch(
            textsToTranslate.map((item) => item.text),
            currentLanguage
          );

          for (let i = 0; i < textsToTranslate.length; i++) {
            const { text, index } = textsToTranslate[i];
            const translation = translations[i];
            results[index] = translation;
            setCachedTranslation(text, currentLanguage, translation);
          }
        } catch (error) {
          console.error("Batch translation error:", error);
          // Fill with original texts on error
          for (const { text, index } of textsToTranslate) {
            results[index] = text;
          }
        } finally {
          setIsTranslating(false);
        }
      }

      return results;
    },
    [currentLanguage, getCachedTranslation, setCachedTranslation]
  );

  // Change language function
  const changeLanguage = useCallback(
    async (languageCode: string): Promise<void> => {
      try {
        setIsTranslating(true);
        await updateSettings({ language: languageCode });

        // Clear component cache when language changes
        translationCache.clear();
        pendingTranslations.current.clear();
      } catch (error) {
        console.error("Error changing language:", error);
      } finally {
        setIsTranslating(false);
      }
    },
    [updateSettings]
  );

  // Get supported languages
  const getSupportedLanguages = useCallback(async (): Promise<
    { code: string; name: string }[]
  > => {
    return await translationService.getSupportedLanguages();
  }, []);

  return {
    t,
    translateAsync,
    translateBatch,
    isTranslating,
    currentLanguage,
    changeLanguage,
    getSupportedLanguages,
  };
};
