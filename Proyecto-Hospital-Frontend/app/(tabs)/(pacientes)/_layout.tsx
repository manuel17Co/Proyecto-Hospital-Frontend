import { Stack } from 'expo-router';

export default function PacientesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="pacientesComponent" />
    </Stack>
  );
}
