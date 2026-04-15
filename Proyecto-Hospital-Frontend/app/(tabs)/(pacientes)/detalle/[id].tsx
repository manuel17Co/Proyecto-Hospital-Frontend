import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { getPatientById } from "../../../../src/services/patients";
import { COLORS } from "../../../../src/styles/colors";
import { globalStyles } from "../../../../src/styles/globalStyles";
import { Patient } from "../../../../src/types/patient";

export default function DetallePaciente() {
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      setError("ID de paciente inválido.");
      setLoading(false);
      return;
    }

    let mounted = true;
    async function loadDetail() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPatientById(parsedId);
        if (mounted) setPatient(data);
      } catch {
        if (mounted) setError("No se pudo cargar el paciente.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={globalStyles.container}>
        <Text>{error ?? "Paciente no encontrado."}</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Detalle Paciente</Text>

      <View style={styles.card}>
        <Text style={styles.name}>
          {patient.nombre} {patient.apellido}
        </Text>

        <Text style={styles.text}>Documento: {patient.documento}</Text>
        <Text style={styles.text}>Teléfono: {patient.telefono}</Text>
        <Text style={styles.text}>Estado: {patient.estado}</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
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
});