import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export function useApi() {
  const { getToken } = useAuth();

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return api;
}
