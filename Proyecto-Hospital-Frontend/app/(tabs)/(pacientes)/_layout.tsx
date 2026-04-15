import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { COLORS } from "../../../src/styles/colors";

export default function PacientesLayout() {
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
          title: "Pacientes",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="crear"
        options={{
          title: "Crear Paciente",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🔥 OCULTOS PERO CON NOMBRE BONITO */}
      <Drawer.Screen
        name="detalle/[id]"
        options={{
          title: "Detalle Paciente",
          drawerItemStyle: { display: "none" },
          headerRight: () => (
            <Ionicons name="eye-outline" size={22} color="white" />
          ),
        }}
      />

      <Drawer.Screen
        name="editar/[id]"
        options={{
          title: "Editar Paciente",
          drawerItemStyle: { display: "none" },
          headerRight: () => (
            <Ionicons name="create-outline" size={22} color="white" />
          ),
        }}
      />
    </Drawer>
  );
}