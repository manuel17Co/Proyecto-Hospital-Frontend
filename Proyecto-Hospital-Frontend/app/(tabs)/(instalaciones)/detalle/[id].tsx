import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getFacilityById } from '../../../../src/services/facilities';
import { COLORS } from '../../../../src/styles/colors';
import { globalStyles } from '../../../../src/styles/globalStyles';
import { Facility } from '../../../../src/types/facilities';

export default function DetalleInstalacion() {
  const { id } = useLocalSearchParams();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      setError('ID de instalación inválido.');
      setLoading(false);
      return;
    }

    let mounted = true;
    async function loadFacility() {
      try {
        const data = await getFacilityById(parsedId);
        if (mounted) setFacility(data);
      } catch {
        if (mounted) setError('No se pudo cargar la instalación.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFacility();
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

  if (error || !facility) {
    return (
      <View style={globalStyles.container}>
        <Text>{error ?? 'Instalación no encontrada.'}</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Detalle Instalación</Text>
      <View style={styles.card}>
        <Text style={styles.name}>{facility.nombre}</Text>
        <Text style={styles.text}>Tipo: {facility.tipo}</Text>
        <Text style={styles.text}>Ubicación: {facility.ubicacion}</Text>
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
