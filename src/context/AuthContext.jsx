import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const MOCK_USER = {
  id: "u_001",
  name: "Vicky Kumar",
  email: "vicky.kumar@example.com",
  avatar: "VK",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Mock login — replace with a real API call (e.g. axios.post('/api/auth/login'))
  const login = useCallback(
    async ({ email }) => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setUser({ ...MOCK_USER, email: email || MOCK_USER.email });
      setIsAuthenticated(true);
      navigate("/dashboard");
    },
    [navigate]
  );

  const register = useCallback(
    async ({ name, email }) => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setUser({ ...MOCK_USER, name: name || MOCK_USER.name, email: email || MOCK_USER.email });
      setIsAuthenticated(true);
      navigate("/dashboard");
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
