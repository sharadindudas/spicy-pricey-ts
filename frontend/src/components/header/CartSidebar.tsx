import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useState } from "react";
import { RESTAURANT_MENU_IMG } from "@/utils/constants";
import { truncateString } from "@/utils/truncateString";
import { removeCartItem, updateItemQuantity } from "@/store/slices/cartSlice";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const CartSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const { user, guestId } = useAppSelector((store) => store.user);
    const { cart } = useAppSelector((store) => store.cart);
    const cartItemsCount: number = cart?.cartItemsCount || 0;

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleDeleteFromCart = async (cartItemId: string) => {
        try {
            const response = await dispatch(removeCartItem({ userId: user?._id, guestId, cartItemId })).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (err: unknown) {
            toast.error(err as string);
        }
    };

    const handleUpdateItemQuantity = async (cartItemId: string, delta: number, quantity: number) => {
        const newQuantity = quantity + delta;
        try {
            await dispatch(updateItemQuantity({ userId: user?._id, guestId, cartItemId, quantity: newQuantity })).unwrap();
        } catch (err: unknown) {
            toast.error(err as string);
        }
    };

    const handleCheckout = () => {
        if (!user) {
            setIsSidebarOpen(false);
            navigate("/login");
            toast.error("Please Login to continue");
        } else {
            setIsSidebarOpen(false);
            navigate("/checkout");
        }
    };

    return (
        <Sheet
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}>
            <SheetTrigger className="flex items-center gap-2 group orange-hover font-medium cursor-pointer">
                <span className="relative group">
                    {cartItemsCount > 0 ? (
                        <>
                            <svg
                                className="stroke-[#60b246] fill-[#60b246] stroke-2 group-hover:stroke-orange-500 group-hover:fill-orange-500 transition-all duration-300"
                                viewBox="-1 0 37 32"
                                height="20"
                                width="20">
                                <path d="M4.438 0l-2.598 5.11-1.84 26.124h34.909l-1.906-26.124-2.597-5.11z"></path>
                            </svg>
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-white">
                                {cartItemsCount}
                            </span>
                        </>
                    ) : (
                        <>
                            <svg
                                className="stroke-gray-500 fill-white stroke-2 group-hover:stroke-orange-500 transition-all duration-300"
                                viewBox="-1 0 37 32"
                                height="20"
                                width="20">
                                <path d="M4.438 0l-2.598 5.11-1.84 26.124h34.909l-1.906-26.124-2.597-5.11z"></path>
                            </svg>
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold">{cartItemsCount}</span>
                        </>
                    )}
                </span>
                Cart
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl px-3">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <h2 className="font-bold text-2xl px-3">Your Cart</h2>
                <div className="overflow-y-scroll px-3 divide-y h-full no-scrollbar">
                    {cart && cart.cartItems?.length > 0 ? (
                        cart.cartItems?.map((item) => (
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
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
                {cartItemsCount > 0 && (
                    <div className="mb-3">
                        <Button
                            onClick={handleCheckout}
                            className="cursor-pointer w-full h-11">
                            Checkout
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartSidebar;
