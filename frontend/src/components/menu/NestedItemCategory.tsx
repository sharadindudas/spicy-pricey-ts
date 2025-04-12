import { NestedItemCategoryType } from "@/types/types";
import MenuItem from "./MenuItem";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";

const NestedItemCategory = ({ data }: { data: NestedItemCategoryType }) => {
    const { title, categories } = data;

    return (
        <div>
            <h2 className="p-5 text-lg font-bold">{title}</h2>
            <div className="space-y-3">
                {categories?.map((subcategory) => (
                    <Accordion
                        key={subcategory?.title}
                        type="single"
                        collapsible
                    >
                        <AccordionItem className="ml-3" value="accordion-item">
                            <AccordionTrigger className="bg-white w-full shadow-md p-4.5 text-base font-bold cursor-pointer">
                                {subcategory?.title} (
                                {subcategory?.itemCards?.length})
                            </AccordionTrigger>
                            <AccordionContent className="px-5 py-4">
                                {subcategory?.itemCards?.map((item) => (
                                    <MenuItem
                                        key={item?.card?.info?.id}
                                        data={item?.card?.info}
                                    />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        </div>
    );
};

export default NestedItemCategory;
