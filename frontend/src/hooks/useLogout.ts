import { useAppDispatch } from "@/store/hooks";
import { removeCart } from "@/store/slices/cartSlice";
import { removeLocation } from "@/store/slices/locationSlice";
import { removeUser } from "@/store/slices/userSlice";
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
                dispatch(removeUser());
                dispatch(removeLocation());
                dispatch(removeCart());
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
