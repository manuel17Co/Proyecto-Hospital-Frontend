import {
  Poppins_400Regular,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Slot } from "expo-router";

import { PatientsProvider } from "../src/context/PatientsContext";

export default function Layout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!loaded) return null;

  return (
    <PatientsProvider>
      <Slot /> 
    </PatientsProvider>
  );
}