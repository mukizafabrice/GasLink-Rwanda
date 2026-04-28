import React, {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../services/auth.service";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => undefined,
  logout: async () => undefined,
  refreshProfile: async () => undefined,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setUser(null);
          return;
        }

        const profileResponse = await authService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const nextUser = profileResponse.data as User;
          authService.setAuthData(localStorage.getItem("token") || "", nextUser);
          setUser(nextUser);
        }
      } catch (error) {
        authService.clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const login = (nextUser: User) => {
    startTransition(() => setUser(nextUser));
  };

  const logout = async () => {
    await authService.logout();
    startTransition(() => setUser(null));
  };

  const refreshProfile = async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      return;
    }

    const response = await authService.getProfile();
    if (response.success && response.data) {
      const nextUser = response.data as User;
      authService.setAuthData(localStorage.getItem("token") || "", nextUser);
      startTransition(() => setUser(nextUser));
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && authService.isAuthenticated(),
      loading,
      login,
      logout,
      refreshProfile,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
