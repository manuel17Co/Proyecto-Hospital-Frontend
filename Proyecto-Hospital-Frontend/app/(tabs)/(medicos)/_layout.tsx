import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function MedicosLayout() {
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
        name="medicosComponent"
        options={{
          drawerLabel: 'Médicos',
          drawerIcon: ({ color }) => (
            <Ionicons name="medical-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="agregarMedico"
        options={{ drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="editarMedico"
        options={{ drawerItemStyle: { display: 'none' } }}
      />

    </Drawer>
  );
}