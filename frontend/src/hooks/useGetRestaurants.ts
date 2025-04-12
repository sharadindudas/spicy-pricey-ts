import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config/config";
import {
    CardId,
    RestaurantInfoType,
    WhatsOnMindSectionType
} from "@/types/types";
import { useAppSelector } from "@/store/hooks";

const useGetRestaurants = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [WhatsOnMind, setWhatsOnMind] = useState<
        [] | WhatsOnMindSectionType[]
    >([]);
    const [TopChain, setTopChain] = useState<[] | RestaurantInfoType[]>([]);
    const [AllRestaurants, setAllRestaurants] = useState<
        [] | RestaurantInfoType[]
    >([]);

    const location = useAppSelector((store) => store.location.location);

    const fetchRestaurants = async (lat: number, lng: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                BACKEND_URL +
                    `/api/proxy/swiggy/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}`
            );
            const json = await response.json();

            const whatsOnMindSection: WhatsOnMindSectionType[] =
                json?.data?.cards
                    ?.find((obj: CardId) =>
                        obj?.card?.card?.id?.includes("mind")
                    )
                    ?.card?.card?.gridElements?.infoWithStyle?.info?.map(
                        (item: WhatsOnMindSectionType) => ({
                            id: item?.id,
                            imageId: item?.imageId,
                            accessibility: item?.accessibility?.altText
                        })
                    );
            setWhatsOnMind(whatsOnMindSection);

            const topChainSection = json?.data?.cards
                ?.find((obj: CardId) =>
                    obj?.card?.card?.id?.includes("top_brands")
                )
                ?.card?.card?.gridElements?.infoWithStyle?.restaurants?.map(
                    (item: { info: RestaurantInfoType }) => ({
                        ...item?.info
                    })
                );
            setTopChain(topChainSection);

            const allRestaurantsSection = json?.data?.cards
                ?.find((obj: CardId) =>
                    obj?.card?.card?.id?.includes("restaurant_grid_listing")
                )
                ?.card?.card?.gridElements?.infoWithStyle?.restaurants?.map(
                    (item: { info: RestaurantInfoType }) => ({
                        ...item?.info
                    })
                );
            setAllRestaurants(allRestaurantsSection);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (location && location.lat && location.lng) {
            fetchRestaurants(location.lat, location.lng);
        } else {
            fetchRestaurants(22.5643, 88.3693);
        }
    }, [location]);

    return {
        isLoading,
        WhatsOnMind,
        TopChain,
        AllRestaurants
    };
};

export default useGetRestaurants;
