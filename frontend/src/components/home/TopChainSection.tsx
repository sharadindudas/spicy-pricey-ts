import { RestaurantInfoType } from "@/types/types";
import { TopChainCard, withOfferLabel } from "./TopChainCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router";

interface TopChainSectionProps {
    data: RestaurantInfoType[];
    city: string;
}

const TopChainSection = ({ data: topChainData, city }: TopChainSectionProps) => {
    const TopChainCardWithOffer = withOfferLabel(TopChainCard);

    return (
        <>
            {topChainData && topChainData?.length > 0 && (
                <>
                    <section>
                        <h2 className="text-2xl mb-7 font-bold">Top restaurant chains in {city}</h2>
                        <Carousel>
                            <div className="absolute -top-11 right-10 sm:block hidden">
                                <CarouselPrevious className="top-0 -left-10 cursor-pointer" />
                                <CarouselNext className="top-0 -right-8 cursor-pointer" />
                            </div>
                            <CarouselContent>
                                {topChainData?.map((res) => (
                                    <CarouselItem
                                        key={res?.id}
                                        className="basis-auto">
                                        <Link
                                            className="block transition-all hover:scale-95 relative"
                                            to={`/restaurant/menu/${res?.id}`}>
                                            {res?.aggregatedDiscountInfoV3 || res?.aggregatedDiscountInfoV2 ? (
                                                <TopChainCardWithOffer {...res} />
                                            ) : (
                                                <TopChainCard {...res} />
                                            )}
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
