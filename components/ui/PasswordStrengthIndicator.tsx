// components/ui/PasswordStrengthIndicator.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text } from "react-native";
import { Check, X } from "lucide-react-native";
import { clsx } from "clsx";
import { calculatePasswordStrength } from "@/utils/validationSchemas";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);
  const { score, strength, checks } = calculatePasswordStrength(password);

  const strengthConfig = {
    weak: {
      color: "#EF4444", // red-500
      bgColor: "#FEE2E2", // red-100
      text: "Weak",
      textColor: "#DC2626", // red-600
    },
    medium: {
      color: "#F59E0B", // amber-500
      bgColor: "#FEF3C7", // amber-100
      text: "Medium",
      textColor: "#D97706", // amber-600
    },
    strong: {
      color: "#10B981", // emerald-500
      bgColor: "#D1FAE5", // emerald-100
      text: "Strong",
      textColor: "#059669", // emerald-600
    },
  };

  // Memoize the progress bar style to prevent render-time calculations
  const progressStyle = useMemo(
    () => ({
      width: `${score}%` as const,
      backgroundColor: strengthConfig[strength].color,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [score, strength]
  );

  useEffect(() => {
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Always show when password changes
    setIsVisible(true);

    // If password is strong and all requirements are met, hide after 2 seconds
    if (
      password &&
      strength === "strong" &&
      Object.values(checks).every((check) => check === true)
    ) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }

    // Cleanup timeout on unmount
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  if (!password || !isVisible) return null;

  const config = strengthConfig[strength];

  const requirements = [
    {
      key: "length",
      text: "At least 8 characters",
      met: checks.length,
    },
    {
      key: "uppercase",
      text: "One uppercase letter",
      met: checks.uppercase,
    },
    {
      key: "lowercase",
      text: "One lowercase letter",
      met: checks.lowercase,
    },
    {
      key: "numbers",
      text: "One number",
      met: checks.numbers,
    },
    {
      key: "special",
      text: "One special character",
      met: checks.special,
    },
    {
      key: "noCommon",
      text: "No common patterns",
      met: checks.noCommon,
    },
  ];

  return (
    <View className={clsx("mb-1", className)}>
      {/* Progress Bar */}
      <View className="mb-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-sm font-medium text-gray-700">
            Password Strength
          </Text>
          <Text
            className="text-sm font-semibold capitalize"
            style={{ color: config.textColor }}
          >
            {config.text}
          </Text>
        </View>

        <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full transition-all duration-300"
            style={progressStyle}
          />
        </View>
      </View>

      {/* Requirements Checklist */}
      <View className="space-y-1">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Password Requirements:
        </Text>
        {requirements.map((req) => (
          <View key={req.key} className="flex-row items-center">
            <View className="mr-2">
              {req.met ? (
                <Check size={16} color="#10B981" />
              ) : (
                <X size={16} color="#EF4444" />
              )}
            </View>
            <Text
              className={clsx(
                "text-sm",
                req.met ? "text-emerald-600" : "text-gray-500"
              )}
            >
              {req.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
