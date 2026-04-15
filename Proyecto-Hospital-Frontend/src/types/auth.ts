export type SignupRequest = {
  name: string;
  surname: string;
  email: string;
  password: string;
};

export type ValidateEmailOtpRequest = {
  email: string;
  otp: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type MeResponse = {
  id: string;
  name: string;
  surname: string;
  email: string;
  verified: boolean;
};

export type AuthTokens = LoginResponse;
