import { RestaurantMenuInfoType } from "@/types/types";
import { Link } from "react-router";

const RestaurantInfo = ({ data: resInfo }: { data: RestaurantMenuInfoType }) => {
    const { name, city, cuisines, areaName, sla, avgRating, totalRatingsString } = resInfo;

    return (
        <>
            {/* Breadcrumb */}
            <div
                className="flex"
                aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <Link
                            to="/"
                            className="inline-flex items-center text-xs font-medium">
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg
                                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 9 4-4-4-4"
                                />
                            </svg>
                            <span className="ms-1 text-xs font-medium">{city}</span>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg
                                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 9 4-4-4-4"
                                />
                            </svg>
                            <span className="ms-1 text-xs font-medium text-[#535665]">{name}</span>
                        </div>
                    </li>
                </ol>
            </div>

            {/* Restaurant Details */}
            <div className="flex justify-between items-center mt-8">
                <div className="space-y-0.5 text-sm">
                    <h2 className="font-bold text-2xl">{name}</h2>
                    <p className="text-gray-600">{cuisines?.join(", ")}</p>
                    <div className="text-gray-600">
                        {areaName}, {sla?.lastMileTravelString}
                    </div>
                    <div className="text-gray-600 font-semibold">{sla.slaString?.toLowerCase()}</div>
                </div>
                {avgRating && (
                    <div>
                        <button className="sm:max-w-[100px] sm:w-auto w-[100px] p-2 text-center border border-gray-300 rounded-md cursor-pointer">
                            <div className="text-[#3d9b6d] pb-[10px] border border-b-gray-400 border-l-0 border-t-0 border-r-0 mb-2 font-bold flex justify-center items-center gap-1">
                                <span>
                                    <img
                                        loading="lazy"
                                        src="/assets/star-icon.png"
                                        alt="star-icon"
                                    />
                                </span>
                                <span className="text-sm">{avgRating}</span>
                            </div>
                            <div className="text-xs text-[#8b8d97] font-bold tracking-tighter">{totalRatingsString}</div>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default RestaurantInfo;
