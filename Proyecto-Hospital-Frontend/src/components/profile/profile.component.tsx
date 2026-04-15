import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthApi } from "@/src/api/auth";
import { useAuth } from "@/src/context/auth-context";
import { GetUserDto } from "@/src/dto/get-user.dto";

const ProfileComponent = () => {
    const [user, setUser] = useState<GetUserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nameTouched, setNameTouched] = useState(false);
    const [surnameTouched, setSurnameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const trimmedName = name.trim();
    const trimmedSurname = surname.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const nameError = !trimmedName
        ? "El nombre es obligatorio."
        : trimmedName.length < 2
          ? "El nombre debe tener al menos 2 caracteres."
          : null;
    const surnameError = !trimmedSurname
        ? "El apellido es obligatorio."
        : trimmedSurname.length < 2
          ? "El apellido debe tener al menos 2 caracteres."
          : null;
    const emailError = !trimmedEmail
        ? "El correo es obligatorio."
        : !/^\S+@\S+\.\S+$/.test(trimmedEmail)
          ? "Ingresa un correo válido."
          : null;
    const passwordError = trimmedPassword && trimmedPassword.length < 8
        ? "La contraseña debe tener al menos 8 caracteres."
        : null;
    const hasValidationErrors = Boolean(
        nameError || surnameError || emailError || passwordError,
    );
    const isSaveDisabled =
        isSaving || hasValidationErrors;

    const auth = useAuth();

    const loadProfile = useCallback(async () => {
        setIsLoading(true);
        setHasError(false);

        const response = await AuthApi.me().catch((_err) => {
            return null;
        });

        if (!response) {
            setHasError(true);
            setUser(null);
            setIsLoading(false);
            return;
        }

        setUser(response);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleStartEdit = () => {
        if (!user) {
            return;
        }

        setName(user.name);
        setSurname(user.surname);
        setEmail(user.email);
        setPassword("");
        setNameTouched(false);
        setSurnameTouched(false);
        setEmailTouched(false);
        setPasswordTouched(false);
        setSaveError(null);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSaveError(null);
        setPassword("");
        setNameTouched(false);
        setSurnameTouched(false);
        setEmailTouched(false);
        setPasswordTouched(false);
    };

    const handleSaveProfile = async () => {
        if (!user) {
            return;
        }

        setNameTouched(true);
        setSurnameTouched(true);
        setEmailTouched(true);
        setPasswordTouched(true);

        if (hasValidationErrors) {
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        const payload = {
            name: trimmedName,
            surname: trimmedSurname,
            email: trimmedEmail,
            ...(password.trim() ? { password: password.trim() } : {}),
        };

        const response = await AuthApi.updateMe(payload).catch((_err) => {
            return null;
        });

        if (!response) {
            setSaveError("No se pudo actualizar el perfil.");
            setIsSaving(false);
            return;
        }

        setUser(response);
        setIsEditing(false);
        setPassword("");
        setIsSaving(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Mi perfil</Text>
                <Text style={styles.subtitle}>Información de tu cuenta</Text>

                {isLoading && (
                    <View style={styles.stateContainer}>
                        <ActivityIndicator size="large" color="#0f172a" />
                        <Text style={styles.stateText}>Cargando perfil...</Text>
                    </View>
                )}

                {!isLoading && hasError && (
                    <View style={styles.stateContainer}>
                        <Text style={styles.stateTitle}>No se pudo cargar tu perfil</Text>
                        <Pressable style={styles.primaryButton} onPress={loadProfile}>
                            <Text style={styles.primaryButtonText}>Reintentar</Text>
                        </Pressable>
                    </View>
                )}

                {!isLoading && !hasError && user && (
                    <View style={styles.card}>
                        {!isEditing && (
                            <>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Nombre</Text>
                                    <Text style={styles.value}>{user.name}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Apellido</Text>
                                    <Text style={styles.value}>{user.surname}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Email</Text>
                                    <Text style={styles.value}>{user.email}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Verificado</Text>
                                    <Text style={styles.value}>{user.verified ? "Sí" : "No"}</Text>
                                </View>

                                <Pressable style={styles.primaryButton} onPress={handleStartEdit}>
                                    <Text style={styles.primaryButtonText}>Editar</Text>
                                </Pressable>
                            </>
                        )}

                        {isEditing && (
                            <>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Nombre</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={name}
                                        onChangeText={(value) => {
                                            setName(value);
                                            if (!nameTouched) {
                                                setNameTouched(true);
                                            }
                                            if (saveError) {
                                                setSaveError(null);
                                            }
                                        }}
                                        placeholder="Nombre"
                                        placeholderTextColor="#94a3b8"
                                    />
                                    {nameTouched && nameError && (
                                        <Text style={styles.errorText}>{nameError}</Text>
                                    )}
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Apellido</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={surname}
                                        onChangeText={(value) => {
                                            setSurname(value);
                                            if (!surnameTouched) {
                                                setSurnameTouched(true);
                                            }
                                            if (saveError) {
                                                setSaveError(null);
                                            }
                                        }}
                                        placeholder="Apellido"
                                        placeholderTextColor="#94a3b8"
                                    />
                                    {surnameTouched && surnameError && (
                                        <Text style={styles.errorText}>{surnameError}</Text>
                                    )}
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Email</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={(value) => {
                                            setEmail(value);
                                            if (!emailTouched) {
                                                setEmailTouched(true);
                                            }
                                            if (saveError) {
                                                setSaveError(null);
                                            }
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholder="correo@ejemplo.com"
                                        placeholderTextColor="#94a3b8"
                                    />
                                    {emailTouched && emailError && (
                                        <Text style={styles.errorText}>{emailError}</Text>
                                    )}
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Nueva contraseña (opcional)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={password}
                                        onChangeText={(value) => {
                                            setPassword(value);
                                            if (!passwordTouched) {
                                                setPasswordTouched(true);
                                            }
                                            if (saveError) {
                                                setSaveError(null);
                                            }
                                        }}
                                        secureTextEntry
                                        placeholder="••••••••"
                                        placeholderTextColor="#94a3b8"
                                    />
                                    {passwordTouched && passwordError && (
                                        <Text style={styles.errorText}>{passwordError}</Text>
                                    )}
                                </View>

                                {saveError && <Text style={styles.errorText}>{saveError}</Text>}

                                <Pressable
                                    style={styles.primaryButton}
                                    onPress={handleSaveProfile}
                                    disabled={isSaveDisabled}
                                >
                                    <Text style={styles.primaryButtonText}>
                                        {isSaving ? "Guardando..." : "Guardar"}
                                    </Text>
                                </Pressable>
                                <Pressable style={styles.secondaryButton} onPress={handleCancelEdit}>
                                    <Text style={styles.secondaryButtonText}>Cancelar</Text>
                                </Pressable>
                            </>
                        )}

                        <Pressable style={styles.logoutButton} onPress={auth.logout}>
                            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0f172a",
    },
    subtitle: {
        fontSize: 15,
        color: "#475569",
    },
    card: {
        marginTop: 8,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    row: {
        gap: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0f172a",
    },
    input: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 11,
        fontSize: 16,
        color: "#0f172a",
        backgroundColor: "#ffffff",
    },
    stateContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    stateTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0f172a",
        textAlign: "center",
    },
    stateText: {
        fontSize: 14,
        color: "#475569",
    },
    primaryButton: {
        backgroundColor: "#0f172a",
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    primaryButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 12,
    },
    secondaryButtonText: {
        color: "#334155",
        fontSize: 15,
        fontWeight: "700",
    },
    errorText: {
        color: "#b91c1c",
        fontSize: 14,
        fontWeight: "600",
    },
    logoutButton: {
        marginTop: 8,
        backgroundColor: "#dc2626",
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 12,
    },
    logoutButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },
});

export default ProfileComponent;
