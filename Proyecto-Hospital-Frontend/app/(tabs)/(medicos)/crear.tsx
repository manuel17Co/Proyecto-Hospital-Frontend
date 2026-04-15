import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../../src/components/AppButton';
import AppInput from '../../../src/components/AppInput';
import { createDoctor } from '../../../src/services/doctors';
import { COLORS } from '../../../src/styles/colors';
import { globalStyles } from '../../../src/styles/globalStyles';

export default function CrearMedico() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!nombre || !apellido || !especialidad || !telefono) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    try {
      setSubmitting(true);
      await createDoctor({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        especialidad: especialidad.trim(),
        telefono: telefono.trim(),
      });
      Alert.alert('Éxito', 'Médico creado correctamente');
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo crear el médico');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Crear Médico</Text>
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
          <AppButton title="Guardar Médico" onPress={() => void handleCreate()} />
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
