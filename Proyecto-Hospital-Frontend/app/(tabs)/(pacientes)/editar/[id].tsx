import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AppButton from "../../../../src/components/AppButton";
import AppInput from "../../../../src/components/AppInput";
import { usePatients } from "../../../../src/context/PatientsContext";
import { COLORS } from "../../../../src/styles/colors";
import { globalStyles } from "../../../../src/styles/globalStyles";

export default function EditarPaciente() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { patients, updatePatient, deletePatient } = usePatients();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");

  
  const [estado, setEstado] = useState<"ACTIVO" | "INACTIVO">("ACTIVO");

  useEffect(() => {
    const paciente = patients.find((p) => p.id === id);

    if (paciente) {
      setNombre(paciente.nombre);
      setApellido(paciente.apellido);
      setDocumento(paciente.documento);
      setEstado(paciente.estado);
      setTelefono(paciente.telefono);
    }
  }, [id, patients]);

 
  const handleUpdate = () => {
    if (!nombre || !apellido || !documento || !estado || !telefono) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    updatePatient({
      id: id as string,
      nombre,
      apellido,
      documento,
      estado,
      telefono,
    });

    Alert.alert("Éxito", "Paciente actualizado correctamente");
    router.back();
  };

  
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
            deletePatient(id as string);
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
        label="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Ingrese el teléfono"
      />


      
      <Text style={styles.label}>Estado</Text>

      <View style={styles.estadoContainer}>
        <TouchableOpacity
          style={[
            styles.estadoBtn,
            estado === "ACTIVO" && styles.estadoActivo,
          ]}
          onPress={() => setEstado("ACTIVO")}
        >
          <Text
            style={[
              styles.estadoText,
              estado === "ACTIVO" && styles.estadoTextActivo,
            ]}
          >
            ACTIVO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.estadoBtn,
            estado === "INACTIVO" && styles.estadoInactivo,
          ]}
          onPress={() => setEstado("INACTIVO")}
        >
          <Text
            style={[
              styles.estadoText,
              estado === "INACTIVO" && styles.estadoTextInactivo,
            ]}
          >
            INACTIVO
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.button}>
        <AppButton title="Actualizar Paciente" onPress={handleUpdate} />
      </View>

      
      <View style={styles.deleteButton}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteText}>Eliminar Paciente</Text>
        </TouchableOpacity>
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

  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 10,
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },

  label: {
    marginTop: 10,
    marginBottom: 6,
    color: COLORS.text,
    fontWeight: "600",
  },

  estadoContainer: {
    flexDirection: "row",
    gap: 10,
  },

  estadoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  estadoText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  estadoActivo: {
    backgroundColor: COLORS.primary,
  },

  estadoTextActivo: {
    color: COLORS.white,
  },

  estadoInactivo: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },

  estadoTextInactivo: {
    color: COLORS.white,
  },
});