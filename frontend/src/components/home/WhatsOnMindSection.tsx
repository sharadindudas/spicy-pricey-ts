import { WhatsOnMindSectionType } from "@/types/types";
import { WHATSONMIND_IMG_URL } from "@/utils/constants";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";

const WhatsOnMindSection = ({
    data: whatsOnMindData
}: {
    data: WhatsOnMindSectionType[];
}) => {
    return (
        <>
            {whatsOnMindData && whatsOnMindData?.length > 0 && (
                <>
                    <section className="relative">
                        <h2 className="text-2xl mb-4 font-bold">
                            What's on your mind?
                        </h2>
                        <Carousel>
                            <div className="absolute -top-8 right-10 sm:block hidden">
                                <CarouselPrevious className="top-0 -left-10 cursor-pointer" />
                                <CarouselNext className="top-0 -right-8 cursor-pointer" />
                            </div>
                            <CarouselContent>
                                {whatsOnMindData?.map((item) => (
                                    <CarouselItem
                                        key={item.id}
                                        className="basis-auto"
                                    >
                                        <div className="cursor-pointer">
                                            <div className="w-36">
                                                <img
                                                    src={
                                                        WHATSONMIND_IMG_URL +
                                                        item?.imageId
                                                    }
                                                    alt={
                                                        item?.accessibility
                                                            ?.altText
                                                    }
                                                />
                                            </div>
                                        </div>
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

export default WhatsOnMindSection;
