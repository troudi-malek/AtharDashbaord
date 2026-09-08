import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const Login = async (email: string, password: string) => {
    try {
        console.log(`${API_URL}admin/login`, email, password);

        const response = await axios.post(
            `${API_URL}admin/login`,
            { email, password },
            { withCredentials: true }
        );

        const token = Cookies.get("token");
        console.log("Login response:", response.data);
        console.log("Token from cookie:", token);

        if (!token) {
            throw new Error("Login successful, but token cookie was not found.");
        }

        const parts = token.split(".");
        const payload = parts[1];

        const decodedPayload = JSON.parse(atob(payload));

        console.log("Decoded JWT payload:", decodedPayload);

        return response.data;

    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(
            `${API_URL}password-reset/request`,
            { email },
            { withCredentials: true }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const verifyPasswordResetCode = async (
    email: string,
    code: string
) => {
    try {
        const response = await axios.post(
            `${API_URL}password-reset/verify`,
            { email, code },
            { withCredentials: true }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
) => {
    try {
        const response = await axios.post(
            `${API_URL}password-reset/reset`,
            { email, code, newPassword },
            { withCredentials: true }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};