import { http } from "../config/http";
import { GetUserDto } from "../dto/get-user.dto";
import { LoginRequestDto } from "../dto/login-request.dto";
import { LoginResponseDto } from "../dto/login-response.dto";
import { ResetPasswordCodeRequestDto } from "../dto/reset-password-code-request.dto";
import { ResetPasswordCodeResponseDto } from "../dto/reset-password-code-response.dto";
import { ResetPasswordRequestDto } from "../dto/reset-password-request.dto";
import { ResetPasswordResponseDto } from "../dto/reset-password-response.dto";
import { SignupRequestDto } from "../dto/signup-request.dto";
import { SignupResponseDto } from "../dto/signup-response.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { ValidatePasswordOtpRequest } from "../dto/validate-password-otp-request.dto";
import { ValidatePasswordOtpResponse } from "../dto/validate-password-otp-response.dto";
import { VerificationEmailRequestDto } from "../dto/verification-email-request.dto";
import { VerificationEmailResponseDto } from "../dto/verification-email-response.dto";
import { VerifyEmailOtpRequest } from "../dto/verify-email-otp-request.dto";
import { VerifyEmailOtpResponse } from "../dto/verify-email-otp-response.dto";

export type LoginErrorReason = "UNVERIFIED" | "INVALID_CREDENTIALS" | "UNKNOWN";

export interface LoginResult {
    data: LoginResponseDto | null;
    error: LoginErrorReason | null;
}

export abstract class AuthApi {
    static login = async (payload: LoginRequestDto): Promise<LoginResult> => {
        try {
            const response = await http.post("/auth/login", payload);

            if (response.status === 200) {
                const data: LoginResponseDto = response.data;
                return {
                    data,
                    error: null,
                };
            }

            return {
                data: null,
                error: "UNKNOWN",
            };
        } catch (err: any) {
            const status: number | undefined = err?.response?.status;
            const message: string = String(
                err?.response?.data?.message ?? err?.message ?? "",
            ).toLowerCase();

            if (status === 403 || message.includes("not verified")) {
                return {
                    data: null,
                    error: "UNVERIFIED",
                };
            }

            if (status === 401) {
                return {
                    data: null,
                    error: "INVALID_CREDENTIALS",
                };
            }

            return {
                data: null,
                error: "UNKNOWN",
            };
        }
    };

    static signup = async (
        payload: SignupRequestDto,
    ): Promise<SignupResponseDto | null> => {
        const response = await http.post("/auth/signup", payload);

        if (response.status === 200) {
            const data: SignupResponseDto = response.data;
            return data;
        }
        return null;
    };

    static me = async (): Promise<GetUserDto | null> => {
        const response = await http.get("/auth/me");

        if (response.status === 200) {
            const data: GetUserDto = response.data;
            return data;
        }
        return null;
    };

    static updateMe = async (
        payload: UpdateUserDto,
    ): Promise<GetUserDto | null> => {
        const response = await http.patch("/auth/me", payload);

        if (response.status === 200) {
            const data: GetUserDto = response.data;
            return data;
        }
        return null;
    };

    static forgotPassword = async (
        payload: ResetPasswordCodeRequestDto,
    ): Promise<ResetPasswordCodeResponseDto | null> => {
        const response = await http
            .post("/auth/forgot-password", payload)
            .catch((_err) => {
                return null;
            });

        if (response && response.status === 200) {
            const data: ResetPasswordCodeResponseDto = response.data;
            return data;
        }
        return null;
    };

    static validateResetCode = async (
        payload: ValidatePasswordOtpRequest,
    ): Promise<ValidatePasswordOtpResponse | null> => {
        const response = await http
            .post("/auth/validate-reset-code", payload)
            .catch((_err) => {
                return null;
            });

        if (response && response.status === 200) {
            const data: ValidatePasswordOtpResponse = response.data;
            return data;
        }
        return null;
    };

    static resetPassword = async (
        payload: ResetPasswordRequestDto,
    ): Promise<ResetPasswordResponseDto | null> => {
        const response = await http
            .post("/auth/reset-password", payload)
            .catch((_err) => {
                return null;
            });

        if (response && response.status === 200) {
            const data: ResetPasswordResponseDto = response.data;
            return data;
        }
        return null;
    };

    static verifyEmail = async (
        payload: VerificationEmailRequestDto,
    ): Promise<VerificationEmailResponseDto | null> => {
        const response = await http
            .post("/auth/verify-email", payload)
            .catch((_err) => {
                return null;
            });

        if (response && response.status === 200) {
            const data: VerificationEmailResponseDto = response.data;
            return data;
        }
        return null;
    };

    static validateEmailOtp = async (
        payload: VerifyEmailOtpRequest,
    ): Promise<VerifyEmailOtpResponse | null> => {
        const response = await http
            .post("/auth/validate-email-otp", payload)
            .catch((_err) => {
                return null;
            });

        if (response && response.status === 200) {
            const data: VerifyEmailOtpResponse = response.data;
            return data;
        }
        return null;
    };
}
