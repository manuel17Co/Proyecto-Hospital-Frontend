import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppButton from '../../../../src/components/AppButton';
import AppInput from '../../../../src/components/AppInput';
import { deleteDoctor, getDoctorById, updateDoctor } from '../../../../src/services/doctors';
import { COLORS } from '../../../../src/styles/colors';
import { globalStyles } from '../../../../src/styles/globalStyles';

export default function EditarMedico() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      Alert.alert('Error', 'ID de médico inválido');
      router.back();
      return;
    }

    let mounted = true;
    async function loadDoctor() {
      try {
        const data = await getDoctorById(parsedId);
        if (!mounted) return;
        setDoctorId(data.id);
        setNombre(data.nombre);
        setApellido(data.apellido);
        setEspecialidad(data.especialidad);
        setTelefono(data.telefono);
      } catch {
        if (!mounted) return;
        Alert.alert('Error', 'No se pudo cargar el médico');
        router.back();
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDoctor();
    return () => {
      mounted = false;
    };
  }, [id, router]);

  const handleUpdate = async () => {
    if (!doctorId) return;
    if (!nombre || !apellido || !especialidad || !telefono) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    try {
      setSubmitting(true);
      await updateDoctor(doctorId, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        especialidad: especialidad.trim(),
        telefono: telefono.trim(),
      });
      Alert.alert('Éxito', 'Médico actualizado correctamente');
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el médico');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!doctorId) return;
    Alert.alert('Eliminar médico', '¿Estás seguro que deseas eliminar este médico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoctor(doctorId);
            router.back();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar el médico');
          }
        },
      },
    ]);
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
      <Text style={globalStyles.title}>Editar Médico</Text>
      <AppInput label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Ingrese el nombre" />
      <AppInput label="Apellido" value={apellido} onChangeText={setApellido} placeholder="Ingrese el apellido" />
      <AppInput
        label="Especialidad"
        value={especialidad}
        onChangeText={setEspecialidad}
        placeholder="Ingrese la especialidad"
      />
      <AppInput label="Teléfono" value={telefono} onChangeText={setTelefono} placeholder="Ingrese el teléfono" />

      <View style={styles.button}>
        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <AppButton title="Actualizar Médico" onPress={() => void handleUpdate()} />
        )}
      </View>

      <View style={styles.deleteButton}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteText}>Eliminar Médico</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 10,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});
