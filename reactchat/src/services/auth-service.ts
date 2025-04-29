import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import axios from "axios";
import { NavigateFunction } from "react-router-dom";
interface User {
  id: string;
  username: string;
}

export function useAuthService(navigate?: NavigateFunction) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const isLoggedInFlag = localStorage.getItem("isLoggedIn");
    return isLoggedInFlag === "true";
  });
  const [currentUser, setCurrentUser] = useState<User | null>();

  useEffect(() => {
    const checkAuthStatus = () => {
      const isLoggedInFlag = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(isLoggedInFlag === "true");
    };

    const getCurrentUser = () => {
      setCurrentUser({
        username: localStorage.getItem("username") || "",
        id: localStorage.getItem("user_id") || "",
      });
    };

    checkAuthStatus();
    getCurrentUser();
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    const handleAuthFailed = () => {
      setIsLoggedIn(false);
      if (navigate) {
        navigate("/login", { replace: true });
      } else {
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-failed", handleAuthFailed);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-failed", handleAuthFailed);
    };
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/token/`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("user_id", response.data.user_id);
      setIsLoggedIn(true);
      const userInfo = await getUserInfo(response.data.user_id);

      return { success: true, data: response.data, userInfo };
    } catch (error) {
      localStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
      console.error("Login failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  };

  const logout = async () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);

    try {
      await axios.post(`${BASE_URL}/logout/`, {}, { withCredentials: true });
      if (navigate) {
        navigate("/login", { replace: true });
      } else {
        window.location.href = "/login";
      }
    } catch (logoutError) {
      return Promise.reject(logoutError);
    }
  };

  const refreshAccessToken = async () => {
    try {
      await axios.post(
        `${BASE_URL}/token/refresh/`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  };

  return { login, logout, isLoggedIn, currentUser, refreshAccessToken };
}

const getUserInfo = async (userId: string) => {
  const response = await axios.get(`${BASE_URL}/accounts/?user_id=${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

export { getUserInfo };
