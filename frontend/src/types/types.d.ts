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
        deliveryTime: number;
    };
    badges: {
        imageBadges;
    };
    aggregatedDiscountInfoV2: {
        header: string;
    };
    aggregatedDiscountInfoV3: {
        header: string;
        subHeader: string;
    };
    costForTwo: string;
}

// Menu page
export interface RestaurantMenuInfoType {
    id: string;
    name: string;
    city: string;
    cuisines: [string];
    areaName: string;
    latLong: string;
    cloudinaryImageId: string;
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

// Common
export type setStateBooleanType = React.Dispatch<React.SetStateAction<boolean>>;

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

export interface CartItem {
    id: string;
    name: string;
    description?: string;
    imageId?: string;
    isVeg: boolean;
    price: number;
    quantity: number;
}

export interface Cart {
    _id: string;
    userId?: string;
    guestId?: string;
    restaurant: {
        id: string;
        lat: number;
        lng: number;
        name: string;
        city: string;
        cloudinaryImageId: string;
        areaName: string;
    };
    cartItems: CartItem[];
    cartItemsCount: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface AddToCart {
    userId?: string;
    guestId?: string;
    restaurant: {
        id: string;
        lat: number;
        lng: number;
        name: string;
        city: string;
        cloudinaryImageId: string;
        areaName: string;
    };
    cartItem: {
        id: string;
        name: string;
        description: string;
        imageId: string;
        isVeg: boolean;
        price: number;
        quantity: number;
    };
}
