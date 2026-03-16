import api from "./api";

export const loginUser = async (data: {
    email:string;
    password:string;
    role: string;
}) =>{
    const response = await api.post("api/auth/login", data);
    return response.data;
}

export const signupUser = async (data: {
    name:string;
    email:string;
    password:string;
    role:string;
}) =>{
    try {
        const response = await api.post("api/auth/register", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}