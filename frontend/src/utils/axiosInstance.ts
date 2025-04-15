import axios from "axios";
import { BACKEND_URL } from "@/config/config";

export const axiosInstance = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
    withCredentials: true
});
