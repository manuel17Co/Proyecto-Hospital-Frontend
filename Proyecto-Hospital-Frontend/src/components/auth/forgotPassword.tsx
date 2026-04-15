import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import AppButton from '../AppButton';
import { forgotPassword } from '@/src/services/auth';
import { COLORS } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';

export default function ForgotPasswordComponent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await forgotPassword(email.trim().toLowerCase());
      // Redirigimos pasando el email para el siguiente paso
      router.push({
        pathname: "/(auth)/validate-reset-code",
        params: { email: email.trim().toLowerCase() }
      });
    } catch (e) {
      setError('No se pudo enviar el código. Verifica tu correo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={globalStyles.title}>Recuperar Contraseña</Text>
          <Text style={styles.subtitle}>Enviaremos un código a tu correo para validar tu identidad.</Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {submitting ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
            ) : (
              <AppButton title="Enviar código" onPress={handleSubmit} />
            )}
            
            <AppButton title="Volver" onPress={() => router.back()} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  subtitle: { color: COLORS.text, textAlign: 'center', marginBottom: 20, opacity: 0.7 },
  form: { gap: 8 },
  label: { color: COLORS.text, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 12, backgroundColor: COLORS.white },
  error: { color: '#B91C1C', marginTop: 4 },
});