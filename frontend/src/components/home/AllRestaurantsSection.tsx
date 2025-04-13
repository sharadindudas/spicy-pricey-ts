import { RestaurantInfoType } from "@/types/types";
import { Link } from "react-router";
import RestaurantCard from "@/components/common/RestaurantCard";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Loader2 } from "lucide-react";

interface AllRestaurantsSectionProps {
    data: RestaurantInfoType[];
    city: string;
    FilteredRestaurants: RestaurantInfoType[] | [];
    setFilteredRestaurants: Dispatch<SetStateAction<RestaurantInfoType[] | []>>;
}

const AllRestaurantsSection = ({
    data: restaurantsData,
    city,
    FilteredRestaurants,
    setFilteredRestaurants
}: AllRestaurantsSectionProps) => {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleFilter = (filterName: string, filterFunction: () => void) => {
        setIsLoading(true);
        try {
            if (activeFilter === filterName) {
                setFilteredRestaurants(restaurantsData);
                setActiveFilter(null);
            } else {
                filterFunction();
                setActiveFilter(filterName);
            }
        } catch (err) {
            console.error("Error applying filter:", err);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    };

    // Original filter functions
    const applyFastDeliveryFilter = () => {
        setFilteredRestaurants(
            restaurantsData.filter(
                (res) =>
                    res?.sla?.deliveryTime >= 30 && res?.sla?.deliveryTime <= 50
            )
        );
    };

    const applyRatingFilter = () => {
        setFilteredRestaurants(
            restaurantsData.filter((res) => res?.avgRating > 4.0)
        );
    };

    const applyPureVegFilter = () => {
        setFilteredRestaurants(
            restaurantsData.filter((res) => res?.badges?.imageBadges)
        );
    };

    const applyOffersFilter = () => {
        setFilteredRestaurants(
            restaurantsData.filter(
                (res) =>
                    res?.aggregatedDiscountInfoV3?.header ||
                    res?.aggregatedDiscountInfoV3?.subHeader
            )
        );
    };

    const applyPriceRange300to600Filter = () => {
        const MinPrice = "300",
            MaxPrice = "600";
        setFilteredRestaurants(
            restaurantsData.filter(
                (res) =>
                    res?.costForTwo?.slice(1, 4) >= MinPrice &&
                    res?.costForTwo?.slice(1, 4) <= MaxPrice
            )
        );
    };

    const applyPriceRangeLessthan300Filter = () => {
        const MinPrice = "300";
        setFilteredRestaurants(
            restaurantsData.filter(
                (res) => res?.costForTwo?.slice(1, 4) <= MinPrice
            )
        );
    };

    // Toggle handler functions that use our new toggle logic
    const handleFastDelivery = () => {
        toggleFilter("fastDelivery", applyFastDeliveryFilter);
    };

    const handleRating = () => {
        toggleFilter("rating", applyRatingFilter);
    };

    const handlePureVeg = () => {
        toggleFilter("pureVeg", applyPureVegFilter);
    };

    const handleOffers = () => {
        toggleFilter("offers", applyOffersFilter);
    };

    const handlePriceRange300to600 = () => {
        toggleFilter("priceRange300to600", applyPriceRange300to600Filter);
    };

    const handlePriceRangeLessthan300 = () => {
        toggleFilter("priceRangeLessThan300", applyPriceRangeLessthan300Filter);
    };

    return (
        <>
            {restaurantsData && restaurantsData?.length > 0 && (
                <>
                    <section>
                        <h2 className="text-2xl font-bold">
                            Restaurants with online food delivery in {city}
                        </h2>

                        <div className="mt-4 mb-7 space-x-5">
                            <Button
                                onClick={handleFastDelivery}
                                variant={
                                    activeFilter === "fastDelivery"
                                        ? "default"
                                        : "outline"
                                }
                                className="filter-btn"
                            >
                                Fast Delivery
                            </Button>
                            <Button
                                onClick={handleRating}
                                variant={
                                    activeFilter === "rating"
                                        ? "default"
                                        : "outline"
                                }
                                className="filter-btn"
                            >
                                Rating 4.0+
                            </Button>
                            <Button
                                onClick={handlePureVeg}
                                variant={
                                    activeFilter === "pureVeg"
                                        ? "default"
                                        : "outline"
                                }
                                className="filter-btn"
                            >
                                Pure Veg
                            </Button>
                            <Button
                                onClick={handleOffers}
                                variant={
                                    activeFilter === "offers"
                                        ? "default"
                                        : "outline"
                                }
                                className="filter-btn"
                            >
                                Offers
                            </Button>
                            <Button
                                onClick={handlePriceRange300to600}
                                variant={
                                    activeFilter === "priceRange300to600"
                                        ? "default"
                                        : "outline"
                                }
                                className="filter-btn"
                            >
                                Rs. 300 - Rs. 600
                            </Button>
                            <Button
                                onClick={handlePriceRangeLessthan300}
                                variant={
                                    activeFilter === "priceRangeLessThan300"
                                        ? "default"
                                        : "outline"
                                }
                                className="filter-btn"
                            >
                                Less than Rs. 300
                            </Button>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-8">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                                </div>
                            ) : (
                                FilteredRestaurants?.map((res) => (
                                    <Link
                                        key={res.id}
                                        className="block transition-all hover:scale-95"
                                        to={`/restaurant/menu/${res?.id}`}
                                    >
                                        <RestaurantCard {...res} />
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default AllRestaurantsSection;
