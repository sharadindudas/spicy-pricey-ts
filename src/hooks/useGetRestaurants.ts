import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/utils/constants";
import { CardId, TopChainType, WhatsOnMindSectionType } from "@/types/types";

const useGetRestaurants = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [WhatsOnMind, setWhatsOnMind] = useState<
        [] | WhatsOnMindSectionType[]
    >([]);
    const [TopChain, setTopChain] = useState<[] | TopChainType[]>([]);
    const [AllRestaurants, setAllRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    BACKEND_URL +
                        `/api/proxy/swiggy/dapi/restaurants/list/v5?lat=22.56430&lng=88.36930`
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
                        (item: { info: TopChainType }) => ({
                            ...item?.info
                        })
                    );
                setTopChain(topChainSection);

                const allRestaurantsSection = json?.data?.cards?.find(
                    (obj: CardId) =>
                        obj?.card?.card?.id?.includes("restaurant_grid_listing")
                )?.card?.card?.gridElements?.infoWithStyle?.restaurants;
                setAllRestaurants(allRestaurantsSection);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    return {
        isLoading,
        WhatsOnMind,
        TopChain,
        AllRestaurants
    };
};

export default useGetRestaurants;
