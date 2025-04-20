import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { clearLocation } from "@/store/slices/locationSlice";
import { clearUser } from "@/store/slices/userSlice";
import { ApiResponse } from "@/types/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const useLogout = () => {
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post<ApiResponse>("/auth/logout");
            if (response.data.success) {
                dispatch(clearUser());
                dispatch(clearLocation());
                dispatch(clearCart());
                toast.success(response.data.message || "Logged out successfully");
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        } finally {
            toast.dismiss(toastId);
        }
    };

    return { handleLogout };
};

export default useLogout;
