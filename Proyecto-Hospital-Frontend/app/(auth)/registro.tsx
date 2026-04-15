import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../../src/components/AppButton';
import { ApiError } from '../../src/services/ApiClient';
import { signup } from '../../src/services/auth';
import { COLORS } from '../../src/styles/colors';
import { globalStyles } from '../../src/styles/globalStyles';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) return 'El correo ya se encuentra registrado.';
    return 'No se pudo completar el registro.';
  }
  return 'Error de conexión. Intenta nuevamente.';
}

export default function RegistroScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim() || !surname.trim() || !normalizedEmail || !password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError('Ingresa un correo válido.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await signup({
        name: name.trim(),
        surname: surname.trim(),
        email: normalizedEmail,
        password,
      });
      router.replace({ pathname: '/(auth)/validar-otp', params: { email: normalizedEmail } });
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Registro</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Pepito" />

        <Text style={styles.label}>Apellido</Text>
        <TextInput style={styles.input} value={surname} onChangeText={setSurname} placeholder="Pérez" />

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
          placeholder="Admin1234!"
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <AppButton title="Crear cuenta" onPress={handleSubmit} />
        )}
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
});
