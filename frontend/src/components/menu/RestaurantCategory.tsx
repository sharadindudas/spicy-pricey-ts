import {
    ItemCategoryType,
    NestedItemCategoryType,
    RestaurantMenuCategoryType
} from "@/types/types";
import ItemCategory from "./ItemCategory";
import NestedItemCategory from "./NestedItemCategory";

const RestaurantCategory = ({
    data: menuCategoryData
}: {
    data: RestaurantMenuCategoryType[];
}) => {
    return (
        <div className="space-y-4 my-6">
            {menuCategoryData?.map((category) =>
                category?.type === "item" ? (
                    <ItemCategory
                        key={category?.title}
                        data={category as ItemCategoryType}
                    />
                ) : (
                    <NestedItemCategory
                        key={category?.title}
                        data={category as NestedItemCategoryType}
                    />
                )
            )}
        </div>
    );
};

export default RestaurantCategory;
