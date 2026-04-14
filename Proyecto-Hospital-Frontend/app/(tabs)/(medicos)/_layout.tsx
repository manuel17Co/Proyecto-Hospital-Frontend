import { Stack } from 'expo-router';

export default function MedicosLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="medicosComponent" />
    </Stack>
  );
}
