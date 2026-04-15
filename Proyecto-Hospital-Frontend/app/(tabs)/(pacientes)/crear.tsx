import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../src/components/AppButton";
import AppInput from "../../../src/components/AppInput";
import { usePatients } from "../../../src/context/PatientsContext"; // 🔥 IMPORTANTE
import { globalStyles } from "../../../src/styles/globalStyles";

export default function CrearPaciente() {
  const router = useRouter();

  // 🔥 USAR CONTEXT
  const { addPatient } = usePatients();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estado, setEstado] = useState<"ACTIVO" | "INACTIVO">("ACTIVO");

  const handleCreate = () => {
    if (!nombre || !apellido || !documento || !estado) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    
    // 🔥 AGREGAR AL CONTEXT
    addPatient({
      id: Date.now().toString(),
      nombre,
      apellido,
      documento,
      telefono,
      estado,
    });

    Alert.alert("Éxito", "Paciente creado correctamente");

    router.back(); // volver a la lista
  };

  return (
    <View style={globalStyles.container}>
      
      <Text style={globalStyles.title}>Crear Paciente</Text>

      <AppInput
        label="Nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese el nombre"
      />

      <AppInput
        label="Apellido"
        value={apellido}
        onChangeText={setApellido}
        placeholder="Ingrese el apellido"
      />

      <AppInput
        label="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Ingrese el teléfono"
      />

      <AppInput
        label="Documento"
        value={documento}
        onChangeText={setDocumento}
        placeholder="Ingrese el documento"
      />

      <Text style={{ marginTop: 10, fontWeight: "600" }}>Estado</Text>

<View style={styles.estadoContainer}>

  <AppButton
    title="ACTIVO"
    onPress={() => setEstado("ACTIVO")}
  />

  <AppButton
    title="INACTIVO"
    onPress={() => setEstado("INACTIVO")}
  />

</View>

      <View style={styles.button}>
        <AppButton title="Guardar Paciente" onPress={handleCreate} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },

  estadoContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
