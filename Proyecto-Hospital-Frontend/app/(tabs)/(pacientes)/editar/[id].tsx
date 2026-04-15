import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AppButton from "../../../../src/components/AppButton";
import AppInput from "../../../../src/components/AppInput";
import { deletePatient, getPatientById, updatePatient } from "../../../../src/services/patients";
import { COLORS } from "../../../../src/styles/colors";
import { globalStyles } from "../../../../src/styles/globalStyles";
import { Patient } from "../../../../src/types/patient";

export default function EditarPaciente() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estado, setEstado] = useState<Patient["estado"]>("ACTIVO");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [patientId, setPatientId] = useState<number | null>(null);

  useEffect(() => {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      setLoading(false);
      Alert.alert("Error", "ID de paciente inválido");
      router.back();
      return;
    }

    let mounted = true;
    async function loadPatient() {
      try {
        const paciente = await getPatientById(parsedId);
        if (!mounted) return;
        setPatientId(paciente.id);
        setNombre(paciente.nombre);
        setApellido(paciente.apellido);
        setDocumento(paciente.documento);
        setEstado(paciente.estado);
        setTelefono(paciente.telefono);
      } catch {
        if (!mounted) return;
        Alert.alert("Error", "No se pudo cargar el paciente");
        router.back();
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadPatient();
    return () => {
      mounted = false;
    };
  }, [id, router]);

 
  const handleUpdate = async () => {
    if (!nombre || !apellido || !documento || !estado || !telefono) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (!patientId) return;

    try {
      setSubmitting(true);
      await updatePatient(patientId, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        documento: documento.trim(),
        telefono: telefono.trim(),
      });
      Alert.alert("Éxito", "Paciente actualizado correctamente");
      router.back();
    } catch {
      Alert.alert("Error", "No se pudo actualizar el paciente");
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleDelete = () => {
    if (!patientId) return;
    Alert.alert(
      "Eliminar paciente",
      "¿Estás seguro que deseas eliminar este paciente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePatient(patientId);
              router.back();
            } catch {
              Alert.alert("Error", "No se pudo eliminar el paciente");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

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
        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <AppButton title="Actualizar Paciente" onPress={() => void handleUpdate()} />
        )}
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
  center: {
    justifyContent: "center",
    alignItems: "center",
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