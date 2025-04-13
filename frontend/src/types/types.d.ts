// Home page
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

// Menu page
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
    itemCards: [
        card: {
            info: MenuItemType;
        }
    ];
}

export interface NestedItemCategoryType {
    title: string;
    categories: ItemCategoryType[];
}

// Common
export interface ApiResponse {
    success: boolean;
    message: string;
    data?: unknown;
}

export interface Location {
    city: string;
    lat: number;
    lng: number;
    address: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}
