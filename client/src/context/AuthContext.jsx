import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const saveToken = useCallback((newToken, remember) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("token", newToken);
    setToken(newToken);
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/check-token", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Token verification failed");

        const data = await res.json();
        setUserId(data.userId);
        setIsAuthenticated(true);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setToken(null);
        setUserId(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = useCallback(
    async (form) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        saveToken(data.token, form.remember);
        setUserId(data.userId);
        setIsAuthenticated(true);
        navigate("/");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [navigate, saveToken]
  );

  const register = useCallback(
    async (form) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");

        await login({
          email: form.email,
          password: form.password,
          remember: form.remember,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  const contextValue = useMemo(
    () => ({
      token,
      userId,
      isAuthenticated,
      loading,
      error,
      login,
      register,
      logout,
    }),
    [token, userId, isAuthenticated, loading, error, login, register, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
