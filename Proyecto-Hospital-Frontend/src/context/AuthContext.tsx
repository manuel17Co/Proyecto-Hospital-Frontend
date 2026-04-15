import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/auth';
import { ApiClient } from '../services/ApiClient';
import { clearTokens, getAccessToken, getStoredTokens, saveTokens } from '../services/tokenStorage';
import { AuthTokens, LoginRequest } from '../types/auth';

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  useEffect(() => {
    ApiClient.setTokenProvider(getAccessToken);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const storedTokens = await getStoredTokens();
        if (mounted) setTokens(storedTokens);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (payload: LoginRequest) => {
    const response = await loginRequest(payload);
    await saveTokens(response);
    setTokens(response);
  };

  const logout = async () => {
    await clearTokens();
    setTokens(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: Boolean(tokens?.accessToken),
      accessToken: tokens?.accessToken ?? null,
      refreshToken: tokens?.refreshToken ?? null,
      login,
      logout,
    }),
    [isLoading, tokens],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
