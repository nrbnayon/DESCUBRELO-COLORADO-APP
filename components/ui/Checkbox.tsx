import { TouchableOpacity, View, Text } from "react-native";
import { Check } from "lucide-react-native";
import { cn } from "@/utils/cn";
import React from "react";

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: React.ReactNode;
  error?: string;
  className?: string;
}

export function Checkbox({
  checked,
  onPress,
  label,
  error,
  className,
}: CheckboxProps) {
  return (
    <View className={cn("mb-4", className)}>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center gap-2"
      >
        <View
          className={cn(
            "w-5 h-5 border-2 rounded-[6px] items-center justify-center border-primary",
            checked ? "bg-primary border-primary" : "border-input bg-card"
          )}
        >
          {checked && <Check size={12} color="white" />}
        </View>
        {label && <View className="flex-1">{label}</View>}
      </TouchableOpacity>
      {error && <Text className="text-error text-sm mt-1 ml-7">{error}</Text>}
    </View>
  );
}
