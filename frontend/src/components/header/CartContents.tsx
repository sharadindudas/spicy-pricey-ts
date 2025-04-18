import { ApiResponse, Cart } from "@/types/types";
import { RESTAURANT_MENU_IMG } from "@/utils/constants";
import { truncateString } from "@/utils/truncateString";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { AxiosError } from "axios";

interface CartContentsProps {
    cart: Cart;
    userId: string | undefined;
    guestId: string;
}

const CartContents = ({ cart, userId, guestId }: CartContentsProps) => {
    const dispatch = useAppDispatch();

    const handleDeleteFromCart = async (id: string) => {
        try {
            const response = await axiosInstance.delete<ApiResponse>("/cart/remove", {
                data: {
                    userId,
                    guestId,
                    cartItemId: id
                }
            });
            if (response.data.success) {
                dispatch(addToCart(response.data.data));
                toast.success(response.data.message || "Deleted item from cart");
            }
            console.log(response.data);
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message || "Failed to delete item");
            }
        }
    };

    const handleUpdateItemQuantity = async (id: string, delta: number, quantity: number) => {
        const newQuantity = quantity + delta;
        console.log(newQuantity);

        try {
            const response = await axiosInstance.put<ApiResponse>("/cart/update", { userId, guestId, cartItemId: id, quantity: newQuantity });
            if (response.data.success) {
                dispatch(addToCart(response.data.data));
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message || "Failed to update item");
            }
        }
    };

    return (
        <>
            {cart.cartItems?.map((item) => (
                <div
                    key={item.id}
                    className="flex items-start justify-between py-4">
                    <div className="flex justify-center items-start gap-3 text-sm">
                        {item?.imageId && (
                            <img
                                src={RESTAURANT_MENU_IMG + item?.imageId}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                        )}
                        <div>
                            <h3 className="font-bold">{item?.name}</h3>
                            <h4>{item.description ? truncateString(item?.description, 25) : ""}</h4>
                            <div className="flex items-center mt-2">
                                <Button
                                    onClick={() => handleUpdateItemQuantity(item?.id, -1, item?.quantity)}
                                    variant={"outline"}
                                    className="text-xl font-medium cursor-pointer rounded-none px-3">
                                    -
                                </Button>
                                <span className="text-sm font-medium rounded-none px-4 py-2">{item.quantity}</span>
                                <Button
                                    onClick={() => handleUpdateItemQuantity(item?.id, 1, item?.quantity)}
                                    variant={"outline"}
                                    className="text-xl font-medium cursor-pointer rounded-none px-3">
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-sm">
                        <div>
                            <span className="rupee font-medium"></span>
                            <span className="font-bold">{item?.price}</span>
                        </div>
                        <Trash2
                            onClick={() => handleDeleteFromCart(item?.id)}
                            className="w-4 cursor-pointer text-red-500"
                        />
                    </div>
                </div>
            ))}
        </>
    );
};

export default CartContents;
