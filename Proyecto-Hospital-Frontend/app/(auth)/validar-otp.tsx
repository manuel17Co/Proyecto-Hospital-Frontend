import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { globalStyles } from '../../src/styles/globalStyles';
import ValidarOtpComponent from '@/src/components/auth/validarotOtp';
export default function ValidarOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  
  // Recuperamos el email que viene del registro o lo dejamos vacío
  const initialEmail = typeof params.email === 'string' ? params.email : '';

  const handleValidationSuccess = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Validar correo</Text>
      
      <ValidarOtpComponent 
        initialEmail={initialEmail} 
        onSuccess={handleValidationSuccess} 
      />
      
    </View>
  );
}