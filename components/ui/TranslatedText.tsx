// components/ui/TranslatedText.tsx
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, type TextProps } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

interface TranslatedTextProps extends TextProps {
  children: string;
  fallback?: string;
  enableCache?: boolean;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  children,
  fallback,
  enableCache = true,
  ...textProps
}) => {
  const { translateAsync, currentLanguage, t } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(children);
  const [isLoading, setIsLoading] = useState(false);
  const previousLanguage = useRef(currentLanguage);
  const previousText = useRef(children);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const translateText = async () => {
      // Skip translation if language is English or text is empty
      if (!children || !children.trim() || currentLanguage === "en") {
        setTranslatedText(children);
        return;
      }

      // Check if we need to translate
      const languageChanged = previousLanguage.current !== currentLanguage;
      const textChanged = previousText.current !== children;

      if (!languageChanged && !textChanged) {
        return;
      }

      // Update refs
      previousText.current = children;
      previousLanguage.current = currentLanguage;

      // Try to get cached translation first
      if (enableCache) {
        const cachedTranslation = t(children);
        if (cachedTranslation !== children) {
          setTranslatedText(cachedTranslation);
          return;
        }
      }

      // Perform async translation
      setIsLoading(true);
      try {
        const translated = await translateAsync(children);
        if (isMounted.current) {
          setTranslatedText(translated);
        }
      } catch (error) {
        console.error("Translation error:", error);
        if (isMounted.current) {
          setTranslatedText(fallback || children);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    // Add a small delay to prevent excessive API calls during rapid changes
    const timeoutId = setTimeout(translateText, 50);

    return () => clearTimeout(timeoutId);
  }, [children, currentLanguage, translateAsync, fallback, enableCache, t]);

  // Reset translated text when children change immediately for better UX
  useEffect(() => {
    if (previousText.current !== children) {
      if (currentLanguage === "en") {
        setTranslatedText(children);
      } else if (enableCache) {
        const cachedTranslation = t(children);
        setTranslatedText(cachedTranslation);
      } else {
        setTranslatedText(children);
      }
    }
  }, [children, currentLanguage, enableCache, t]);

  return (
    <Text {...textProps}>
      {isLoading && fallback ? fallback : translatedText}
    </Text>
  );
};
