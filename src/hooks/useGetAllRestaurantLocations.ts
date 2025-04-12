import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config/config";
import { LocationType } from "@/types/types";
import useDebounce from "./useDebounce";

const useGetAllRestaurantLocations = () => {
    const [searchInput, setSearchInput] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [locations, setLocations] = useState<[] | LocationType[]>([]);
    const debouncedSearchInput = useDebounce(searchInput, 500);

    useEffect(() => {
        if (debouncedSearchInput) {
            setIsSearching(true);
            const fetchRestaurantLocations = async () => {
                try {
                    const response = await fetch(
                        BACKEND_URL +
                            `/api/proxy/swiggy/dapi/misc/place-autocomplete?input=${debouncedSearchInput}`
                    );
                    const json = await response.json();
                    setLocations(
                        json?.data?.map((item: LocationType) => {
                            return {
                                place_id: item?.place_id,
                                structured_formatting: {
                                    main_text:
                                        item?.structured_formatting?.main_text,
                                    secondary_text:
                                        item?.structured_formatting
                                            ?.secondary_text
                                }
                            };
                        })
                    );
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsSearching(false);
                }
            };
            fetchRestaurantLocations();
        } else {
            setLocations([]);
            setIsSearching(false);
        }
    }, [debouncedSearchInput]);

    return {
        searchInput,
        setSearchInput,
        isSearching,
        debouncedSearchInput,
        locations,
        setLocations
    };
};

export default useGetAllRestaurantLocations;
