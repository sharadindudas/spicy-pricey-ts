import { LoginSchemaType } from "@/schemas/authSchema";
import { useAppDispatch } from "@/store/hooks";
import { mergeCart } from "@/store/slices/cartSlice";
import { setUser } from "@/store/slices/userSlice";
import { ApiResponse, User } from "@/types/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { useState } from "react";
import { UseFormReset } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useLogin = (reset: UseFormReset<LoginSchemaType>) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogin = async (data: LoginSchemaType, guestId?: string) => {
        setIsLoading(true);
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post<ApiResponse>("/auth/login", data);
            if (response.data.success) {
                toast.success(response.data.message || "Logged in successfully");
                dispatch(setUser(response.data.data as User));
                reset();
                await dispatch(mergeCart({ guestId }));
                navigate("/");
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
