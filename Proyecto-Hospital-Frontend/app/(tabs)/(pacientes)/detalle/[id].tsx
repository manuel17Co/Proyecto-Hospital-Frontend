import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { usePatients } from "../../../../src/context/PatientsContext";
import { COLORS } from "../../../../src/styles/colors";
import { globalStyles } from "../../../../src/styles/globalStyles";

export default function DetallePaciente() {
  const { id } = useLocalSearchParams();
  const { patients } = usePatients();

  const paciente = patients.find((p) => p.id === id);

  if (!paciente) {
    return (
      <View style={globalStyles.container}>
        <Text>Paciente no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      
      <Text style={globalStyles.title}>Detalle Paciente</Text>

      <View style={styles.card}>
        
        <Text style={styles.name}>
          {paciente.nombre} {paciente.apellido}
        </Text>

        <Text style={styles.text}>Documento: {paciente.documento}</Text>

        <Text style={styles.text}>Estado: {paciente.estado}</Text>

      </View>

      {/* 🔥 CITAS SIMULADAS */}
      <Text style={styles.subtitle}>Citas asociadas</Text>

      <View style={styles.cita}>
        <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
        <Text>Consulta general</Text>
      </View>

      <View style={styles.cita}>
        <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
        <Text>Control mensual</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },

  name: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },

  text: {
    color: COLORS.textLight,
    marginTop: 5,
  },

  subtitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  cita: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
});