import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const Login = async (email: string, password: string) => {
    try {
        console.log(`${API_URL}admin/login`, email, password);

        const response = await axios.post(
            `${API_URL}admin/login`,
            { email, password },
            { withCredentials: true }
        );

        const token = response.data.data;
        localStorage.setItem("token", token);
        const parts = token.split(".");
        const payload = parts[1];

        const decodedPayload = JSON.parse(atob(payload));

        console.log("Decoded JWT payload:", decodedPayload);
        console.log("Login response:", response.data);
        console.log("Token saved:", localStorage.getItem("token"));

        return response.data;

    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(`${API_URL}password-reset/request`, { email }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const verifyPasswordResetCode = async (email: string, code: string) => {
    try {
        const response = await axios.post(`${API_URL}password-reset/verify`, { email, code }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
        const response = await axios.post(`${API_URL}password-reset/reset`, { email, code, newPassword }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}