import { RestaurantInfoType } from "@/types/types";
import { Link } from "react-router";
import RestaurantCard from "@/components/common/RestaurantCard";

const AllRestaurantsSection = ({
    data: restaurantsData,
    city
}: {
    data: RestaurantInfoType[];
    city: string;
}) => {
    return (
        <>
            {restaurantsData && restaurantsData?.length > 0 && (
                <>
                    <section>
                        <h2 className="text-2xl mb-7 font-bold">
                            Restaurants with online food delivery in {city}
                        </h2>
                        <div className="flex flex-wrap justify-center items-center gap-8">
                            {restaurantsData?.map((res) => (
                                <Link
                                    key={res.id}
                                    className="block transition-all hover:scale-95"
                                    to={`/restaurant/menu/${res?.id}`}
                                >
                                    <RestaurantCard {...res} />
                                </Link>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default AllRestaurantsSection;
