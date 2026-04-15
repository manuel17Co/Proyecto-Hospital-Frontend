import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AppButton from "../../../src/components/AppButton";
import PatientCard from "../../../src/components/PatientCard";
import { getPatients } from "../../../src/services/patients";
import { COLORS } from "../../../src/styles/colors";
import { globalStyles } from "../../../src/styles/globalStyles";
import { Patient } from "../../../src/types/patient";

export default function PacientesScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"TODOS" | "ACTIVO" | "INACTIVO">("TODOS");

  const loadPatients = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      const data = await getPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudieron cargar los pacientes.");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPatients(true);
    }, [loadPatients]),
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadPatients(false);
    } finally {
      setRefreshing(false);
    }
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    if (filtro === "TODOS") return patients;
    return patients.filter((p) => p.estado === filtro);
  }, [filtro, patients]);

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.helperText}>Cargando pacientes...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Pacientes</Text>

      <AppButton title="Agregar Paciente" onPress={() => router.push("/(tabs)/(pacientes)/crear")} />

      <View style={styles.filters}>
        <TouchableOpacity onPress={() => setFiltro("TODOS")} style={styles.filterBtn}>
          <Ionicons name="list-outline" size={18} color={COLORS.primary} />
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFiltro("ACTIVO")} style={styles.filterBtn}>
          <Ionicons name="checkmark-circle-outline" size={18} color="green" />
          <Text style={styles.filterText}>Activos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFiltro("INACTIVO")} style={styles.filterBtn}>
          <Ionicons name="close-circle-outline" size={18} color="red" />
          <Text style={styles.filterText}>Inactivos</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <AppButton title="Reintentar" onPress={() => void loadPatients(true)} />
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.helperText}>No hay pacientes disponibles.</Text>}
          renderItem={({ item }) => <PatientCard patient={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  helperText: {
    marginTop: 10,
    color: COLORS.textLight,
  },
  errorBox: {
    marginTop: 10,
  },
  errorText: {
    color: "#B91C1C",
    marginBottom: 8,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  filterText: {
    color: COLORS.text,
    fontWeight: "600",
  },
});