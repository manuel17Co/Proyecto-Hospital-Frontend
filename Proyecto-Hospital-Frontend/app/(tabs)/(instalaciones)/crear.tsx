import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../../src/components/AppButton';
import AppInput from '../../../src/components/AppInput';
import { createFacility } from '../../../src/services/facilities';
import { COLORS } from '../../../src/styles/colors';
import { globalStyles } from '../../../src/styles/globalStyles';

export default function CrearInstalacion() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!nombre || !tipo || !ubicacion) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    try {
      setSubmitting(true);
      await createFacility({
        nombre: nombre.trim(),
        tipo: tipo.trim(),
        ubicacion: ubicacion.trim(),
      });
      Alert.alert('Éxito', 'Instalación creada correctamente');
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo crear la instalación');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Crear Instalación</Text>
      <AppInput label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Consultorio 101" />
      <AppInput label="Tipo" value={tipo} onChangeText={setTipo} placeholder="OFICINA" />
      <AppInput label="Ubicación" value={ubicacion} onChangeText={setUbicacion} placeholder="Piso 1, Ala Norte" />

      <View style={styles.button}>
        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <AppButton title="Guardar Instalación" onPress={() => void handleCreate()} />
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
