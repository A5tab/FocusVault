import { createContext, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client.js";

const AuthContext = createContext(null);

const readStoredAuth = () => {
  const rawUser = localStorage.getItem("focusvault_user");
  const token = localStorage.getItem("focusvault_token");

  let user = null;
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch {
      localStorage.removeItem("focusvault_user");
      localStorage.removeItem("focusvault_token");
    }
  }

  return {
    user,
    token,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const stored = readStoredAuth();
    setUser(stored.user);
    setToken(stored.token);
    setBootstrapping(false);
  }, []);

  const persistAuth = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("focusvault_user", JSON.stringify(nextUser));
    localStorage.setItem("focusvault_token", nextToken);
  };

  const login = async (credentials) => {
    const { data } = await client.post("/auth/login", credentials);
    persistAuth(data.user, data.token);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await client.post("/auth/signup", payload);
    persistAuth(data.user, data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("focusvault_user");
    localStorage.removeItem("focusvault_token");
  };

  const value = useMemo(
    () => ({ user, token, bootstrapping, login, signup, logout, isAuthenticated: Boolean(token) }),
    [bootstrapping, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
