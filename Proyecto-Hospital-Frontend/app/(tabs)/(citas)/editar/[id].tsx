import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppButton from '../../../../src/components/AppButton';
import AppInput from '../../../../src/components/AppInput';
import { getAppointmentById, updateAppointment } from '../../../../src/services/appointments';
import { getDoctorsCatalog, getFacilitiesCatalog, getPatientsCatalog } from '../../../../src/services/catalogs';
import { COLORS } from '../../../../src/styles/colors';
import { globalStyles } from '../../../../src/styles/globalStyles';
import { CatalogDoctor, CatalogFacility, CatalogPatient } from '../../../../src/types/appointments';

export default function EditarCitaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const idNumber = useMemo(() => Number(id), [id]);

  const [patients, setPatients] = useState<CatalogPatient[]>([]);
  const [doctors, setDoctors] = useState<CatalogDoctor[]>([]);
  const [facilities, setFacilities] = useState<CatalogFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [medicoId, setMedicoId] = useState<number | null>(null);
  const [instalacionId, setInstalacionId] = useState<number | null>(null);
  const [fechaHora, setFechaHora] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (!id || Number.isNaN(idNumber)) {
      Alert.alert('Error', 'ID de cita inválido');
      router.back();
      return;
    }

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [appointment, patientsData, doctorsData, facilitiesData] = await Promise.all([
          getAppointmentById(idNumber),
          getPatientsCatalog(),
          getDoctorsCatalog(),
          getFacilitiesCatalog(),
        ]);

        if (!mounted) return;
        setPatients(patientsData);
        setDoctors(doctorsData);
        setFacilities(facilitiesData);

        setPacienteId(appointment.paciente.id);
        setMedicoId(appointment.medicoId);
        setInstalacionId(appointment.instalacionId);
        setFechaHora(appointment.fechaHora);
        setNotas(appointment.notas ?? '');
      } catch {
        Alert.alert('Error', 'No se pudo cargar la cita');
        router.back();
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, idNumber, router]);

  const handleSave = async () => {
    if (!pacienteId || !medicoId || !instalacionId || !fechaHora.trim()) {
      Alert.alert('Campos requeridos', 'Selecciona paciente, médico, instalación y fecha/hora');
      return;
    }
    try {
      setSaving(true);
      await updateAppointment(idNumber, {
        pacienteId,
        medicoId,
        instalacionId,
        fechaHora: fechaHora.trim(),
        notas: notas.trim(),
      });
      Alert.alert('Éxito', 'Cita actualizada correctamente');
      router.push(`/(tabs)/(citas)/detalle/${idNumber}`);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la cita');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Editar Cita</Text>

      <Text style={styles.sectionLabel}>Paciente</Text>
      <View style={styles.optionsContainer}>
        {patients.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.option, pacienteId === p.id && styles.optionSelected]}
            onPress={() => setPacienteId(p.id)}
          >
            <Text style={[styles.optionText, pacienteId === p.id && styles.optionTextSelected]}>
              {p.nombre} {p.apellido}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Médico</Text>
      <View style={styles.optionsContainer}>
        {doctors.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.option, medicoId === d.id && styles.optionSelected]}
            onPress={() => setMedicoId(d.id)}
          >
            <Text style={[styles.optionText, medicoId === d.id && styles.optionTextSelected]}>
              {d.nombre} {d.apellido ?? ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Instalación</Text>
      <View style={styles.optionsContainer}>
        {facilities.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.option, instalacionId === f.id && styles.optionSelected]}
            onPress={() => setInstalacionId(f.id)}
          >
            <Text style={[styles.optionText, instalacionId === f.id && styles.optionTextSelected]}>{f.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <AppInput label="Fecha y hora (ISO)" value={fechaHora} onChangeText={setFechaHora} placeholder="2026-04-15T10:00:00Z" />
      <AppInput label="Notas" value={notas} onChangeText={setNotas} placeholder="Notas de la cita" />

      <AppButton title={saving ? 'Guardando...' : 'Guardar Cambios'} onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    marginTop: 14,
    marginBottom: 6,
    fontWeight: '700',
    color: COLORS.text,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  optionSelected: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: COLORS.white,
  },
});

