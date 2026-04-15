import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../src/components/AppButton";
import AppInput from "../../../src/components/AppInput";
import { createPatient } from "../../../src/services/patients";
import { COLORS } from "../../../src/styles/colors";
import { globalStyles } from "../../../src/styles/globalStyles";

export default function CrearPaciente() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!nombre || !apellido || !documento || !telefono) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      setSubmitting(true);
      await createPatient({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        documento: documento.trim(),
        telefono: telefono.trim(),
      });
      Alert.alert("Éxito", "Paciente creado correctamente");
      router.back();
    } catch {
      Alert.alert("Error", "No se pudo crear el paciente");
    } finally {
      setSubmitting(false);
    }

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

      <View style={styles.button}>
        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <AppButton title="Guardar Paciente" onPress={() => void handleCreate()} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});
