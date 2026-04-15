/* eslint-disable react-hooks/exhaustive-deps */
import { AuthProvider, useAuth } from "@/src/context/auth-context";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";


function AuthRedirect() {
  const { accessToken, refreshToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "(auth)"
    if (!accessToken && !inAuthGroup) router.replace("/(auth)/login")
    else if (accessToken && inAuthGroup) router.replace("/(tabs)/(pacientes)")
  },
    [
      accessToken,
      refreshToken,
      isLoading,
      segments
    ]
  );
  return null;
}


export default function RootLayout() {
  const [loaded, error] = useFonts({
    'FiraSansRegular': require("@/assets/fonts/FiraSans/FiraSans-Regular.ttf"),
    'FiraSansMedium': require("@/assets/fonts/FiraSans/FiraSans-Medium.ttf"),
    'FiraSansBold': require("@/assets/fonts/FiraSans/FiraSans-Bold.ttf"),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  if (!loaded || error) {
    return null;
  }
  return (
    <AuthProvider>
      <AuthRedirect />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, headerTintColor: "red" }} />
      </Stack>
    </AuthProvider>
  );
}
