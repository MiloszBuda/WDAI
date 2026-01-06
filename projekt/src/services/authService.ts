import type { LoginCredentials, AuthResponse } from "../types/Auth";
import users from "../data/users.json";
import type { AuthUser } from "../types/User";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = users.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const { password, ...safeUser } = user;

    return {
      user: safeUser as AuthUser,
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
    };
  },
};
