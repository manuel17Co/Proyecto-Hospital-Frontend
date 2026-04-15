import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../../src/components/AppButton';
import { ApiError } from '../../src/services/ApiClient';
import { validateEmailOtp } from '../../src/services/auth';
import { COLORS } from '../../src/styles/colors';
import { globalStyles } from '../../src/styles/globalStyles';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) return 'OTP inválido.';
    return 'No se pudo validar el correo.';
  }
  return 'Error de conexión. Intenta nuevamente.';
}

export default function ValidarOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const initialEmail = typeof params.email === 'string' ? params.email : '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !otp.trim()) {
      setError('Correo y OTP son obligatorios.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      await validateEmailOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
      setSuccess('Correo validado correctamente. Ahora puedes iniciar sesión.');
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 500);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Validar correo</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>OTP</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          placeholder="848124"
          keyboardType="number-pad"
          maxLength={6}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <AppButton title="Validar OTP" onPress={handleSubmit} />
        )}

        <Link href="/(auth)/login" style={styles.link}>
          Volver al login
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 16,
    gap: 8,
  },
  label: {
    color: COLORS.text,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  error: {
    color: '#B91C1C',
    marginTop: 4,
  },
  success: {
    color: '#166534',
    marginTop: 4,
  },
  link: {
    marginTop: 12,
    color: COLORS.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
