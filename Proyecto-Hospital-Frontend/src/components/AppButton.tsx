import { Text, TouchableOpacity } from "react-native";
import { COLORS } from "../styles/colors";

type Props = {
  title: string;
  onPress: () => void;
};

export default function AppButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 8,
      }}
    >
      <Text style={{ color: COLORS.white, fontWeight: "600" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}