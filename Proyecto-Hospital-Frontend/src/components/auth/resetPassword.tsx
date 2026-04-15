import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AppButton from '../AppButton';
import { resetPassword } from '@/src/services/auth';
import { COLORS } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';

export default function ResetPasswordComponent() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await resetPassword(token, password);
      
      Alert.alert("¡Éxito!", "Tu contraseña ha sido actualizada.", [
        { text: "Ir al Login", onPress: () => router.replace("/(auth)/login") }
      ]);
    } catch (e) {
      setError('El token ha expirado. Intenta el proceso de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={globalStyles.title}>Nueva Contraseña</Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>Nueva Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry
            />

            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="********"
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {submitting ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
            ) : (
              <AppButton title="Cambiar Contraseña" onPress={handleSubmit} />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  form: { gap: 8 },
  label: { color: COLORS.text, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 12, backgroundColor: COLORS.white },
  error: { color: '#B91C1C', marginTop: 4 },
});