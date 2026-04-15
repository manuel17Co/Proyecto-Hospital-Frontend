import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppButton from '../../../src/components/AppButton';
import AppInput from '../../../src/components/AppInput';
import { createAppointment } from '../../../src/services/appointments';
import { getDoctorsCatalog, getFacilitiesCatalog, getPatientsCatalog } from '../../../src/services/catalogs';
import { COLORS } from '../../../src/styles/colors';
import { globalStyles } from '../../../src/styles/globalStyles';
import { CatalogDoctor, CatalogFacility, CatalogPatient } from '../../../src/types/appointments';

export default function CrearCitaScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<CatalogPatient[]>([]);
  const [doctors, setDoctors] = useState<CatalogDoctor[]>([]);
  const [facilities, setFacilities] = useState<CatalogFacility[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [medicoId, setMedicoId] = useState<number | null>(null);
  const [instalacionId, setInstalacionId] = useState<number | null>(null);
  const [fechaHora, setFechaHora] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCatalogs(true);
        const [patientsData, doctorsData, facilitiesData] = await Promise.all([
          getPatientsCatalog(),
          getDoctorsCatalog(),
          getFacilitiesCatalog(),
        ]);
        if (!mounted) return;
        setPatients(patientsData);
        setDoctors(doctorsData);
        setFacilities(facilitiesData);
      } catch {
        Alert.alert('Error', 'No se pudieron cargar los catálogos');
      } finally {
        if (mounted) setLoadingCatalogs(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCreate = async () => {
    if (!pacienteId || !medicoId || !instalacionId || !fechaHora.trim()) {
      Alert.alert('Campos requeridos', 'Selecciona paciente, médico, instalación y fecha/hora');
      return;
    }

    try {
      setSaving(true);
      await createAppointment({
        pacienteId,
        medicoId,
        instalacionId,
        fechaHora: fechaHora.trim(),
        notas: notas.trim(),
      });
      Alert.alert('Éxito', 'Cita creada correctamente');
      router.push('/(tabs)/(citas)');
    } catch {
      Alert.alert('Error', 'No se pudo crear la cita');
    } finally {
      setSaving(false);
    }
  };

  if (loadingCatalogs) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.helperText}>Cargando catálogos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Crear Cita</Text>

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
            <Text style={[styles.optionText, instalacionId === f.id && styles.optionTextSelected]}>
              {f.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <AppInput
        label="Fecha y hora (ISO)"
        value={fechaHora}
        onChangeText={setFechaHora}
        placeholder="2026-04-15T10:00:00Z"
      />
      <AppInput label="Notas" value={notas} onChangeText={setNotas} placeholder="Paciente requiere ayuno" />

      <AppButton title={saving ? 'Guardando...' : 'Guardar Cita'} onPress={handleCreate} />
    </ScrollView>
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

