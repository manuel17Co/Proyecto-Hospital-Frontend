import { Redirect } from "expo-router";
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { COLORS } from '../src/styles/colors';
import { globalStyles } from '../src/styles/globalStyles';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/(citas)" />;
  }

  return <Redirect href="/(auth)/login" />;
}