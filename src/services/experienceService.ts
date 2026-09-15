import axios from "axios";
import { getAuthToken as getTokenFromCookies } from "@/lib/auth";
const API_URL = import.meta.env.VITE_API_URL;

export const CreateExperience = async (formData: FormData, museumId?: string) => {
  try {
    const token = getTokenFromCookies();
    let idMuseum = museumId ?? null;
    if (!idMuseum && token) {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const decodedPayload = JSON.parse(atob(parts[1]));
        idMuseum = decodedPayload.mangedMuseum;
      }
    }
    if (idMuseum && !formData.has("idMuseum")) {
      formData.append("idMuseum", idMuseum);
    }
    const response = await axios.post(`${API_URL}experience/addExperience`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
  }
};

export const GetExperiences = async (museumId?: string) => {
  try {
    const token = getTokenFromCookies();
    let idMuseum = museumId ?? null;
    if (!idMuseum && token) {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const decodedPayload = JSON.parse(atob(parts[1]));
        idMuseum = decodedPayload.mangedMuseum;
      }
    }

    const response = await axios.post(`${API_URL}experience/getAllExperiences`,
      { idMuseum },
      {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    throw error;
  }
};

export const GetExperienceById = async (id: string) => {
  try {
    const token = getTokenFromCookies();
    const response = await axios.get(`${API_URL}experience/getExperienceById/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
  }
};

export const UpdateExperience = async (id: string, formData: FormData) => {
  try {
    const token = getTokenFromCookies();
    const response = await axios.put(`${API_URL}experience/updateExperience/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
  }
};

export const DeleteExperience = async (id: string) => {
  try {
    const token = getTokenFromCookies();
    const response = await axios.delete(`${API_URL}experience/deleteExperience/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
  }
};
