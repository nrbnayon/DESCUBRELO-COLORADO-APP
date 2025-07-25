// components\ui\TranslatedText.tsx
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, type TextProps } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

interface TranslatedTextProps extends TextProps {
  children: string;
  fallback?: string;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  children,
  fallback,
  ...textProps
}) => {
  const { translateAsync, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(children);
  const [isLoading, setIsLoading] = useState(false);
  const previousLanguage = useRef(currentLanguage);
  const previousText = useRef(children);

  useEffect(() => {
    const translateText = async () => {
      // Skip translation if language is English or text is empty
      if (!children || currentLanguage === "en") {
        setTranslatedText(children);
        return;
      }

      // Always translate when language changes, even if text is the same
      const languageChanged = previousLanguage.current !== currentLanguage;
      const textChanged = previousText.current !== children;

      if (!languageChanged && !textChanged) {
        return;
      }

      previousText.current = children;
      previousLanguage.current = currentLanguage;

      setIsLoading(true);
      try {
        const translated = await translateAsync(children);
        setTranslatedText(translated);
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedText(fallback || children);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to allow for language change to propagate
    const timeoutId = setTimeout(translateText, 50);

    return () => clearTimeout(timeoutId);
  }, [children, currentLanguage, translateAsync, fallback]);

  return (
    <Text {...textProps}>
      {isLoading ? fallback || children : translatedText}
    </Text>
  );
};
