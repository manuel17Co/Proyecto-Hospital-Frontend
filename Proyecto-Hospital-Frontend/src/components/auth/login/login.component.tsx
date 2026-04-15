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

import { AuthApi, LoginErrorReason } from "@/src/api/auth";
import { useAuth } from "@/src/context/auth-context";

const LoginComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [showVerifyEmailButton, setShowVerifyEmailButton] = useState(false);

    const trimmedEmail = email.trim();
    const emailError = !trimmedEmail
        ? "El correo es obligatorio."
        : !/^\S+@\S+\.\S+$/.test(trimmedEmail)
          ? "Ingresa un correo válido."
          : null;
    const passwordError = !password.trim() ? "La contraseña es obligatoria." : null;
    const hasValidationErrors = Boolean(emailError || passwordError);

    const router = useRouter();

    const auth = useAuth();

    const handleLogin = async () => {
        setEmailTouched(true);
        setPasswordTouched(true);

        if (hasValidationErrors) {
            setLoginError(null);
            setShowVerifyEmailButton(false);
            return;
        }

        setIsSubmitting(true);
        setLoginError(null);
        setShowVerifyEmailButton(false);

        const response = await AuthApi.login({ email, password });

        if (response.data) {
            auth.login(response.data.accessToken, response.data.refreshToken);
            setIsSubmitting(false);
            return;
        }

        const error = response.error as LoginErrorReason;

        if (error === "UNVERIFIED") {
            setLoginError("Tu cuenta no está verificada. Valida tu correo para continuar.");
            setShowVerifyEmailButton(true);
            setIsSubmitting(false);
            return;
        }

        setLoginError("Credenciales incorrectas. Verifica tu correo y contraseña.");
        setShowVerifyEmailButton(false);
        setIsSubmitting(false);
    };
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Iniciar sesión</Text>
                <Text style={styles.subtitle}>Accede para gestionar tus reservas</Text>

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
                            if (loginError) {
                                setLoginError(null);
                            }
                            if (showVerifyEmailButton) {
                                setShowVerifyEmailButton(false);
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
                            if (loginError) {
                                setLoginError(null);
                            }
                            if (showVerifyEmailButton) {
                                setShowVerifyEmailButton(false);
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

                <Pressable
                    style={styles.forgotRow}
                    onPress={() => {
                        router.push("/(auth)/forgot-password");
                    }}
                >
                    <Text style={styles.footerLink}>¿Olvidaste tu contraseña?</Text>
                </Pressable>

                {showVerifyEmailButton && (
                    <Pressable
                        style={styles.forgotRow}
                        onPress={() => {
                            router.push("/(auth)/verify-email");
                        }}
                    >
                        <Text style={styles.footerLink}>Validar correo</Text>
                    </Pressable>
                )}

                {loginError && <Text style={styles.errorText}>{loginError}</Text>}

                <Pressable
                    style={styles.primaryButton}
                    onPress={handleLogin}
                    disabled={isSubmitting || hasValidationErrors}
                >
                    <Text style={styles.primaryButtonText}>
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </Text>
                </Pressable>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>¿No tienes cuenta?</Text>
                    <Pressable onPress={() => {
                        router.push("/(auth)/signup");
                    }} >
                        <Text style={styles.footerLink}>Regístrate</Text>
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
    forgotRow: {
        alignItems: "flex-end",
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

export default LoginComponent;