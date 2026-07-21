import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null);

  const login = async (inputs) => {
    setIsLoading(true);
    setError(null); 

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/login",
        inputs,
        { withCredentials: true }
      );
      setCurrentUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      setError(error); 
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
  }, []);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
