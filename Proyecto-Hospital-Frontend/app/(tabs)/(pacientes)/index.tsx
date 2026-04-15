import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

// 👇 IMPORTS SIN @
import AppButton from "../../../src/components/AppButton";
import PatientCard from "../../../src/components/PatientCard";
import { globalStyles } from "../../../src/styles/globalStyles";
import { Patient } from "../../../src/types/patient";

export default function PacientesScreen() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      nombre: "Juan",
      apellido: "Perez",
      documento: "123456",
      estado: "ACTIVO",
    },
    {
      id: "2",
      nombre: "Maria",
      apellido: "Gomez",
      documento: "789012",
      estado: "INACTIVO",
    },
  ]);

  return (
    <View style={globalStyles.container}>
      
      <Text style={globalStyles.title}>Pacientes</Text>

      <AppButton
        title="Agregar Paciente"
        onPress={() => router.push("../crear")}
      />

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PatientCard
            patient={item}
            
            
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
  },
});