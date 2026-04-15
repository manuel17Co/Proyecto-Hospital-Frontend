import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
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

type Step = "request" | "verify" | "done";

const VerifyEmailComponent = () => {
    const [step, setStep] = useState<Step>("request");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [emailTouched, setEmailTouched] = useState(false);
    const [otpTouched, setOtpTouched] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const router = useRouter();

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    const emailError = !trimmedEmail
        ? "El correo es obligatorio."
        : !/^\S+@\S+\.\S+$/.test(trimmedEmail)
          ? "Ingresa un correo válido."
          : null;

    const otpError = !trimmedOtp
        ? "El código es obligatorio."
        : trimmedOtp.length < 4
          ? "El código no es válido."
          : null;

    const canSubmitCurrentStep = useMemo(() => {
        if (isSubmitting) {
            return false;
        }

        if (step === "request") {
            return !emailError;
        }

        if (step === "verify") {
            return !emailError && !otpError;
        }

        return true;
    }, [isSubmitting, step, emailError, otpError]);

    const handleRequestOtp = async () => {
        setEmailTouched(true);

        if (emailError) {
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        const response = await AuthApi.verifyEmail({ email: trimmedEmail });

        if (!response) {
            setServerError("No se pudo enviar el código. Inténtalo nuevamente.");
            setIsSubmitting(false);
            return;
        }

        setStep("verify");
        setIsSubmitting(false);
    };

    const handleValidateOtp = async () => {
        setEmailTouched(true);
        setOtpTouched(true);

        if (emailError || otpError) {
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        const response = await AuthApi.validateEmailOtp({
            email: trimmedEmail,
            otp: trimmedOtp,
        });

        if (!response) {
            setServerError("El código es inválido o expiró.");
            setIsSubmitting(false);
            return;
        }

        setStep("done");
        setIsSubmitting(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Validar correo</Text>
                <Text style={styles.subtitle}>
                    {step === "request" && "Te enviaremos un código a tu correo."}
                    {step === "verify" && "Ingresa el código que recibiste."}
                    {step === "done" && "Tu correo fue validado correctamente."}
                </Text>

                {(step === "request" || step === "verify") && (
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
                                if (serverError) {
                                    setServerError(null);
                                }
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="correo@ejemplo.com"
                            placeholderTextColor="#94a3b8"
                            editable={step === "request"}
                        />
                        {emailTouched && emailError && (
                            <Text style={styles.errorText}>{emailError}</Text>
                        )}
                    </View>
                )}

                {step === "verify" && (
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Código OTP</Text>
                        <TextInput
                            style={styles.input}
                            value={otp}
                            onChangeText={(value) => {
                                setOtp(value);
                                if (!otpTouched) {
                                    setOtpTouched(true);
                                }
                                if (serverError) {
                                    setServerError(null);
                                }
                            }}
                            placeholder="123456"
                            placeholderTextColor="#94a3b8"
                            keyboardType="number-pad"
                        />
                        {otpTouched && otpError && (
                            <Text style={styles.errorText}>{otpError}</Text>
                        )}
                    </View>
                )}

                {serverError && <Text style={styles.errorText}>{serverError}</Text>}

                {step === "request" && (
                    <Pressable
                        style={styles.primaryButton}
                        onPress={handleRequestOtp}
                        disabled={!canSubmitCurrentStep}
                    >
                        <Text style={styles.primaryButtonText}>
                            {isSubmitting ? "Enviando..." : "Enviar código"}
                        </Text>
                    </Pressable>
                )}

                {step === "verify" && (
                    <Pressable
                        style={styles.primaryButton}
                        onPress={handleValidateOtp}
                        disabled={!canSubmitCurrentStep}
                    >
                        <Text style={styles.primaryButtonText}>
                            {isSubmitting ? "Validando..." : "Validar correo"}
                        </Text>
                    </Pressable>
                )}

                <View style={styles.footerRow}>
                    {step === "done" ? (
                        <Pressable
                            onPress={() => {
                                router.replace("/(auth)/login");
                            }}
                        >
                            <Text style={styles.footerLink}>Volver a iniciar sesión</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Text style={styles.footerLink}>Volver</Text>
                        </Pressable>
                    )}
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
    footerLink: {
        color: "#1d4ed8",
        fontWeight: "700",
    },
});

export default VerifyEmailComponent;
