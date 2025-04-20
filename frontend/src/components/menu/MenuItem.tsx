import toast from "react-hot-toast";
import { RESTAURANT_MENU_IMG } from "@/utils/constants";
import { AddToCart, MenuItemType, RestaurantMenuInfoType } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { useState } from "react";

interface MenuItemProps {
    data: MenuItemType;
    resInfo: RestaurantMenuInfoType;
}

const MenuItem = ({ data, resInfo }: MenuItemProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { name, price, defaultPrice, description, imageId, itemAttribute } = data;
    const { user, guestId } = useAppSelector((store) => store.user);
    const dispatch = useAppDispatch();

    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            const addToCartData: AddToCart = {
                userId: user?._id,
                guestId,
                restaurant: {
                    id: resInfo?.id,
                    lat: Number(resInfo?.latLong?.split(",")[0]),
                    lng: Number(resInfo?.latLong?.split(",")[1]),
                    name: resInfo?.name,
                    city: resInfo?.city,
                    cloudinaryImageId: resInfo?.cloudinaryImageId,
                    areaName: resInfo?.areaName
                },
                cartItem: {
                    id: data?.id,
                    name: data?.name,
                    description: data?.description,
                    imageId: data?.imageId,
                    isVeg: data?.itemAttribute?.vegClassifier === "VEG" ? true : false,
                    price: data?.price ? price / 100 : defaultPrice / 100,
                    quantity: 1
                }
            };
            const response = await dispatch(addToCart(addToCartData)).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (err: unknown) {
            toast.error(err as string);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="item flex items-start justify-between pb-8">
            <div className="md:w-auto w-3/5">
                {itemAttribute?.vegClassifier === "VEG" ? (
                    <img
                        src="/assets/veg.png"
                        alt="veg"
                    />
                ) : (
                    <img
                        src="/assets/nonveg.png"
                        alt="non-veg"></img>
                )}
                <h4 className="text-base font-semibold">{name}</h4>
                <span className="rupee text-sm font-medium">{price ? <>{price / 100}</> : <>{defaultPrice / 100}</>}</span>
                {description && <p className="mt-3 tracking-tight text-gray-500 text-sm md:w-3/4">{description}</p>}
            </div>
            <div className="relative w-[118px] h-24">
                {imageId && (
                    <div className="cursor-pointer w-[118px] h-24 rounded-md">
                        <img
                            src={RESTAURANT_MENU_IMG + imageId}
                            alt="menu-img"
                            className="rounded-md w-full h-full object-cover"
                        />
                    </div>
                )}
                <button
                    onClick={handleAddToCart}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-[1] w-24 h-9 shadow-sm shadow-[#60b246] bg-white text-center inline-block rounded text-[#60b246] text-sm font-bold uppercase cursor-pointer mx-auto">
                    {isLoading ? "Adding..." : "Add"}
                </button>
            </div>
        </div>
    );
};

export default MenuItem;
