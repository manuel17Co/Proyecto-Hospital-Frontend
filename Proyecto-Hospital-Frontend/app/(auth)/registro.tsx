import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { globalStyles } from '../../src/styles/globalStyles';
import RegistroComponent from '@/src/components/auth/register';

export default function RegistroScreen() {
  const router = useRouter();

  const handleRegistroSuccess = (email: string) => {
    // Pasamos el email como parámetro para que la pantalla de OTP sepa a quién validar
    router.replace({ 
      pathname: '/(auth)/validar-otp', 
      params: { email } 
    });
  };

  return (
    <View style={globalStyles.container}>
      <RegistroComponent onSuccess={handleRegistroSuccess} />
      
    </View>
  );
}