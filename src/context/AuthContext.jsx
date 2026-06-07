import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); //page refresh- a user load hoya porjonto wait korbe

  useEffect(() => {
    // localStorage ba sessionStorage theke user load kora
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // load sesh hole loading false kora
  }, []);

  const login = async (email, password, rememberMe) => {
    const response = await api.post("/login", { email, password });
    const { token, user } = response.data;


    // rememberMe tru hole localStorage (browser bondho korleo thakbe)
    // na hole sessionStorage (tab bondho korle chole jabe)
    if (rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // user persist kora holo
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user)); // session-e user rakha holo
    }

    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // user data o clear kora holo
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user"); // session user o clear
    setUser(null);
  };

  //Forgot Password Function (Email a URL/OTP Sent)
  const forgotPassword = async (email) => {
    try {
      const response = await api.post("/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

  // Reset Password Function ()// token and email will usually come from a URL or OTP page.
  const resetPassword = async (token, email, newPassword) => {
    try {
      const response = await api.post("/reset-password", {
        token,
        email,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

  const authInfo = {
    user,
    loading,
    login,
    logout,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
