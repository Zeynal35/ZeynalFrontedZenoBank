import { api, unwrap } from '@/lib/axios';
import type { AuthTokens, LoginPayload, RegisterPayload, User } from '@/types/auth';

export const authService = {
  register: (payload: RegisterPayload) =>
    unwrap(
      api.post('/api/auth/register', {
        userName: payload.fullName,
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      }),
    ),

  login: async (payload: LoginPayload) => {
    const tokens = await unwrap<AuthTokens>(
      api.post('/api/auth/login', {
        userNameOrEmail: payload.email,
        password: payload.password,
      }),
    );

    const previousAuthorization = api.defaults.headers.common.Authorization;
    api.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;

    try {
      const user = await unwrap<User>(api.get('/api/auth/me'));
      return { user, tokens };
    } finally {
      api.defaults.headers.common.Authorization = previousAuthorization;
    }
  },

  refresh: (refreshToken: string) =>
    unwrap<AuthTokens>(api.post('/api/auth/refresh', { refreshToken })),

  logout: (refreshToken?: string) =>
    unwrap(api.post('/api/auth/logout', refreshToken ? { refreshToken } : {})),

  confirmEmail: (token: string) =>
    unwrap(api.post('/api/auth/confirm-email', { token })),

  resendVerificationEmail: (email: string) =>
    unwrap(api.post('/api/auth/resend-verification-email', { email })),

  me: () => unwrap<User>(api.get('/api/auth/me')),

  userMe: () => unwrap<User>(api.get('/api/users/me')),

  assignRole: (userId: string, role: string) =>
    unwrap(api.post('/api/roles/assign', { userId, roleName: role })),
};