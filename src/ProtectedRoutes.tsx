import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // adjust to however you currently define this

const getAuthHeaders = () => {
  const cookieToken = document.cookie.match(/(?:^|; )token=([^;]*)/)?.[1];
  const token = localStorage.getItem("token") ?? (cookieToken ? decodeURIComponent(cookieToken) : null);
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

const ProtectedRoutes = () => {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    axios
      .get(`${API_URL}admin/me`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      })
      .then(() => setStatus("authenticated"))
      .catch(() => setStatus("unauthenticated"));
  }, []);

  if (status === "loading") return <div>Loading...</div>;
  return status === "authenticated" ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;