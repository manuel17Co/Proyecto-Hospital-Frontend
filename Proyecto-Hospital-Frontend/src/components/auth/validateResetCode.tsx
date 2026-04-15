import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AppButton from '../AppButton';
import { validateResetCode } from '@/src/services/auth';
import { COLORS } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';

export default function ValidateResetCodeComponent() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    
    if (!otp.trim() || otp.length < 6) {
      setError('Ingresa el código de 6 dígitos.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await validateResetCode(email || '', otp) as any;
      
      // Manejo flexible de la respuesta (data.token o token directo)
      const token = response.data?.token || response.token;

      if (token) {
        router.push({
          pathname: "/(auth)/reset-password",
          params: { token: token }
        });
      } else {
        throw new Error('Token no encontrado');
      }

    } catch (e) {
      setError('Código inválido o expirado.');
    } finally {
      setSubmitting(false);
    }
  };

  // Función para volver al login de forma segura
  const handleGoToLogin = () => {
    // Usamos replace para limpiar el historial y evitar errores de navegación
    router.replace('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={globalStyles.title}>Verificar Código</Text>
          <Text style={styles.subtitle}>
            Ingresa el código enviado a:{"\n"}
            <Text style={{ fontWeight: '700', color: COLORS.primary }}>{email}</Text>
          </Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>Código OTP</Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.buttonGap}>
              {submitting ? (
                <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
              ) : (
                <AppButton title="Validar Código" onPress={handleSubmit} />
              )}
              
              {/* Cambiado router.back() por redirección explícita */}
              <AppButton title="Volver al Login" onPress={handleGoToLogin} />
            </View>
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
    paddingHorizontal: 20,
  },
  subtitle: {
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 25,
    opacity: 0.8,
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 12,
  },
  label: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 15,
    textAlign: 'center',
    fontSize: 30,
    letterSpacing: 10,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    marginBottom: 5,
  },
  error: {
    color: '#B91C1C',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonGap: {
    marginTop: 10,
    gap: 4,
  }
});