import { PROXY_URL } from "@/config/config";
import { useAppDispatch } from "@/store/hooks";
import { setLocation } from "@/store/slices/locationSlice";
import axios from "axios";

const useSetRestaurantLocation = () => {
    const dispatch = useAppDispatch();

    const fetchCurrentLocation = async (placeid: string) => {
        try {
            const { data } = await axios.get(PROXY_URL + `/api/proxy/swiggy/dapi/misc/address-recommend?place_id=${placeid}`);
            dispatch(
                setLocation({
                    city: data?.data[0]?.address_components?.find((item: { types: string[] }) => item?.types?.includes("city"))?.short_name,
                    lat: data?.data[0]?.geometry?.location?.lat,
                    lng: data?.data[0]?.geometry?.location?.lng,
                    address: data?.data[0]?.formatted_address
                })
            );
        } catch (err) {
            console.error(err);
        }
    };

    return { fetchCurrentLocation };
};

export default useSetRestaurantLocation;
