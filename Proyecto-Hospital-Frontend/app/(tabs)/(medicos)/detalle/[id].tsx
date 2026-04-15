import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getDoctorById } from '../../../../src/services/doctors';
import { COLORS } from '../../../../src/styles/colors';
import { globalStyles } from '../../../../src/styles/globalStyles';
import { Doctor } from '../../../../src/types/doctors';

export default function DetalleMedico() {
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      setError('ID de médico inválido.');
      setLoading(false);
      return;
    }

    let mounted = true;
    async function loadDoctor() {
      try {
        const data = await getDoctorById(parsedId);
        if (mounted) setDoctor(data);
      } catch {
        if (mounted) setError('No se pudo cargar el médico.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDoctor();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !doctor) {
    return (
      <View style={globalStyles.container}>
        <Text>{error ?? 'Médico no encontrado.'}</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Detalle Médico</Text>
      <View style={styles.card}>
        <Text style={styles.name}>
          {doctor.nombre} {doctor.apellido}
        </Text>
        <Text style={styles.text}>Especialidad: {doctor.especialidad}</Text>
        <Text style={styles.text}>Teléfono: {doctor.telefono}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
  },
  name: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  text: {
    color: COLORS.textLight,
    marginTop: 6,
  },
});
