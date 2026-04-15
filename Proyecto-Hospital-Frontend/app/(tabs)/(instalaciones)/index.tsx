import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppButton from '../../../src/components/AppButton';
import { getFacilities } from '../../../src/services/facilities';
import { COLORS } from '../../../src/styles/colors';
import { globalStyles } from '../../../src/styles/globalStyles';
import { Facility } from '../../../src/types/facilities';

export default function InstalacionesIndex() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFacilities = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      const data = await getFacilities();
      setFacilities(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudieron cargar las instalaciones.');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFacilities(true);
    }, [loadFacilities]),
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadFacilities(false);
    } finally {
      setRefreshing(false);
    }
  }, [loadFacilities]);

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Instalaciones</Text>

      <AppButton title="Agregar Instalación" onPress={() => router.push('/(tabs)/(instalaciones)/crear')} />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <AppButton title="Reintentar" onPress={() => void loadFacilities(true)} />
        </View>
      ) : (
        <FlatList
          data={facilities}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.helperText}>No hay instalaciones registradas.</Text>}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.cardText}>Tipo: {item.tipo}</Text>
              <Text style={styles.cardText}>Ubicación: {item.ubicacion}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => router.push(`/(tabs)/(instalaciones)/detalle/${item.id}`)}
                >
                  <Ionicons name="eye-outline" size={18} color={COLORS.white} />
                  <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => router.push(`/(tabs)/(instalaciones)/editar/${item.id}`)}
                >
                  <Ionicons name="create-outline" size={18} color={COLORS.white} />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    marginTop: 10,
    color: COLORS.textLight,
  },
  errorBox: {
    marginTop: 10,
  },
  errorText: {
    color: '#B91C1C',
    marginBottom: 8,
  },
  cardTitle: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  cardText: {
    color: COLORS.text,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  actionText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
