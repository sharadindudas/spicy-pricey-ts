import { LoginSchemaType } from "@/schemas/authSchema";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { ApiResponse, User } from "@/types/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { UseFormReset } from "react-hook-form";
import toast from "react-hot-toast";

const useLogin = (reset: UseFormReset<LoginSchemaType>, setIsSidebarOpen: Dispatch<SetStateAction<boolean>>) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleLogin = async (data: LoginSchemaType) => {
        setIsLoading(true);
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post<ApiResponse>("/auth/login", data);
            if (response.data.success) {
                toast.success(response.data.message || "Logged in successfully");
                dispatch(setUser(response.data.data as User));
                reset();
                setIsSidebarOpen(false);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        } finally {
            setIsLoading(false);
            toast.dismiss(toastId);
        }
    };

    return { isLoading, handleLogin };
};

export default useLogin;
