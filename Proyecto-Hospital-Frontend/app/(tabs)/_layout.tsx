import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 13,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="(citas)"
        options={{
          title: 'Citas',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="(instalaciones)"
        options={{
          title: 'Instalaciones',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="business" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="(medicos)"
        options={{
          title: 'Médicos',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="medical-services" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="(pacientes)"
        options={{
          title: 'Pacientes',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="(perfil)"
        options={{
          title: 'Mi Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size ?? 24} />
          ),
        }}
      />
    </Tabs>
  );
}