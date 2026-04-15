import { ApiClient } from './ApiClient';
import { LoginRequest, LoginResponse, SignupRequest, ValidateEmailOtpRequest } from '../types/auth';

export async function signup(payload: SignupRequest): Promise<void> {
  await ApiClient.post<unknown>('/auth/signup', payload);
}

export async function validateEmailOtp(payload: ValidateEmailOtpRequest): Promise<void> {
  await ApiClient.post<unknown>('/auth/validate-email-otp', payload);
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return ApiClient.post<LoginResponse>('/auth/login', payload);
}
