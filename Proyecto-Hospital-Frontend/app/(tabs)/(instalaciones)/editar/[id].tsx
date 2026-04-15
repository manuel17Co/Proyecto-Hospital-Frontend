import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppButton from '../../../../src/components/AppButton';
import AppInput from '../../../../src/components/AppInput';
import { deleteFacility, getFacilityById, updateFacility } from '../../../../src/services/facilities';
import { COLORS } from '../../../../src/styles/colors';
import { globalStyles } from '../../../../src/styles/globalStyles';

export default function EditarInstalacion() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [facilityId, setFacilityId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      Alert.alert('Error', 'ID de instalación inválido');
      router.back();
      return;
    }

    let mounted = true;
    async function loadFacility() {
      try {
        const data = await getFacilityById(parsedId);
        if (!mounted) return;
        setFacilityId(data.id);
        setNombre(data.nombre);
        setTipo(data.tipo);
        setUbicacion(data.ubicacion);
      } catch {
        if (!mounted) return;
        Alert.alert('Error', 'No se pudo cargar la instalación');
        router.back();
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFacility();
    return () => {
      mounted = false;
    };
  }, [id, router]);

  const handleUpdate = async () => {
    if (!facilityId) return;
    if (!nombre || !tipo || !ubicacion) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    try {
      setSubmitting(true);
      await updateFacility(facilityId, {
        nombre: nombre.trim(),
        tipo: tipo.trim(),
        ubicacion: ubicacion.trim(),
      });
      Alert.alert('Éxito', 'Instalación actualizada correctamente');
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la instalación');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!facilityId) return;
    Alert.alert('Eliminar instalación', '¿Estás seguro que deseas eliminar esta instalación?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteFacility(facilityId);
            router.back();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar la instalación');
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
      <Text style={globalStyles.title}>Editar Instalación</Text>
      <AppInput label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Consultorio 101" />
      <AppInput label="Tipo" value={tipo} onChangeText={setTipo} placeholder="OFICINA" />
      <AppInput label="Ubicación" value={ubicacion} onChangeText={setUbicacion} placeholder="Piso 1, Ala Norte" />

      <View style={styles.button}>
        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <AppButton title="Actualizar Instalación" onPress={() => void handleUpdate()} />
        )}
      </View>

      <View style={styles.deleteButton}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteText}>Eliminar Instalación</Text>
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
