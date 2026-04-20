import { api, unwrap } from '@/lib/axios';
import type { AuthTokens, LoginPayload, RegisterPayload, User } from '@/types/auth';
 
// Backend UserDto: { id, userName, email, emailConfirmed, roles: string[] }
// Frontend User: { id, fullName, email, emailConfirmed, roles: Role[] }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(raw: any): User {
  return {
    id: String(raw?.id ?? ''),
    fullName: String(raw?.userName ?? raw?.fullName ?? raw?.email ?? ''),
    email: String(raw?.email ?? ''),
    emailConfirmed: Boolean(raw?.emailConfirmed ?? false),
    // ✅ roles case-insensitive — backend "roles" və ya "Roles" göndərə bilər
    roles: (raw?.roles ?? raw?.Roles ?? []) as User['roles'],
  };
}
 
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
    // 1. Token al
    const tokens = await unwrap<AuthTokens>(
      api.post('/api/auth/login', {
        userNameOrEmail: payload.email,
        password: payload.password,
      }),
    );
 
    // 2. Token ilə /api/auth/me çağır
    const previousAuth = api.defaults.headers.common.Authorization;
    api.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;
 
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = await unwrap<any>(api.get('/api/auth/me'));
      const user = mapUser(raw);
      return { user, tokens };
    } finally {
      api.defaults.headers.common.Authorization = previousAuth;
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
 
  me: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await unwrap<any>(api.get('/api/auth/me'));
    return mapUser(raw);
  },
 
  userMe: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await unwrap<any>(api.get('/api/users/me'));
    return mapUser(raw);
  },
 
  assignRole: (userId: string, role: string) =>
    unwrap(api.post('/api/roles/assign', { userId, roleName: role })),
};