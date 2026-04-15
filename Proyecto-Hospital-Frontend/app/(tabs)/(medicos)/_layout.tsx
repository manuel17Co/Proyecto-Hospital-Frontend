import { Drawer } from 'expo-router/drawer';

export default function MedicosLayout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="medicosComponent"
        options={{ drawerLabel: 'Lista de Médicos' }}
      />
      <Drawer.Screen
        name="agregarMedico"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      {/* Nueva pantalla oculta */}
      <Drawer.Screen
        name="editarMedico"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer>
  );
}