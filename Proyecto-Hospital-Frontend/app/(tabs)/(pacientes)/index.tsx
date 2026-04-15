import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AppButton from "../../../src/components/AppButton";
import PatientCard from "../../../src/components/PatientCard";
import { usePatients } from "../../../src/context/PatientsContext"; // 🔥 IMPORTANTE
import { COLORS } from "../../../src/styles/colors";
import { globalStyles } from "../../../src/styles/globalStyles";

export default function PacientesScreen() {
  const router = useRouter();

  // 🔥 USAR CONTEXT (NO useState)
  const { patients } = usePatients();

  const [filtro, setFiltro] = useState("TODOS");

  const filteredPatients =
    filtro === "TODOS"
      ? patients
      : patients.filter((p) => p.estado === filtro);

  return (
    <View style={globalStyles.container}>
      
      <Text style={globalStyles.title}>Pacientes</Text>

      <AppButton
        title="Agregar Paciente"
        onPress={() => router.push("../crear")}
      />

      {/* 🔥 FILTROS CON ICONOS */}
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

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PatientCard patient={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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