import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../src/styles/globalStyles';
import LoginComponent from '@/src/components/auth/login';

export default function LoginScreen() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace('/(tabs)/(citas)');
  };

  return (
    <View style={[globalStyles.container, styles.centered]}>
      
      <LoginComponent onLoginSuccess={handleLoginSuccess} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
  },
});