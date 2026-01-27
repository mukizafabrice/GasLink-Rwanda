import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/auth.service";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ["ADMIN", "MERCHANT", "CLIENT"],
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const user = authService.getCurrentUser();

        console.log("ProtectedRoute - Checking auth:", { token, user }); // Debug

        if (!token || !user) {
          console.log("ProtectedRoute - No token or user found"); // Debug
          setIsAuthenticated(false);
          setUserRole(null);
          setIsLoading(false);
          return;
        }

        // Check if token is valid (basic client-side check)
        const isTokenValid = authService.isAuthenticated();

        if (isTokenValid) {
          console.log("ProtectedRoute - Token is valid"); // Debug
          setIsAuthenticated(true);
          setUserRole(user.role);

          // Check role permissions
          if (!allowedRoles.includes(user.role)) {
            console.log("ProtectedRoute - Role not allowed:", user.role); // Debug
          }
        } else {
          console.log("ProtectedRoute - Token invalid or expired"); // Debug
          // Clear invalid token
          authService.clearAuthData();
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("ProtectedRoute - Error checking auth:", error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-orange-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login"); // Debug
    return <Navigate to="/login" replace />;
  }

  // If authenticated but wrong role
  if (userRole && !allowedRoles.includes(userRole)) {
    console.log("ProtectedRoute - Wrong role, redirecting to home"); // Debug
    return <Navigate to="/" replace />;
  }

  // If everything is OK, render children
  console.log("ProtectedRoute - Access granted"); // Debug
  return <>{children}</>;
};

export default ProtectedRoute;
