import React, { createContext, useContext, ReactNode } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext<{
  user: any | null;
  isAuthenticated: boolean;
}>({
  user: null,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
