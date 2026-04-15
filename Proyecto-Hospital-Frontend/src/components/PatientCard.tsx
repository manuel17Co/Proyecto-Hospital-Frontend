import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../styles/colors";
import { Patient } from "../types/patient";

type Props = {
  patient: Patient;
};

export default function PatientCard({ patient }: Props) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`../editar/${patient.id}`);
  };

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

      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>

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
    fontSize: 13,
  },

  button: {
    marginTop: 10,
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});