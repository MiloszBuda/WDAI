import type { AuthUser } from "./User";

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
