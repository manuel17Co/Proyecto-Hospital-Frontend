import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AppButton from '../../../src/components/AppButton';
import { useAuth } from '../../../src/context/AuthContext';
import { getMe, updateMe, forgotPassword } from '../../../src/services/auth';
import { COLORS } from '../../../src/styles/colors';
import { MeResponse } from '../../../src/types/auth';
import { useRouter } from 'expo-router';

export default function Perfil() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estado del formulario
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const me = await getMe();
      setProfile(me);
      setForm({ name: me.name, surname: me.surname, email: me.email });
    } catch {
      Alert.alert('Error', 'No se pudo cargar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      // Mandamos el patch al back
      const updatedUser = await updateMe({
        name: form.name.trim(),
        surname: form.surname.trim(),
        email: form.email.trim().toLowerCase()
      });

      // Si el email cambió, el back lo habrá puesto como verified: false
      // y nosotros lo sacamos de la sesión.
      if (updatedUser.email.toLowerCase() !== profile.email.toLowerCase()) {
        Alert.alert(
          "Correo actualizado",
          "Por seguridad, al cambiar tu correo debes volver a verificar tu cuenta. Iniciando cierre de sesión...",
          [{ text: "OK", onPress: () => void logout() }]
        );
      } else {
        setProfile(updatedUser);
        setEditing(false);
        Alert.alert("Éxito", "Perfil actualizado correctamente.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!profile) return;
    
    Alert.alert(
      "Confirmar cambio",
      "Se enviará un código a tu correo y se cerrará tu sesión actual por seguridad. ¿Deseas continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, continuar", 
          onPress: async () => {
            try {
              // 1. Enviamos el código
              await forgotPassword(profile.email);
              
              // 2. Guardamos el email para que no se pierda al cerrar sesión
              const userEmail = profile.email;

              // 3. Cerramos sesión (esto limpia los tokens y evita que el router te rebote)
              await logout();

              // 4. Ahora que ya no hay sesión, el router nos permite entrar a (auth)
              router.replace({
                pathname: "/(auth)/validate-reset-code",
                params: { email: userEmail }
              });
            } catch {
              Alert.alert("Error", "No se pudo iniciar el cambio de contraseña.");
            }
          }
        }
      ]
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={40} color={COLORS.primary} />
        </View>

        <View style={styles.card}>
          {[
            { label: 'Nombre', key: 'name' },
            { label: 'Apellido', key: 'surname' },
            { label: 'Correo', key: 'email' }
          ].map((field) => (
            <View key={field.key} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={(form as any)[field.key]}
                  onChangeText={(val) => setForm({ ...form, [field.key]: val })}
                  autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                />
              ) : (
                <View style={styles.readOnlyBox}>
                  <Text style={styles.valueText}>{(form as any)[field.key]}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          {editing ? (
            <>
              <AppButton title={saving ? "Guardando..." : "Guardar cambios"} onPress={handleUpdate} disabled={saving} />
              <TouchableOpacity onPress={() => { setEditing(false); loadProfile(); }}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <AppButton title="Editar Perfil" onPress={() => setEditing(true)} />
              <TouchableOpacity onPress={handlePasswordReset}>
                <Text style={styles.linkText}>Cambiar contraseña</Text>
              </TouchableOpacity>
              <View style={styles.logoutZone}>
                <AppButton title="Cerrar sesión" onPress={() => void logout()} />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingTop: 40, alignItems: 'center', gap: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  card: { width: '100%', backgroundColor: 'white', borderRadius: 16, padding: 20, gap: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase' },
  readOnlyBox: { padding: 12, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1' },
  valueText: { fontSize: 16, color: COLORS.text },
  input: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.primary, fontSize: 16 },
  actions: { width: '100%', gap: 12 },
  linkText: { textAlign: 'center', color: COLORS.secondary, fontWeight: '600', marginTop: 8 },
  cancelText: { textAlign: 'center', color: '#64748B', fontWeight: '600' },
  logoutZone: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 20 }
});