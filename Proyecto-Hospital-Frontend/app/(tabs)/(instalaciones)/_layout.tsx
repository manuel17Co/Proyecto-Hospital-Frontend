import { Stack } from 'expo-router';

export default function InstalacionesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="instalacionesComponent" />
    </Stack>
  );
}
