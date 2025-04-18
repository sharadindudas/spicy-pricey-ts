import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useState } from "react";
import CartContents from "./CartContents";

const CartSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const { user, guestId } = useAppSelector((store) => store.user);
    const { cart } = useAppSelector((store) => store.cart);
    const cartItemsCount: number = cart?.cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            setIsSidebarOpen(false);
            navigate("/login?redirect=checkout");
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
                    {cart && cart?.cartItems?.length > 0 ? (
                        <CartContents
                            cart={cart}
                            guestId={guestId}
                            userId={user?._id}
                        />
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
