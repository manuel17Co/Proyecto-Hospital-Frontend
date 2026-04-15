import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={() => <View />}
    >
      <Drawer.Screen name="(tabs)" options={{ title: 'Hospital' }} />
    </Drawer>
  );
}