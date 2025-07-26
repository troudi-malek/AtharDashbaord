import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function getTokenFromCookies() {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const CreateMuseum = async(formData:FormData) =>{
    try{
        const token = getTokenFromCookies();
        const response = await axios.post(`${API_URL}museum/addMuseum`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
          });
          return response.data;
    }catch(error){
        console.error(error);
    }
}

export const GetMuseums = async () => {
    try {
        const token = getTokenFromCookies();
        const response = await axios.get(`${API_URL}museum/getMuseums`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const GetMuseumById = async (id: string) => {
    try {
        const token = getTokenFromCookies();
        const response = await axios.get(`${API_URL}museum/GetMuseumById/${id}`,
            { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const UpdateMuseum = async (id: string, formData: FormData) => {
    try {
        const token = getTokenFromCookies();
        const response = await axios.put(`${API_URL}museum/updateMuseum/${id}`, formData, {
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

export const DeleteMuseum = async (id: string) => {
    try {
        const token = getTokenFromCookies();
        const response = await axios.delete(`${API_URL}museum/deleteMuseum/${id}`,
            { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};