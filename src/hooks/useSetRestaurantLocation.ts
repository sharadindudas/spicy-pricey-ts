import { BACKEND_URL } from "@/config/config";
import { useAppDispatch } from "@/store/hooks";
import { setLocation } from "@/store/slices/locationSlice";

const useSetRestaurantLocation = () => {
    const dispatch = useAppDispatch();

    const fetchCurrentLocation = async (placeid: string) => {
        try {
            const response = await fetch(
                BACKEND_URL +
                    `/api/proxy/swiggy/dapi/misc/address-recommend?place_id=${placeid}`
            );
            const json = await response.json();
            const locationData = {
                city: json?.data[0]?.address_components[0]?.short_name,
                lat: json?.data[0]?.geometry?.location?.lat,
                lng: json?.data[0]?.geometry?.location?.lng,
                address: json?.data[0]?.formatted_address
            };
            dispatch(setLocation(locationData));
        } catch (err) {
            console.error(err);
        }
    };
    return { fetchCurrentLocation };
};

export default useSetRestaurantLocation;
