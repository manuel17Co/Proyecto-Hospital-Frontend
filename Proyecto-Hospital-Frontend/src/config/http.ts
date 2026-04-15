import axios from "axios";
import { LoginResponseDto } from "../dto/login-response.dto";
import { sessionChange } from "../services/auth-events.service";
import { SecureStore } from "../services/secure-store.service";
import { constants } from "./constants";
import { envs } from "./env";

const http = axios.create({
    baseURL: envs.api.baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

const httpRefresh = axios.create({
    baseURL: envs.api.baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use(async (config) => {
    const token = await SecureStore.get(constants.auth.accessToken);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}[] = [];

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return http(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await SecureStore.get(
                    constants.auth.refreshToken,
                );
                const response = await httpRefresh.post<LoginResponseDto>(
                    "/auth/refresh",
                    {
                        refreshToken,
                    },
                );

                if (!response || !response.data) {
                    throw new Error("Invalid refresh response");
                }

                const { accessToken, refreshToken: newRefreshToken } =
                    response.data;

                await SecureStore.set(constants.auth.accessToken, accessToken);
                await SecureStore.set(
                    constants.auth.refreshToken,
                    newRefreshToken,
                );
                sessionChange.notify();
                http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                failedQueue.forEach(({ resolve }) => resolve(accessToken));
                failedQueue = [];

                return http(originalRequest);
            } catch (err) {
                failedQueue.forEach(({ reject }) => reject(err));
                failedQueue = [];
                await SecureStore.delete(constants.auth.accessToken);
                await SecureStore.delete(constants.auth.refreshToken);
                sessionChange.notify();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        } else if (error.response?.status === 401 && originalRequest._retry) {
            console.log("########");
            console.log("rejected");
            console.log("########");
            failedQueue.forEach(({ reject }) => reject());
            failedQueue = [];
            await SecureStore.delete(constants.auth.accessToken);
            await SecureStore.delete(constants.auth.refreshToken);
            sessionChange.notify();
            return Promise.reject(error);
        }

        return Promise.reject(error);
    },
);

httpRefresh.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.delete(constants.auth.accessToken);
            await SecureStore.delete(constants.auth.refreshToken);
            sessionChange.notify();
        }

        return Promise.reject(error);
    },
);

export { http };
