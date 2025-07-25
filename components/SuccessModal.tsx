import { View, Text, Modal } from "react-native";
import { Check } from "lucide-react-native";
import { Button } from "./ui/Button";

interface SuccessModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
}

export function SuccessModal({ visible, title, onClose }: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-8 w-full max-w-sm items-center">
          {/* Decorative dots container */}
          <View className="relative mb-8">
            {/* Background decorative dots */}
            <View className="absolute -top-4 -left-6 w-2 h-2 bg-green-400 rounded-full opacity-60" />
            <View className="absolute -top-8 left-8 w-1.5 h-1.5 bg-green-300 rounded-full opacity-40" />
            <View className="absolute -top-2 left-16 w-1 h-1 bg-green-500 rounded-full opacity-50" />
            <View className="absolute top-8 -left-4 w-1.5 h-1.5 bg-green-400 rounded-full opacity-30" />
            <View className="absolute -bottom-4 left-12 w-2 h-2 bg-green-300 rounded-full opacity-40" />
            <View className="absolute -bottom-6 -right-2 w-1.5 h-1.5 bg-green-500 rounded-full opacity-50" />
            <View className="absolute top-6 right-8 w-1 h-1 bg-green-400 rounded-full opacity-60" />
            <View className="absolute -top-6 right-4 w-1.5 h-1.5 bg-green-300 rounded-full opacity-40" />

            {/* Main success circle */}
            <View className="w-24 h-24 bg-green-500 rounded-full items-center justify-center">
              <View className="w-12 h-12 bg-white rounded-xl items-center justify-center">
                <Check size={24} color="#22c55e" strokeWidth={3} />
              </View>
            </View>
          </View>

          {/* Title */}
          <Text className="text-black text-2xl font-bold text-center mb-2">
            Congratulation
          </Text>

          {/* Subtitle */}
          <Text className="text-gray-500 text-base text-center mb-12 leading-5">
            {title}
          </Text>

          {/* Continue Button */}
          <Button
            onPress={onClose}
            className="w-full bg-green-500"
            size="lg"
            textClassName="text-white font-semibold"
          >
            Get Started
          </Button>
        </View>
      </View>
    </Modal>
  );
}
