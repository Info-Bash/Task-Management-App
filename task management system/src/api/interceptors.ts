import API from "./api";

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
      if (err.response?.status === 401) {
        logout(); // auto logout
      }
      return Promise.reject(err);
    }
  );
};