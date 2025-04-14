import { MenuItemType } from "@/types/types";
import { RESTAURANT_MENU_IMG } from "@/utils/constants";

const MenuItem = ({ data }: { data: MenuItemType }) => {
    const { name, price, defaultPrice, description, imageId, itemAttribute } = data;

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
                <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-[1] w-24 h-9 shadow-sm shadow-[#60b246] bg-white text-center inline-block rounded text-[#60b246] text-sm font-bold uppercase cursor-pointer">
                    Add
                </button>
            </div>
        </div>
    );
};

export default MenuItem;
