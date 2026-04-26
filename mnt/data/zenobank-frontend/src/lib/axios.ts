import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth-store';
import type { ApiResponse } from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().tokens?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshingPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const { tokens, clearSession, setSession, user } = useAuthStore.getState();

  if (!tokens?.refreshToken || !user) {
    clearSession();
    return null;
  }

  try {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/api/auth/refresh',
      { refreshToken: tokens.refreshToken },
    );

    const newTokens = response.data.data;

    setSession({
      user,
      tokens: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      },
    });

    return newTokens.accessToken;
  } catch {
    clearSession();
    return null;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      refreshingPromise ??= refreshAccessToken().finally(() => {
        refreshingPromise = null;
      });

      const token = await refreshingPromise;

      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }

    const message =
      error.response?.data?.errors?.[0] ??
      error.response?.data?.message ??
      error.message ??
      'Request failed';

    return Promise.reject(new Error(message));
  },
);

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>) {
  const response = await promise;
  const payload = response.data;

  if (!payload.success) {
    throw new Error(payload.errors?.[0] || payload.message || 'Operation failed');
  }

  return payload.data;
}