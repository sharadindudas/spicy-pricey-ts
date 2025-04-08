interface CardId {
    card: {
        card: {
            id: string;
        };
    };
}

interface WhatsOnMindSectionType {
    id: string;
    imageId: string;
    accessibility: { altText: string };
}

interface TopChainType {
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

export { type CardId, type WhatsOnMindSectionType, type TopChainType };
