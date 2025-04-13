import { useParams } from "react-router";
import useGetRestaurantMenu from "@/hooks/useGetRestaurantMenu";
import ShimmerMenu from "@/components/shimmer/ShimmerMenu";
import RestaurantInfo from "@/components/menu/RestaurantInfo";
import RestaurantCategory from "@/components/menu/RestaurantCategory";
import "@/styles/menu.css";

const RestaurantMenu = () => {
    const { resId } = useParams();
    const { isLoading, resInfo, resMenu } = useGetRestaurantMenu(
        resId as string
    );

    if (isLoading || resInfo === null || resMenu?.length === 0)
        return <ShimmerMenu />;

    return (
        <div className="mx-auto my-7 2xl:w-1/2 md:w-4/5 sm:px-7 px-2 min-h-screen">
            <>
                <RestaurantInfo data={resInfo} />
                <hr className="border-1 border-dashed border-b-[#d3d3d3] my-4"></hr>

                {resInfo?.isOpen ? (
                    <RestaurantCategory data={resMenu} />
                ) : (
                    <h2 className="notopen-message font-bold text-sm">
                        Uh-oh! The outlet is not accepting orders at the moment.
                        We&apos;re working to get them back online
                    </h2>
                )}
            </>
        </div>
    );
};

export default RestaurantMenu;
