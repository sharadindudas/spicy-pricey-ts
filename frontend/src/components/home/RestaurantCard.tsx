import { RestaurantInfoType } from "@/types/types";
import { RESTAURANT_IMG, RESTAURANT_IMG_GRAYSCALE } from "@/utils/constants";
import { truncateString } from "@/utils/truncateString";
import { ReactElement } from "react";

const RestaurantCard = (props: RestaurantInfoType) => {
    const { areaName, name, avgRating, cloudinaryImageId, sla, cuisines, isOpen } = props;
    const { slaString } = sla;

    return (
        <>
            <div className="flex flex-col gap-2 cursor-pointer">
                <div className="w-[350px] h-64 relative rounded-xl overflow-hidden">
                    {isOpen ? (
                        <>
                            <img
                                src={RESTAURANT_IMG + cloudinaryImageId}
                                alt={name + " img"}
                                className="rounded-xl w-full h-full object-cover"
                            />
                            <div className="res-img-overlay"></div>
                        </>
                    ) : (
                        <>
                            <img
                                src={RESTAURANT_IMG_GRAYSCALE + cloudinaryImageId}
                                alt={name + " img"}
                                className="rounded-xl w-full h-full object-cover"
                            />
                            <div className="res-img-overlay"></div>
                        </>
                    )}
                </div>
                <div className="ml-3">
                    <h2 className="font-semibold text-lg tracking-tighter">{truncateString(name, 30)}</h2>
                    <div className="font-semibold flex items-center gap-1">
                        <img
                            src="/assets/star-icon.png"
                            alt="ratings"
                        />
                        <span>
                            {avgRating} • {slaString}
                        </span>
                    </div>
                    <p className="tracking-tight text-base text-gray-600">{truncateString(cuisines?.join(", "), 33)}</p>
                    <div className="tracking-tight text-base text-gray-600">{areaName}</div>
                </div>
            </div>
        </>
    );
};

const withOfferLabel = (RestaurantCard: (props: RestaurantInfoType) => ReactElement) => {
    return (props: RestaurantInfoType) => {
        const { aggregatedDiscountInfoV3, aggregatedDiscountInfoV2 } = props;

        return (
            <>
                <RestaurantCard {...props} />
                {aggregatedDiscountInfoV2 && (
                    <label className="absolute bottom-28 left-3 text-white uppercase font-bold text-xl">{aggregatedDiscountInfoV2?.header}</label>
                )}
                {aggregatedDiscountInfoV3 && (
                    <label className="absolute bottom-28 left-3 text-white uppercase font-bold text-xl">
                        {aggregatedDiscountInfoV3?.header} {aggregatedDiscountInfoV3?.subHeader}
                    </label>
                )}
            </>
        );
    };
};

export { RestaurantCard, withOfferLabel };
