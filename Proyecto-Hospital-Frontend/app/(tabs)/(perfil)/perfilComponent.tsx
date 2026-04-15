import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../../src/components/AppButton';
import { useAuth } from '../../../src/context/AuthContext';
import { getMe } from '../../../src/services/auth';
import { COLORS } from '../../../src/styles/colors';
import { MeResponse } from '../../../src/types/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    backgroundColor: '#F8FAFC',
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: 18,
  },
  avatar: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  valueBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  valueText: {
    color: COLORS.text,
    fontSize: 16,
  },
  stateText: {
    textAlign: 'center',
    color: COLORS.textLight,
  },
  buttonBox: {
    marginTop: 4,
  },
});

export default function Perfil() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const me = await getMe();
        if (mounted) {
          setProfile(me);
        }
      } catch {
        if (mounted) {
          setError('No se pudo cargar tu perfil.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const fields = useMemo(
    () =>
      profile
        ? [
            { label: 'Nombre', value: profile.name },
            { label: 'Apellido', value: profile.surname },
            { label: 'Correo', value: profile.email },
          ]
        : [],
    [profile],
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={38} color={COLORS.primary} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text style={styles.stateText}>{error}</Text>
        ) : (
          <View style={styles.formCard}>
            {fields.map((field) => (
              <View key={field.label} style={styles.fieldGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.valueText}>{field.value}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonBox}>
          <AppButton title="Cerrar sesión" onPress={() => void logout()} />
        </View>
      </View>
    </View>
  );
}
