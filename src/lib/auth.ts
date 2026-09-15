export const getAuthToken = () => {
  const cookieToken = document.cookie.match(/(?:^|; )token=([^;]*)/)?.[1];
  return localStorage.getItem("token") ?? (cookieToken ? decodeURIComponent(cookieToken) : null);
};