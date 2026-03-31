import API from "./api";

let isLoggingOut = false;

export const setupInterceptors = (logout: () => void) => {
  // Attach token to every request
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // Handle expired token / unauthorized
  API.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401 && !isLoggingOut) {
        isLoggingOut = true;
        logout(); // auto logout
      }
      return Promise.reject(err);
    }
  );
};