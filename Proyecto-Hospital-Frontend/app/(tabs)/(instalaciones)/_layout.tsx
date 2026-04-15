import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { COLORS } from '../../../src/styles/colors';

export default function InstalacionesLayout() {
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
          title: 'Instalaciones',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="crear"
        options={{
          title: 'Crear Instalación',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="detalle/[id]"
        options={{
          title: 'Detalle Instalación',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="editar/[id]"
        options={{
          title: 'Editar Instalación',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}