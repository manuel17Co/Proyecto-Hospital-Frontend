import { Text, TouchableOpacity } from "react-native";
import { COLORS } from "../styles/colors";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean; // Ya estaba bien aquí
};

// 1. Desestructuramos 'disabled' aquí
export default function AppButton({ title, onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled} // 2. Se lo pasamos al componente nativo
      style={{
        // 3. Si está deshabilitado, bajamos la opacidad para que se vea visualmente bloqueado
        backgroundColor: disabled ? "#94A3B8" : COLORS.primary, 
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 8,
        opacity: disabled ? 0.7 : 1, 
      }}
    >
      <Text style={{ color: COLORS.white, fontWeight: "600" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}