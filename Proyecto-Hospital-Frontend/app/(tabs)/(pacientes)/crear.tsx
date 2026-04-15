import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../src/components/AppButton";
import AppInput from "../../../src/components/AppInput";
import { globalStyles } from "../../../src/styles/globalStyles";

export default function CrearPaciente() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [estado, setEstado] = useState("");

  const handleCreate = () => {
    if (!nombre || !apellido || !documento || !estado) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    // 🔥 aquí luego irá el backend
    console.log({
      nombre,
      apellido,
      documento,
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
        label="Documento"
        value={documento}
        onChangeText={setDocumento}
        placeholder="Ingrese el documento"
      />

      <AppInput
        label="Estado"
        value={estado}
        onChangeText={setEstado}
        placeholder="ACTIVO o INACTIVO"
      />

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
});