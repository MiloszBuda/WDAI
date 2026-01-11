import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import axios from "../api/axios";

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  setAuth: React.Dispatch<
    React.SetStateAction<{ user: User | null; accessToken: string | null }>
  >;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const persistLogin = async () => {
      try {
        const response = await axios.get("/auth/refresh", {
          withCredentials: true,
        });

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        const userResponse = await axios.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        setUser(userResponse.data);
      } catch (error) {
        console.log("Nie jesteś zalogowany (brak sesji)");
      } finally {
        setLoading(false);
      }
    };

    persistLogin();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await axios.post(
      "/auth/login",
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    const { accessToken: newToken, user: userData } = res.data;

    setAccessToken(newToken);
    setUser(userData);
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    const res = await axios.post(
      "/auth/register",
      { email, username, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    const { accessToken: newToken, user: userData } = res.data;

    setAccessToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Błąd podczas wylogowywania", error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const setAuth = (data: any) => {
    if (typeof data === "function") {
      const current = { user, accessToken };
      const result = data(current);
      setUser(result.user);
      setAccessToken(result.accessToken);
    } else {
      setUser(data.user);
      setAccessToken(data.accessToken);
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        register,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
