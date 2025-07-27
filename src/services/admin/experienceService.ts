import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function getTokenFromCookies() {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const CreateExperience = async (formData: FormData) => {
  try {
    const token = getTokenFromCookies();
    const response = await axios.post(`${API_URL}experience/addExperience`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const GetExperiences = async () => {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      throw new Error("Token ya bro")
    }
    const parts = token.split('.');
    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));
    console.log('Decoded JWT payload:', decodedPayload);

    const response = await axios.post(`${API_URL}experience/getExperiences`,
      { idMuseum: decodedPayload.mangedMuseum },
      {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};


export const GetExperienceById = async (id: string) => {
  try {
    const token = getTokenFromCookies();
    const response = await axios.get(`${API_URL}experience/getExperienceById/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error(error);
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
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const DeleteExperience = async (id: string) => {
  try {
    const token = getTokenFromCookies();
    const response = await axios.delete(`${API_URL}experience/deleteExperience/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
