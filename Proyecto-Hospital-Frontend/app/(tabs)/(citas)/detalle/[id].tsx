import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppButton from '../../../../src/components/AppButton';
import { deleteAppointment, getAppointmentById, updateAppointmentStatus } from '../../../../src/services/appointments';
import { COLORS } from '../../../../src/styles/colors';
import { globalStyles } from '../../../../src/styles/globalStyles';
import { Appointment, AppointmentStatus } from '../../../../src/types/appointments';

const statusStyles: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  PENDIENTE: { bg: '#FEF3C7', text: '#92400E', label: 'Pendiente' },
  CONFIRMADA: { bg: '#DBEAFE', text: '#1E3A8A', label: 'Confirmada' },
  CANCELADA: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelada' },
  COMPLETADA: { bg: '#DCFCE7', text: '#166534', label: 'Completada' },
};
const statusOptions: AppointmentStatus[] = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];

function formatDate(dateIso: string): string {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return dateIso;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function DetalleCitaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const idNumber = useMemo(() => Number(id), [id]);

  const loadDetail = useCallback(async () => {
    if (!id || Number.isNaN(idNumber)) {
      setError('ID de cita inválido');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getAppointmentById(idNumber);
      setAppointment(data);
    } catch {
      setError('No se pudo cargar el detalle de la cita');
    } finally {
      setLoading(false);
    }
  }, [id, idNumber]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleStatusChange = async (estado: AppointmentStatus) => {
    if (!appointment) return;
    try {
      const updated = await updateAppointmentStatus(appointment.id, estado);
      setAppointment(updated);
      Alert.alert('Estado actualizado', `La cita ahora está ${statusStyles[estado].label.toLowerCase()}`);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  const handleDelete = () => {
    if (!appointment) return;
    Alert.alert('Eliminar cita', '¿Seguro que deseas eliminar esta cita de forma permanente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAppointment(appointment.id);
            Alert.alert('Eliminada', 'La cita fue eliminada correctamente');
            router.push('/(tabs)/(citas)');
          } catch {
            Alert.alert('Error', 'No se pudo eliminar la cita');
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

  if (error || !appointment) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <Text style={styles.errorText}>{error ?? 'Cita no encontrada'}</Text>
        <AppButton title="Reintentar" onPress={loadDetail} />
      </View>
    );
  }

  const badge = statusStyles[appointment.estado];

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Detalle Cita #{appointment.id}</Text>

      <View style={globalStyles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Estado</Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>
        <Text style={styles.value}>Paciente: {appointment.paciente.nombre} {appointment.paciente.apellido}</Text>
        <Text style={styles.value}>Fecha: {formatDate(appointment.fechaHora)}</Text>
        <Text style={styles.value}>Médico ID: {appointment.medicoId}</Text>
        <Text style={styles.value}>Instalación ID: {appointment.instalacionId}</Text>
        <Text style={styles.value}>Notas: {appointment.notas || 'Sin notas'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Cambiar estado</Text>
      <View style={styles.statusGrid}>
        {statusOptions.map((statusOption) => (
          <TouchableOpacity
            key={statusOption}
            style={[
              styles.statusButton,
              appointment.estado === statusOption && styles.statusButtonActive,
            ]}
            onPress={() => handleStatusChange(statusOption)}
          >
            <Text
              style={[
                styles.statusButtonText,
                appointment.estado === statusOption && styles.statusButtonTextActive,
              ]}
            >
              {statusOption}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <AppButton title="Editar / Reprogramar" onPress={() => router.push(`/(tabs)/(citas)/editar/${appointment.id}`)} />

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>Eliminar Cita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#B91C1C',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  value: {
    color: COLORS.text,
    marginBottom: 6,
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
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  statusButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
  },
  statusButtonActive: {
    backgroundColor: COLORS.primary,
  },
  statusButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  statusButtonTextActive: {
    color: COLORS.white,
  },
  deleteBtn: {
    marginTop: 8,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  deleteText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});

