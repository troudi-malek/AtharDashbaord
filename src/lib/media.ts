const API_URL = import.meta.env.VITE_API_URL;

export const getMediaUrl = (value?: string | null) => {
  if (!value) return "/placeholder.png";
  if (/^https?:\/\//i.test(value)) return value;

  const baseUrl = API_URL.endsWith("/") ? API_URL : `${API_URL}/`;
  const path = value.replace(/^\/+/, "");
  return path.startsWith("uploads/") ? `${baseUrl}${path}` : `${baseUrl}uploads/${path}`;
};