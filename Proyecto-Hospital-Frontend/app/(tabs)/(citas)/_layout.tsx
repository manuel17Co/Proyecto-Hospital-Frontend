import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { COLORS } from "../../../src/styles/colors";

export default function CitasLayout() {
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
          title: "Citas",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="crear"
        options={{
          title: "Crear Cita",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="detalle/[id]"
        options={{
          title: "Detalle Cita",
          drawerItemStyle: { display: "none" },
          headerRight: () => (
            <Ionicons name="eye-outline" size={22} color="white" />
          ),
        }}
      />

      <Drawer.Screen
        name="editar/[id]"
        options={{
          title: "Editar Cita",
          drawerItemStyle: { display: "none" },
          headerRight: () => (
            <Ionicons name="create-outline" size={22} color="white" />
          ),
        }}
      />
    </Drawer>
  );
}
