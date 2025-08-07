import { TextInput, TouchableOpacity } from "react-native";
import { Search } from "lucide-react-native";
import { createShadow } from "@/utils/shadows";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  className?: string;
  iconShow?: boolean
}

export function SearchInput({
  placeholder,
  value,
  onChangeText,
  onPress,
  className,
  iconShow = true,
}: SearchInputProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center rounded-base pl-1 pr-3 py-2 ${className}`}
      style={createShadow({
        x: 0,
        y: 0,
        blur: 12.5,
        color: "#000000",
        opacity: 0.06,
        elevation: 2,
      })}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <TextInput
        placeholder={placeholder}
        placeholderTextColor='#9CA3AF'
        value={value}
        onChangeText={onChangeText}
        editable={!onPress}
        pointerEvents={onPress ? "none" : "auto"}
        className='flex-1 ml-2 text-gray-800'
      />
      {iconShow && <Search size={20} color='#4DBA28' />}
    </TouchableOpacity>
  );
}
