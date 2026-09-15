import axios from "axios";
import { getAuthToken as getTokenFromCookies } from "@/lib/auth";
const API_URL = import.meta.env.VITE_API_URL;

export const CreateMuseum = async(formData:FormData) =>{
    try{
        const token = getTokenFromCookies();
        const response = await axios.post(`${API_URL}museum/addMuseum`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
                        withCredentials: true,
          });
          return response.data;
    }catch(error){
    }
}

export const GetMuseums = async () => {
    try {
        const token = getTokenFromCookies();
        const response = await axios.get(`${API_URL}museum/getMuseums`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetMuseumById = async (id: string) => {
    try {
        const token = getTokenFromCookies();
        const response = await axios.get(`${API_URL}museum/GetMuseumById/${id}`,
            { headers: token ? { 'Authorization': `Bearer ${token}` } : {}, withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetGlobalMuseumStats = async () => {
    try {
        const token = getTokenFromCookies();
        const response = await axios.get(`${API_URL}museum/stats`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
    }
};

export const GetMuseumIncome = async () => {
    try {
        const token = getTokenFromCookies();
        const response = await axios.get(`${API_URL}museum/income`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
    }
};

export const UpdateMuseum = async (id: string, data: FormData | Record<string, any>) => {
    try {
        const token = getTokenFromCookies();
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const response = await axios.put(`${API_URL}museum/updateMuseum/${id}`, data, {
            headers: {
                ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }),
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteMuseum = async (id: string) => {
    try {
        const token = getTokenFromCookies();
        const response = await axios.delete(`${API_URL}museum/deleteMuseum/${id}`,
            { headers: token ? { 'Authorization': `Bearer ${token}` } : {}, withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};