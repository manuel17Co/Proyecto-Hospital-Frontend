import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AppButton from '../AppButton';
import { ApiError } from '@/src/services/ApiClient';
import { COLORS } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';
import { useAuth } from '@/src/context/AuthContext';
import { verifyEmail } from '@/src/services/auth';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Correo o contraseña inválidos.';
    return 'No se pudo iniciar sesión.';
  }
  return 'Error de conexión. Intenta nuevamente.';
}

export default function LoginComponent({ onLoginSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!email.trim() || !password.trim()) {
      setError('Completa correo y contraseña.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await login({ email: email.trim().toLowerCase(), password });
      onLoginSuccess();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = () => {
    router.push("/(auth)/validate-email-otp");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={globalStyles.title}>Iniciar Sesión</Text>
          
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

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {submitting ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
            ) : (
              <AppButton title="Entrar" onPress={handleSubmit} />
            )}

            <Link href="/(auth)/registro" style={styles.link}>
              ¿No tienes cuenta? Regístrate
            </Link>

            <Link href="/(auth)/resend-verification" style={styles.link}>
              ¿Cuenta no verificada? Valídala aquí
            </Link>

            <Link href="/(auth)/forgot-password" style={styles.link}>
              ¿Olvidaste tu contraseña?
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
    marginTop: 20,
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
    textAlign: 'center'
  },
  link: {
    marginTop: 12,
    color: COLORS.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
});