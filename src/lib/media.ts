const API_URL = import.meta.env.VITE_API_URL;

export const getMediaUrl = (value?: string | null) => {
  if (!value) return "/placeholder.png";

  const parsedUrl = /^https?:\/\//i.test(value) ? new URL(value) : null;
  if (parsedUrl && !["localhost", "127.0.0.1"].includes(parsedUrl.hostname)) {
    return parsedUrl.toString();
  }

  const baseUrl = API_URL.endsWith("/") ? API_URL : `${API_URL}/`;
  const path = (parsedUrl ? parsedUrl.pathname : value).replace(/^\/+/, "");
  return path.startsWith("uploads/") ? `${baseUrl}${path}` : `${baseUrl}uploads/${path}`;
};