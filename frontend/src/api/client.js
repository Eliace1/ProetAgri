import axios from "axios";
import { getToken } from "../lib/auth";

const API_URL = import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
  withCredentials: false,
});

// Attache automatiquement le token si disponible
api.interceptors.request.use((config) => {
  const t = getToken?.();
  if (t) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

// Normalise les erreurs pour l'UI
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
      (typeof data === "object" && (data?.message || (data?.errors && Object.values(data.errors).flat().join("\n")))) ||
      (typeof data === "string" ? data : null) ||
      error?.message ||
      "Erreur réseau";
    return Promise.reject({ status, data, message, raw: error });
  }
);

export default api;
