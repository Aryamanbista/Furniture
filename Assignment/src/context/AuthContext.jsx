import { createContext, useContext, useState, useEffect } from "react";

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
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem("furnihome_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in production, this would call an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // ADMIN LOGIN
        if (email === "admin@furnihome.com" && password === "admin123") {
          const adminUser = {
            id: "admin-001",
            email: "admin@furnihome.com",
            name: "Administrator",
            role: "admin",
            memberSince: "2023",
          };
          setUser(adminUser);
          localStorage.setItem("furnihome_user", JSON.stringify(adminUser));
          resolve(adminUser);
          return;
        }

        // Check for registered users
        const users = JSON.parse(
          localStorage.getItem("furnihome_users") || "[]",
        );
        const existingUser = users.find((u) => u.email === email);

        if (existingUser && existingUser.password === password) {
          const userData = {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role || "customer",
            memberSince: existingUser.memberSince,
          };
          setUser(userData);
          localStorage.setItem("furnihome_user", JSON.stringify(userData));
          resolve(userData);
        } else if (email === "demo@furnihome.com" && password === "demo123") {
          // Demo account
          const demoUser = {
            id: 1,
            email: "demo@furnihome.com",
            name: "Jane Doe",
            role: "customer",
            memberSince: "2021",
          };
          setUser(demoUser);
          localStorage.setItem("furnihome_user", JSON.stringify(demoUser));
          resolve(demoUser);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
  };

  const register = async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(
          localStorage.getItem("furnihome_users") || "[]",
        );

        if (users.find((u) => u.email === email)) {
          reject(new Error("Email already registered"));
          return;
        }

        const newUser = {
          id: Date.now(),
          name,
          email,
          password,
          role: "customer",
          memberSince: new Date().getFullYear().toString(),
        };

        users.push(newUser);
        localStorage.setItem("furnihome_users", JSON.stringify(users));

        const userData = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          memberSince: newUser.memberSince,
        };

        setUser(userData);
        localStorage.setItem("furnihome_user", JSON.stringify(userData));
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("furnihome_user");
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
