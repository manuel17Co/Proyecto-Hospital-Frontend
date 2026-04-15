import { LoginRequest, LoginResponse, MeResponse, SignupRequest, ValidateEmailOtpRequest } from '../types/auth';
import { ApiClient } from './ApiClient';

export async function signup(payload: SignupRequest): Promise<void> {
  await ApiClient.post<unknown>('/auth/signup', payload);
}

export async function validateEmailOtp(payload: ValidateEmailOtpRequest): Promise<void> {
  await ApiClient.post<unknown>('/auth/validate-email-otp', payload);
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return ApiClient.post<LoginResponse>('/auth/login', payload);
}

export async function getMe(): Promise<MeResponse> {
  return ApiClient.get<MeResponse>('/auth/me');
}
