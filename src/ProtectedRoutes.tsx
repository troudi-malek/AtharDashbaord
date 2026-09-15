import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // adjust to however you currently define this

const getTokenFromCookies = () => {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const ProtectedRoutes = () => {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const token = getTokenFromCookies();

    axios
      .get(`${API_URL}admin/me`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .then(() => setStatus("authenticated"))
      .catch(() => setStatus("unauthenticated"));
  }, []);

  if (status === "loading") return <div>Loading...</div>;
  return status === "authenticated" ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;