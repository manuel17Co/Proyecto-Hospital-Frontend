import { Drawer } from 'expo-router/drawer';

export default function InstalacionesLayout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="instalacionesComponent"
        options={{ drawerLabel: 'Lista de Instalaciones' }}
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