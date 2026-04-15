import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AppButton from '../AppButton';
import { validateEmailOtp, verifyEmail } from '@/src/services/auth';
import { COLORS } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';

export default function ValidateEmailOtpComponent() {
  const router = useRouter();
  // Recuperamos el email que pasamos desde ResendVerification o Registro
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    
    if (otp.length < 6) {
      setError('Ingresa el código de 6 dígitos.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Llamamos al servicio con el payload que espera el back
      await validateEmailOtp({ 
        email: email || '', 
        otp: otp.trim() 
      });
      
      Alert.alert(
        "¡Cuenta activada!", 
        "Tu correo ha sido verificado con éxito. Ya puedes iniciar sesión.", 
        [{ text: "Ir al Login", onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (e) {
      setError('Código inválido o expirado.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError(null);
      await verifyEmail(email || '');
      Alert.alert("Código enviado", "Revisa tu bandeja de entrada.");
    } catch (e) {
      Alert.alert("Error", "No se pudo reenviar el código.");
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={globalStyles.title}>Verificar correo</Text>
          <Text style={styles.subtitle}>
            Hemos enviado un código a:{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {submitting ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
            ) : (
              <AppButton title="Validar cuenta" onPress={handleSubmit} />
            )}

            <TouchableOpacity 
              onPress={handleResend} 
              disabled={resending || submitting}
              style={styles.resendBtn}
            >
              <Text style={[styles.resendText, resending && { opacity: 0.5 }]}>
                {resending ? "Enviando..." : "¿No recibiste el código? Reenviar"}
              </Text>
            </TouchableOpacity>
            
            <AppButton title="Volver" onPress={() => router.back()} />
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
    paddingHorizontal: 25,
  },
  subtitle: {
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.8,
  },
  emailText: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 15,
    textAlign: 'center',
    fontSize: 32,
    letterSpacing: 8,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    marginBottom: 10,
  },
  error: {
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  resendBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  resendText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
});