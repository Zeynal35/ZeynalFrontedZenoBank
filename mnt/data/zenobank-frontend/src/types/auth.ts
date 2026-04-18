export type Role = 'SuperAdmin' | 'Admin' | 'Operator' | 'Customer';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  emailConfirmed: boolean;
  roles: Role[];
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
