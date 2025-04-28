import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function useAuthService(navigate?: NavigateFunction) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const isLoggedInFlag = localStorage.getItem("isLoggedIn");
    return isLoggedInFlag === "true";
  });

  useEffect(() => {
    const checkAuthStatus = () => {
      const isLoggedInFlag = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(isLoggedInFlag === "true");
    };

    checkAuthStatus();

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
      setIsLoggedIn(true);

      const userInfo = await getUserInfoFromToken(response.data.access);

      return { success: true, data: response.data };
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

  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);

    if (navigate) {
      navigate("/login", { replace: true });
    } else {
      window.location.href = "/login";
    }
  };

  return { login, logout, isLoggedIn };
}

const getUserInfoFromToken = async (accessToken: string) => {
  const decodedToken = jwtDecode(accessToken) as {
    user_id: string;
    username: string;
    email: string;
  };
  return {
    user_id: decodedToken.user_id,
    username: decodedToken.username,
    email: decodedToken.email,
  };
};

const getUserInfo = async (userId: string) => {
  const response = await axios.get(`${BASE_URL}/accounts/?user_id=${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

export { getUserInfo };
