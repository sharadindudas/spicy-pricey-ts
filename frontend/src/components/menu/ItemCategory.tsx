import { ItemCategoryType, RestaurantMenuInfoType } from "@/types/types";
import MenuItem from "./MenuItem";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ItemCategoryProps {
    data: ItemCategoryType;
    resInfo: RestaurantMenuInfoType;
}

const ItemCategory = ({ data, resInfo }: ItemCategoryProps) => {
    const { title, itemCards } = data;

    return (
        <div>
            <Accordion
                type="single"
                collapsible
                defaultValue="accordion-item">
                <AccordionItem value="accordion-item">
                    <AccordionTrigger className="bg-white w-full shadow-md p-5 text-lg font-bold cursor-pointer">
                        {title} ({itemCards?.length})
                    </AccordionTrigger>
                    <AccordionContent className="px-5 py-4">
                        {itemCards?.map((item) => (
                            <MenuItem
                                key={item?.card?.info?.id}
                                data={item?.card?.info}
                                resInfo={resInfo}
                            />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ItemCategory;
