import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { authUser } = useAuthStore();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5001/api/users/current",
        {
          withCredentials: true,
        }
      );

      if (response.data?.success && response.data?.user) {
        setCurrentUser(response.data.user);
        return response.data.user;
      }
      setCurrentUser(null);
      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, [authUser]);

  const value = {
    currentUser,
    loading,
    getCurrentUser,
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
