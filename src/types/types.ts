export interface CardId {
    card: {
        card: {
            id: string;
        };
    };
}

export interface CardType {
    card: {
        card: {
            "@type": string;
        };
    };
}

export interface WhatsOnMindSectionType {
    id: string;
    imageId: string;
    accessibility: { altText: string };
}

export interface RestaurantInfoType {
    id: string;
    name: string;
    cloudinaryImageId: string;
    areaName: string;
    avgRating: number;
    cuisines: [string];
    isOpen: boolean;
    sla: {
        slaString: string;
    };
}

export interface RestaurantMenuInfoType {
    name: string;
    city: string;
    cuisines: [string];
    areaName: string;
    sla: { lastMileTravelString: string; slaString: string };
    avgRating: number;
    totalRatingsString: string;
    isOpen: boolean;
}

export interface RestaurantMenuCategoryType {
    title: string;
    type: "item" | "nested";
    itemCards?: [];
    categories?: [];
}

export interface ItemCardType {
    card: {
        info: MenuItemType;
    };
}

export interface MenuItemType {
    id: string;
    name: string;
    price: number;
    defaultPrice: number;
    description: string;
    imageId: string;
    itemAttribute: { vegClassifier: string };
}

export interface ItemCategoryType {
    title: string;
    itemCards: ItemCardType[];
}

export interface NestedItemCategoryType {
    title: string;
    categories: ItemCategoryType[];
}
