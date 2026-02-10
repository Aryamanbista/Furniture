import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from token
    const token = localStorage.getItem("furnihome_token");
    if (token) {
      authAPI
        .getMe()
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem("furnihome_token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem("furnihome_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register(name, email, password);
    localStorage.setItem("furnihome_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("furnihome_token");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
