import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const Login = async (email: string, password: string) => {
    try {
        console.log(`${API_URL}admin/login`, email, password)
        const response = await axios.post(`${API_URL}admin/login`, { email, password }, { withCredentials: true });
        const token = response.data.data;

        // Split the JWT
        const parts = token.split('.');

        // The payload is the second part
        const payload = parts[1];

        // Decode base64
        const decodedPayload = JSON.parse(atob(payload));

        console.log('Decoded JWT payload:', decodedPayload);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
