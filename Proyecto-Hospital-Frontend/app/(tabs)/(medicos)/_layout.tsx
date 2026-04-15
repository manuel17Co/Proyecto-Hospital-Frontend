import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { COLORS } from '../../../src/styles/colors';

export default function MedicosLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        drawerActiveTintColor: COLORS.primary,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Médicos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="crear"
        options={{
          title: 'Crear Médico',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="detalle/[id]"
        options={{
          title: 'Detalle Médico',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="editar/[id]"
        options={{
          title: 'Editar Médico',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}