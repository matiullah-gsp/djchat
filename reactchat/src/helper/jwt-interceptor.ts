import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { BASE_URL } from "../config";

export const createAuthFailedEvent = () => {
  const event = new CustomEvent("auth-failed");
  window.dispatchEvent(event);
  return event;
};

const useAxiosWithInterceptor = (): AxiosInstance => {
  const urlOptions: AxiosRequestConfig = {
    baseURL: BASE_URL,
    withCredentials: true,
  };

  const jwtAxios = axios.create(urlOptions);

  jwtAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (
        originalRequest &&
        !originalRequest._retry &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        originalRequest._retry = true;

        try {
          await axios.post(
            `${BASE_URL}/token/refresh/`,
            {},
            { withCredentials: true }
          );
          return jwtAxios(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);

          localStorage.setItem("isLoggedIn", "false");

          createAuthFailedEvent();

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return jwtAxios;
};

export { useAxiosWithInterceptor };
