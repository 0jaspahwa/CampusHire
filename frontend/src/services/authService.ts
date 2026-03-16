import api from "./api";

export const loginUser = async (data: {
    email:string;
    password:string;
    role: string;
}) =>{
    const response = await api.post("api/auth/login", data);
    return response.data;
}