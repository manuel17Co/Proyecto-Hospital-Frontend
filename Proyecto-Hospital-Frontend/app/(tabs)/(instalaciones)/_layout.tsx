import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function InstalacionesLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#E6EAF0',
        drawerActiveTintColor: '#051937',
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
    >

      <Drawer.Screen
        name="instalacionesComponent"
        options={{
          drawerLabel: 'Instalaciones',
          drawerIcon: ({ color }) => (
            <Ionicons name="business-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="agregarInstalacion"
        options={{ drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="editarInstalacion"
        options={{ drawerItemStyle: { display: 'none' } }}
      />

    </Drawer>
  );
}