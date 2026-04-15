import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { ApiClient } from '../../../src/services/ApiClient';
import { globalStyles } from '../../../src/styles/globalStyles';

type Appointment = Record<string, any>;

function getAppointmentTitle(a: Appointment): string {
  return (
    a?.patientName ??
    a?.pacienteNombre ??
    a?.patient?.name ??
    a?.paciente?.nombre ??
    a?.doctorName ??
    a?.medicoNombre ??
    a?.doctor?.name ??
    a?.medico?.nombre ??
    'Cita'
  );
}

function getAppointmentSubtitle(a: Appointment): string {
  const date = a?.date ?? a?.fecha ?? a?.appointmentDate ?? a?.createdAt;
  const reason = a?.reason ?? a?.motivo ?? a?.notes ?? a?.observaciones;
  if (date && reason) return `${String(date)} • ${String(reason)}`;
  if (date) return String(date);
  if (reason) return String(reason);
  return '';
}

export default function Citas() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const emptyText = useMemo(() => {
    if (loading) return '';
    if (error) return error;
    return 'No hay citas para mostrar.';
  }, [loading, error]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiClient.get<unknown>('/appointments', { signal: controller.signal });
        const list = Array.isArray(data) ? (data as Appointment[]) : ((data as any)?.appointments ?? []);
        if (mounted) setAppointments(Array.isArray(list) ? list : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Error consultando citas');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.title}>Citas</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item, index) => String(item?.id ?? item?._id ?? index)}
          ListEmptyComponent={<Text style={globalStyles.mutedText}>{emptyText}</Text>}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <View style={globalStyles.row}>
                <Text style={globalStyles.cardTitle}>{getAppointmentTitle(item)}</Text>
              </View>
              {!!getAppointmentSubtitle(item) && (
                <Text style={globalStyles.mutedText}>{getAppointmentSubtitle(item)}</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
