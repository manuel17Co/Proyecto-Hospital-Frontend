import { Poppins_400Regular, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Drawer } from "expo-router/drawer";
import { COLORS } from "../src/styles/colors";

export default function Layout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!loaded) return null;

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontFamily: "Poppins_700Bold",
        },
        drawerActiveTintColor: COLORS.primary,
        drawerLabelStyle: {
          fontFamily: "Poppins_400Regular",
        },
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Inicio" }} />
    </Drawer>
  );
}