import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { authUser, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, [checkAuth]);

  const value = {
    currentUser: authUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};