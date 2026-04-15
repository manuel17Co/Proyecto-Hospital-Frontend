import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Link } from 'expo-router';
import AppButton from '../AppButton';
import { ApiError } from '@/src/services/ApiClient';
import { validateEmailOtp } from '@/src/services/auth';
import { COLORS } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';

interface ValidarOtpComponentProps {
  initialEmail: string;
  onSuccess: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) return 'OTP inválido.';
    return 'No se pudo validar el correo.';
  }
  return 'Error de conexión. Intenta nuevamente.';
}

export default function ValidarOtpComponent({ initialEmail, onSuccess }: ValidarOtpComponentProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    Keyboard.dismiss();
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
      setSuccess('Correo validado correctamente. Redirigiendo...');
      
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
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
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
            ) : (
              <AppButton title="Validar OTP" onPress={handleSubmit} />
            )}

            <Link href="/(auth)/login" style={styles.link}>
              Volver al login
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
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