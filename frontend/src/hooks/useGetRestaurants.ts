import { useEffect, useState } from "react";
import { PROXY_URL } from "@/config/config";
import { RestaurantInfoType, WhatsOnMindSectionType } from "@/types/types";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";

interface RestaurantCardIdentifier {
    card: {
        card: {
            id: string;
        };
    };
}

const useGetRestaurants = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [WhatsOnMind, setWhatsOnMind] = useState<[] | WhatsOnMindSectionType[]>([]);
    const [TopChain, setTopChain] = useState<[] | RestaurantInfoType[]>([]);
    const [AllRestaurants, setAllRestaurants] = useState<[] | RestaurantInfoType[]>([]);
    const [FilteredRestaurants, setFilteredRestaurants] = useState<[] | RestaurantInfoType[]>([]);

    const location = useAppSelector((store) => store.location.location);

    const fetchRestaurants = async (lat: number, lng: number) => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(PROXY_URL + `/api/proxy/swiggy/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}`);
            const whatsOnMindSection: WhatsOnMindSectionType[] = data?.data?.cards
                ?.find((obj: RestaurantCardIdentifier) => obj?.card?.card?.id?.includes("mind"))
                ?.card?.card?.gridElements?.infoWithStyle?.info?.map((item: WhatsOnMindSectionType) => ({
                    id: item?.id,
                    imageId: item?.imageId,
                    accessibility: item?.accessibility?.altText
                }));
            setWhatsOnMind(whatsOnMindSection);

            const topChainSection = data?.data?.cards
                ?.find((obj: RestaurantCardIdentifier) => obj?.card?.card?.id?.includes("top_brands"))
                ?.card?.card?.gridElements?.infoWithStyle?.restaurants?.map((item: { info: RestaurantInfoType }) => ({
                    ...item?.info
                }));
            setTopChain(topChainSection);

            const allRestaurantsSection = data?.data?.cards
                ?.find((obj: RestaurantCardIdentifier) => obj?.card?.card?.id?.includes("restaurant_grid_listing"))
                ?.card?.card?.gridElements?.infoWithStyle?.restaurants?.map((item: { info: RestaurantInfoType }) => ({
                    ...item?.info
                }));
            setAllRestaurants(allRestaurantsSection);
            setFilteredRestaurants(allRestaurantsSection);
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
        AllRestaurants,
        FilteredRestaurants,
        setFilteredRestaurants
    };
};

export default useGetRestaurants;
