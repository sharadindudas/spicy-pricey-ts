import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import Loader from "@/components/loader/Loader";
import useGetAllRestaurantLocations from "@/hooks/useGetAllRestaurantLocations";
import useSetRestaurantLocation from "@/hooks/useSetRestaurantLocation";
import { useAppSelector } from "@/store/hooks";

const LocationSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { searchInput, setSearchInput, isSearching, locations, setLocations } = useGetAllRestaurantLocations();
    const { fetchCurrentLocation } = useSetRestaurantLocation();

    const location = useAppSelector((store) => store.location.location);

    const handleLocation = (placeid: string) => {
        fetchCurrentLocation(placeid);
        setIsSidebarOpen(false);
        setSearchInput("");
        setLocations([]);
    };

    return (
        <Sheet
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}>
            <SheetTrigger className="flex items-center gap-1 group cursor-pointer font-semibold">
                <span className="group-hover:text-orange-500 transition-all duration-300 text-sm">{location?.address || "Other"}</span>
                <ChevronDown className="text-orange-500 w-5" />
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-full sm:max-w-lg px-10">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                    <div className="my-10">
                        <Input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search for area, street name..."
                            className="h-12 rounded-sm text-black border-black focus:border-orange-500"
                        />
                        {isSearching ? (
                            <Loader />
                        ) : (
                            locations?.length > 0 && (
                                <ul className="mt-5 divide-y-2 divide-dashed">
                                    {locations?.map((location) => (
                                        <li
                                            onClick={() => handleLocation(location?.place_id)}
                                            key={location?.place_id}
                                            className="cursor-pointer flex gap-3 py-3">
                                            <div className="mt-1">
                                                <MapPin className="w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-base">{location?.structured_formatting?.main_text}</h3>
                                                <h4 className="text-[13px]">{location?.structured_formatting?.secondary_text}</h4>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default LocationSidebar;
