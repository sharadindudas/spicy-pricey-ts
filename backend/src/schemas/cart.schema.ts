import * as yup from "yup";

// Add to cart schema
export const AddToCartSchema = yup.object({
    userId: yup.string().trim().optional(),
    guestId: yup.string().trim().optional(),
    restaurant: yup.object({
        id: yup.string().trim().required("Please provide the restaurant id"),
        lat: yup.number().positive().required("Please provide the restaurant latitude"),
        lng: yup.number().positive().required("Please provide the restaurant latitude"),
        name: yup.string().trim().required("Please provide the restaurant name"),
        city: yup.string().trim().required("Please provide the restaurant city"),
        cloudinaryImageId: yup.string().trim().required("Please provide the restaurant image Id"),
        areaName: yup.string().trim().required("Please provide the restaurant area name")
    }),
    cartItem: yup.object({
        id: yup.string().trim().required("Please provide the item id"),
        name: yup.string().trim().required("Please provide the item name"),
        description: yup.string().trim().required("Please provide the item description"),
        imageId: yup.string().trim().required("Please provide the item image Id"),
        isVeg: yup.boolean().required("Please provide the item type"),
        price: yup.number().positive().required("Please provide the item price"),
        quantity: yup.number().required("Please provide the item quantity")
    })
});
export type AddToCartSchemaType = yup.InferType<typeof AddToCartSchema>;

// Update cart item quantity schema
export const UpdateCartItemQuantitySchema = yup.object({
    userId: yup.string().trim().optional(),
    guestId: yup.string().trim().optional(),
    cartItemId: yup.string().trim().required("Please provide the item id"),
    quantity: yup.number().required("Please provide the item quantity")
});
export type UpdateCartItemQuantitySchemaType = yup.InferType<typeof UpdateCartItemQuantitySchema>;

// Delete cart item schema
export const DeleteCartItemSchema = yup.object({
    userId: yup.string().trim().optional(),
    guestId: yup.string().trim().optional(),
    cartItemId: yup.string().trim().required("Please provide the item id")
});
export type DeleteCartItemSchemaType = yup.InferType<typeof DeleteCartItemSchema>;

// Get cart details schema
export const AllCartDetailsSchema = yup.object({
    userId: yup.string().trim().optional(),
    guestId: yup.string().trim().optional()
});
export type AllCartDetailsSchemaType = yup.InferType<typeof AllCartDetailsSchema>;
