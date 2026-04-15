import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { AuthApi } from "@/src/api/auth";
import { useAuth } from "@/src/context/auth-context";

const SignupComponent = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nameTouched, setNameTouched] = useState(false);
    const [surnameTouched, setSurnameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signupError, setSignupError] = useState<string | null>(null);

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
    const passwordError = !trimmedPassword
        ? "La contraseña es obligatoria."
        : trimmedPassword.length < 8
          ? "La contraseña debe tener al menos 8 caracteres."
          : null;

    const hasValidationErrors = Boolean(
        nameError || surnameError || emailError || passwordError,
    );

    const router = useRouter();
    const auth = useAuth();

    const handleSignup = async () => {
        setNameTouched(true);
        setSurnameTouched(true);
        setEmailTouched(true);
        setPasswordTouched(true);

        if (hasValidationErrors) {
            setSignupError(null);
            return;
        }

        setIsSubmitting(true);
        setSignupError(null);

        const response = await AuthApi.signup({
            name: trimmedName,
            surname: trimmedSurname,
            email: trimmedEmail,
            password: trimmedPassword,
        }).catch((_err) => {
            return null;
        });

        if (!response) {
            setSignupError("No se pudo crear la cuenta. Inténtalo nuevamente.");
            setIsSubmitting(false);
            return;
        }

        await auth.login(response.accessToken, response.refreshToken);
        setIsSubmitting(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Crear cuenta</Text>
                <Text style={styles.subtitle}>Regístrate para reservar canchas</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={(value) => {
                            setName(value);
                            if (!nameTouched) {
                                setNameTouched(true);
                            }
                            if (signupError) {
                                setSignupError(null);
                            }
                        }}
                        placeholder="Tu nombre"
                        placeholderTextColor="#94a3b8"
                    />
                    {nameTouched && nameError && (
                        <Text style={styles.errorText}>{nameError}</Text>
                    )}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Apellido</Text>
                    <TextInput
                        style={styles.input}
                        value={surname}
                        onChangeText={(value) => {
                            setSurname(value);
                            if (!surnameTouched) {
                                setSurnameTouched(true);
                            }
                            if (signupError) {
                                setSignupError(null);
                            }
                        }}
                        placeholder="Tu apellido"
                        placeholderTextColor="#94a3b8"
                    />
                    {surnameTouched && surnameError && (
                        <Text style={styles.errorText}>{surnameError}</Text>
                    )}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={(value) => {
                            setEmail(value);
                            if (!emailTouched) {
                                setEmailTouched(true);
                            }
                            if (signupError) {
                                setSignupError(null);
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

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={(value) => {
                            setPassword(value);
                            if (!passwordTouched) {
                                setPasswordTouched(true);
                            }
                            if (signupError) {
                                setSignupError(null);
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

                {signupError && <Text style={styles.errorText}>{signupError}</Text>}

                <Pressable
                    style={styles.primaryButton}
                    disabled={hasValidationErrors || isSubmitting}
                    onPress={handleSignup}
                >
                    <Text style={styles.primaryButtonText}>
                        {isSubmitting ? "Creando..." : "Crear cuenta"}
                    </Text>
                </Pressable>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
                    <Pressable onPress={() => {
                        router.back();
                    }} >
                        <Text style={styles.footerLink}>Inicia sesión</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        gap: 14,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0f172a",
    },
    subtitle: {
        fontSize: 14,
        color: "#475569",
    },
    formGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#334155",
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
    primaryButton: {
        marginTop: 8,
        backgroundColor: "#0f172a",
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 12,
    },
    primaryButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
    errorText: {
        color: "#b91c1c",
        fontSize: 14,
        fontWeight: "600",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    footerText: {
        color: "#475569",
    },
    footerLink: {
        color: "#1d4ed8",
        fontWeight: "700",
    },
});

export default SignupComponent;