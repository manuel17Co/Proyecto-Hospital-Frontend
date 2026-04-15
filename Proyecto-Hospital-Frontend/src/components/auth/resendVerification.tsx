import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AppButton from '../AppButton';
import { verifyEmail } from '@/src/services/auth';
import { COLORS } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';

export default function ResendVerificationComponent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!email.trim() || !email.includes('@')) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await verifyEmail(email.trim().toLowerCase());
      
      // Navegamos a la pantalla de validación de OTP pasando el correo
      router.push({
        pathname: "/(auth)/validate-email-otp",
        params: { email: email.trim().toLowerCase() }
      });
    } catch (e) {
      setError('No se pudo enviar el código. Verifica tu conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={globalStyles.title}>Verificar Cuenta</Text>
          <Text style={styles.subtitle}>
            Introduce tu correo para recibir un nuevo código de activación.
          </Text>
          
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
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  subtitle: { color: COLORS.text, textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  form: { gap: 10 },
  label: { color: COLORS.text, fontWeight: '600' },
  input: { 
    borderWidth: 1, 
    borderColor: '#CBD5E1', 
    borderRadius: 10, 
    padding: 12, 
    backgroundColor: COLORS.white,
    color: COLORS.text 
  },
  error: { color: '#B91C1C', marginTop: 4, textAlign: 'center' },
});