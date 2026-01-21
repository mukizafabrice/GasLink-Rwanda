import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AuthService, { User, RegisterInput } from "../services/auth.service";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = AuthService.getUser();

      if (storedUser && AuthService.isAuthenticated()) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } catch (error) {
          // Token invalid, clear auth data
          AuthService.clearAuthData();
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await AuthService.login({ email, password });
      AuthService.storeAuthData(response);
      setUser(response.user);
      toast.success("Welcome back! Login successful");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      setLoading(true);
      const response = await AuthService.register(data);
      AuthService.storeAuthData(response);
      setUser(response.user);
      toast.success("Account created successfully!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      AuthService.clearAuthData();
      setUser(null);
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
