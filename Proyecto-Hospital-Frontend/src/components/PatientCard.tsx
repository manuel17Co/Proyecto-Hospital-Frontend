import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { COLORS } from "../styles/colors";
import { Patient } from "../types/patient";

type Props = {
  patient: Patient;
};

export default function PatientCard({ patient }: Props) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      
      <Text style={styles.name}>
        {patient.nombre} {patient.apellido}
      </Text>

      <Text style={styles.document}>
        Documento: {patient.documento}
      </Text>

      <Text style={styles.status}>
        Estado: {patient.estado}
      </Text>

      {/* 🔥 ACCIONES */}
      <View style={styles.actions}>
        
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/(tabs)/(pacientes)/detalle/${patient.id}`)}
        >
          <Ionicons name="eye-outline" size={18} color={COLORS.white} />
          <Text style={styles.actionText}>Ver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/(tabs)/(pacientes)/editar/${patient.id}`)}
        >
          <Ionicons name="create-outline" size={18} color={COLORS.white} />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  name: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  document: {
    color: COLORS.textLight,
    marginTop: 4,
  },

  status: {
    color: COLORS.white,
    marginTop: 4,
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 15,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  actionText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});