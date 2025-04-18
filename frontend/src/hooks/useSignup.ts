import { useState } from "react";
import { SignupSchemaType } from "@/schemas/authSchema";
import { ApiResponse } from "@/types/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { UseFormReset } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useSignup = (reset: UseFormReset<SignupSchemaType>) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (data: SignupSchemaType) => {
        setIsLoading(true);
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post<ApiResponse>("/auth/signup", data);
            if (response.data.success) {
                toast.success(response.data.message || "Registered successfully");
                reset();
                navigate("/login");
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

    return { isLoading, handleSignup };
};

export default useSignup;
