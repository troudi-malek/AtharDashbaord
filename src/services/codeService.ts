import axios from "axios";
import { getAuthToken as getTokenFromCookies } from "@/lib/auth";
const API_URL = import.meta.env.VITE_API_URL;

export const GenerateCodes = async (nbCodes: number) => {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      throw new Error("Missing auth token");
    }

    // Extract idMuseum from JWT in cookies
    let idMuseum: string | null = null;
    const parts = token.split('.')
    if (parts.length >= 2) {
      const payload = parts[1];
      const decodedPayload = JSON.parse(atob(payload));
      idMuseum = decodedPayload.mangedMuseum;
    }

    const body = { nbCodes, idMuseum };

    const response = await axios.post(`${API_URL}code/generateCode`, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const GetCodesByMuseum = async () => {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      throw new Error("Missing auth token");
    }

    // Extract idMuseum from JWT in cookies
    let idMuseum: string | null = null;
    const parts = token.split('.')
    if (parts.length >= 2) {
      const payload = parts[1];
      const decodedPayload = JSON.parse(atob(payload));
      idMuseum = decodedPayload.mangedMuseum;
    }

    const response = await axios.post(`${API_URL}code/getCodesByMuseum`, 
      { idMuseum },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
