import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
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
import { getAppointments } from '../../../src/services/appointments';
import { COLORS } from '../../../src/styles/colors';
import { globalStyles } from '../../../src/styles/globalStyles';
import { Appointment, AppointmentStatus } from '../../../src/types/appointments';

type StatusFilter = 'TODAS' | AppointmentStatus;

const STATUS_OPTIONS: StatusFilter[] = ['TODAS', 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];

const statusStyles: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  PENDIENTE: { bg: '#FEF3C7', text: '#92400E', label: 'Pendiente' },
  CONFIRMADA: { bg: '#DBEAFE', text: '#1E3A8A', label: 'Confirmada' },
  CANCELADA: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelada' },
  COMPLETADA: { bg: '#DCFCE7', text: '#166534', label: 'Completada' },
};

function formatDate(dateIso: string): string {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return dateIso;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function CitasIndex() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('TODAS');

  const loadAppointments = useCallback(async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      setError(null);
      const data = await getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudieron cargar las citas');
    } finally {
      if (showFullLoader) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAppointments(true);
    }, [loadAppointments]),
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadAppointments(false);
    } finally {
      setRefreshing(false);
    }
  }, [loadAppointments]);

  const filteredAppointments = useMemo(() => {
    if (filter === 'TODAS') return appointments;
    return appointments.filter((a) => a.estado === filter);
  }, [appointments, filter]);

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.helperText}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Citas</Text>

      <AppButton title="Crear Cita" onPress={() => router.push('/(tabs)/(citas)/crear')} />

      <View style={styles.filters}>
        {STATUS_OPTIONS.map((statusOption) => (
          <TouchableOpacity
            key={statusOption}
            style={[styles.filterChip, filter === statusOption && styles.filterChipActive]}
            onPress={() => setFilter(statusOption)}
          >
            <Text style={[styles.filterText, filter === statusOption && styles.filterTextActive]}>{statusOption}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <AppButton title="Reintentar" onPress={() => loadAppointments(true)} />
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.helperText}>No hay citas para este filtro.</Text>}
          renderItem={({ item }) => {
            const badge = statusStyles[item.estado];
            return (
              <View style={globalStyles.card}>
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>
                    {item.paciente.nombre} {item.paciente.apellido}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>
                <Text style={styles.cardText}>Fecha: {formatDate(item.fechaHora)}</Text>
                <Text style={styles.cardText}>Médico ID: {item.medicoId}</Text>
                <Text style={styles.cardText}>Instalación ID: {item.instalacionId}</Text>
                {!!item.notas && <Text style={styles.cardText}>Notas: {item.notas}</Text>}

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push(`/(tabs)/(citas)/detalle/${item.id}`)}
                  >
                    <Ionicons name="eye-outline" size={18} color={COLORS.white} />
                    <Text style={styles.actionText}>Detalle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push(`/(tabs)/(citas)/editar/${item.id}`)}
                  >
                    <Ionicons name="create-outline" size={18} color={COLORS.white} />
                    <Text style={styles.actionText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
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
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  errorBox: {
    marginTop: 10,
  },
  errorText: {
    color: '#B91C1C',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  cardText: {
    color: COLORS.text,
    marginBottom: 4,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
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

