import { createContext, useContext, useEffect, useState } from "react";
import { constants } from "../config/constants";
import { sessionChange } from "../services/auth-events.service";
import { SecureStore } from "../services/secure-store.service";

type AuthContextType = {
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadTokens = async () => {
            SecureStore.get<string>(constants.auth.accessToken).then((stored) => {
                setAccessToken(stored)
                setIsLoading(false)
            });
            SecureStore.get<string>(constants.auth.refreshToken).then((stored) => {
                setRefreshToken(stored)
            });
        }
        loadTokens();

        const unsubscribe = sessionChange.subscribe(loadTokens);

        return unsubscribe;
    }, []);

    const login = async (newAccessToken: string, newRefreshToken: string) => {
        await SecureStore.set(constants.auth.accessToken, newAccessToken);
        await SecureStore.set(constants.auth.refreshToken, newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
    }

    const logout = async () => {
        await SecureStore.delete(constants.auth.accessToken);
        await SecureStore.delete(constants.auth.refreshToken);
        setAccessToken(null);
        setRefreshToken(null);
    }

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, isLoading, login, logout }}  >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);