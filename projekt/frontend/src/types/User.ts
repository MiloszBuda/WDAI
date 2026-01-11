export type UserRole = "admin" | "user";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;

  firstName?: string;
  lastName?: string;
}

export type AuthUser = Omit<User, "password">;
