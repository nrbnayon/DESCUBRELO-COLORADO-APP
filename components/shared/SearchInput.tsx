import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";
import { createShadow } from "@/utils/shadows";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder,
  value,
  onChangeText,
  className,
}: SearchInputProps) {
  return (
    <View
      className={`flex-row items-center rounded-xl pl-5 pr-3 py-2 ${className}`}
      style={createShadow({
        x: 0,
        y: 0,
        blur: 12.5, 
        color: "#000000",
        opacity: 0.06, 
        elevation: 2,
      })}
    >
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-gray-800"
      />
      <Search size={20} color="#4DBA28" />
    </View>
  );
}
