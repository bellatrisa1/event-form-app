import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", {
        user,
        pathname: location.pathname,
      });
      setUser(user);
      setLoading(false);
      if (user) {
        // Редирект на "/" только если текущий маршрут — публичный
        if (
          location.pathname === "/login" ||
          location.pathname === "/register" ||
          location.pathname === "/forgot-password"
        ) {
          navigate("/", { replace: true });
        }
      } else if (
        location.pathname !== "/login" &&
        location.pathname !== "/register" &&
        location.pathname !== "/forgot-password"
      ) {
        navigate("/login", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
