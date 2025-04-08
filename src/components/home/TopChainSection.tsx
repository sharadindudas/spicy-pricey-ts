import { TopChainType } from "@/types/types";
import RestaurantCard from "@/components/common/RestaurantCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { Link } from "react-router";

const TopChainSection = ({ data: topChainData }: { data: TopChainType[] }) => {
    return (
        <>
            {topChainData && topChainData?.length > 0 && (
                <>
                    <section>
                        <h2 className="text-2xl mb-7 font-bold">
                            Top restaurant chains in Kolkata
                        </h2>
                        <Carousel>
                            <div className="absolute -top-11 right-10 sm:block hidden">
                                <CarouselPrevious className="top-0 -left-10 cursor-pointer" />
                                <CarouselNext className="top-0 -right-8 cursor-pointer" />
                            </div>
                            <CarouselContent>
                                {topChainData?.map((res) => (
                                    <CarouselItem
                                        key={res?.id}
                                        className="basis-auto"
                                    >
                                        <Link
                                            className="relative block transition-all hover:scale-95"
                                            to={`/restaurants/${res?.id}`}
                                        >
                                            <RestaurantCard {...res} />
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </section>

                    <div className="divider"></div>
                </>
            )}
        </>
    );
};

export default TopChainSection;
