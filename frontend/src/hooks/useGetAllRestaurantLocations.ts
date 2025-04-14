import { useEffect, useState } from "react";
import { PROXY_URL } from "@/config/config";
import useDebounce from "./useDebounce";
import axios from "axios";

interface LocationType {
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

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
                    const { data } = await axios.get(PROXY_URL + `/api/proxy/swiggy/dapi/misc/place-autocomplete?input=${debouncedSearchInput}`);
                    setLocations(
                        data?.data?.map((item: LocationType) => {
                            return {
                                place_id: item?.place_id,
                                structured_formatting: {
                                    main_text: item?.structured_formatting?.main_text,
                                    secondary_text: item?.structured_formatting?.secondary_text
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
