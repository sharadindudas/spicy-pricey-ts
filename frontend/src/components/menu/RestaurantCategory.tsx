import { ItemCategoryType, NestedItemCategoryType, RestaurantMenuCategoryType, RestaurantMenuInfoType } from "@/types/types";
import ItemCategory from "./ItemCategory";
import NestedItemCategory from "./NestedItemCategory";

interface RestaurantCategoryProps {
    data: RestaurantMenuCategoryType[];
    resInfo: RestaurantMenuInfoType;
}

const RestaurantCategory = ({ data: menuCategoryData, resInfo }: RestaurantCategoryProps) => {
    return (
        <div className="space-y-4 my-6">
            {menuCategoryData?.map((category) =>
                category?.type === "item" ? (
                    <ItemCategory
                        key={category?.title}
                        data={category as ItemCategoryType}
                        resInfo={resInfo}
                    />
                ) : (
                    <NestedItemCategory
                        key={category?.title}
                        data={category as NestedItemCategoryType}
                        resInfo={resInfo}
                    />
                )
            )}
        </div>
    );
};

export default RestaurantCategory;
