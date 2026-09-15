import axios from "axios";
import { getAuthToken as getTokenFromCookies } from "@/lib/auth";
const API_URL = import.meta.env.VITE_API_URL;

function getUserIdFromToken(token: string | null): string | null {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload?.id || payload?._id || null;
  } catch {
    return null;
  }
}

export interface ProfileResponseData {
  role: string;
  assignedMuseums: string[];
  email: string;
  memberSince: string;
  fullName: string;
  phoneNumber: string | null;
  passwordLastUpdated: string;
}

export const GetProfile = async () => {
  try {
    const token = getTokenFromCookies();
    const userId = getUserIdFromToken(token);
    if (!userId) throw new Error("Unable to determine user id from token");

    const response = await axios.get(
      `${API_URL}admin/profile/${userId}`,
      { headers: token ? { 'Authorization': `Bearer ${token}` } : {}, withCredentials: true }
    );
    return response.data as { data: ProfileResponseData };
  } catch (error) {
  }
};
