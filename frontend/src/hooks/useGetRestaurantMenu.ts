import { RestaurantMenuCategoryType, RestaurantMenuInfoType } from "@/types/types";
import { PROXY_URL } from "@/config/config";
import { useEffect, useState } from "react";
import axios from "axios";

interface MenuDataType {
    card: {
        card: {
            "@type": string;
            title: string;
            itemCards: [];
            categories: [];
        };
    };
}

interface RestaurantCardType {
    card: {
        card: {
            "@type": string;
        };
    };
}

const useGetRestaurantMenu = (resId: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [resInfo, setResInfo] = useState<null | RestaurantMenuInfoType>(null);
    const [resMenu, setResMenu] = useState<[] | RestaurantMenuCategoryType[]>([]);

    useEffect(() => {
        const fetchRestaurantMenu = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get(
                    PROXY_URL +
                        `/api/proxy/swiggy/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=22.56430&lng=88.36930&restaurantId=${resId}`
                );
                const restaurantInfo = data?.data?.cards?.find((item: RestaurantCardType) =>
                    item?.card?.card["@type"]?.includes("food.v2.Restaurant")
                )?.card?.card?.info;
                setResInfo(restaurantInfo);

                const menuData = data?.data?.cards
                    ?.find((item: { groupedCard: unknown }) => item?.groupedCard)
                    ?.groupedCard?.cardGroupMap?.REGULAR?.cards?.filter(
                        (item: RestaurantCardType) =>
                            item?.card?.card["@type"]?.includes("ItemCategory") || item?.card?.card["@type"]?.includes("NestedItemCategory")
                    );
                const structuredMenuData = menuData?.map((item: MenuDataType) => {
                    const type = item?.card?.card["@type"];
                    const title = item?.card?.card?.title;
                    const itemCards = item?.card?.card?.itemCards || [];
                    const categories = item?.card?.card?.categories || [];

                    if (type?.includes("NestedItemCategory")) {
                        return {
                            title,
                            type: "nested",
                            categories: categories?.map((subcategory: { title: string; itemCards: [] }) => {
                                return {
                                    title: subcategory?.title,
                                    itemCards: subcategory?.itemCards
                                };
                            })
                        };
                    } else {
                        return {
                            title,
                            type: "item",
                            itemCards
                        };
                    }
                });
                setResMenu(structuredMenuData);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRestaurantMenu();
    }, [resId]);

    return { isLoading, resInfo, resMenu };
};

export default useGetRestaurantMenu;
