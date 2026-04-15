import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../../src/components/AppButton";
import AppInput from "../../../../src/components/AppInput";
import { globalStyles } from "../../../../src/styles/globalStyles";

export default function EditarPaciente() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [estado, setEstado] = useState("");

  // 🔥 Simulación de carga (luego backend)
  useEffect(() => {
    if (id) {
      setNombre("Juan");
      setApellido("Perez");
      setDocumento("123456");
      setEstado("ACTIVO");
    }
  }, [id]);

  // ✅ ACTUALIZAR
  const handleUpdate = () => {
    if (!nombre || !apellido || !documento || !estado) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    console.log("Actualizando paciente:", {
      id,
      nombre,
      apellido,
      documento,
      estado,
    });

    Alert.alert("Éxito", "Paciente actualizado correctamente");
    router.back();
  };

  // ❌ ELIMINAR
  const handleDelete = () => {
    Alert.alert(
      "Eliminar paciente",
      "¿Estás seguro que deseas eliminar este paciente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            console.log("Paciente eliminado:", id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={globalStyles.container}>
      
      <Text style={globalStyles.title}>Editar Paciente</Text>

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
        <AppButton title="Actualizar Paciente" onPress={handleUpdate} />
      </View>

      <View style={styles.deleteButton}>
        <AppButton title="Eliminar Paciente" onPress={handleDelete} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 10,
  },
});