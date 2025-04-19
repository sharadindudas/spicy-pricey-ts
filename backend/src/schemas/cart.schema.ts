import * as yup from "yup";

const userIdSchema = yup.string().trim().optional();
const guestIdSchema = yup.string().trim().optional();
const CartItemIdSchema = yup.string().trim().required("Please provide the item id");

export const CartItemSchema = yup.object({
    id: CartItemIdSchema,
    name: yup.string().trim(),
    description: yup.string().trim(),
    imageId: yup.string().trim(),
    isVeg: yup.boolean(),
    price: yup.number().positive().required("Please provide the item price"),
    quantity: yup.number().required("Please provide the item quantity")
});
export type CartItemSchemaType = yup.InferType<typeof CartItemSchema>;

// Add to cart schema
export const AddToCartSchema = yup.object({
    userId: userIdSchema,
    guestId: guestIdSchema,
    restaurant: yup.object({
        id: yup.string().trim().required("Please provide the restaurant id"),
        lat: yup.number().positive().required("Please provide the restaurant latitude"),
        lng: yup.number().positive().required("Please provide the restaurant latitude"),
        name: yup.string().trim().required("Please provide the restaurant name"),
        city: yup.string().trim().required("Please provide the restaurant city"),
        cloudinaryImageId: yup.string().trim().required("Please provide the restaurant image Id"),
        areaName: yup.string().trim().required("Please provide the restaurant area name")
    }),
    cartItem: CartItemSchema
});
export type AddToCartSchemaType = yup.InferType<typeof AddToCartSchema>;

// Delete cart item schema
export const RemoveCartItemSchema = yup.object({
    userId: userIdSchema,
    guestId: guestIdSchema,
    cartItemId: CartItemIdSchema
});
export type RemoveCartItemSchemaType = yup.InferType<typeof RemoveCartItemSchema>;

// Update cart item quantity schema
export const UpdateItemQuantitySchema = yup.object({
    userId: userIdSchema,
    guestId: guestIdSchema,
    cartItemId: CartItemIdSchema,
    quantity: yup.number().required("Please provide the item quantity")
});
export type UpdateItemQuantitySchemaType = yup.InferType<typeof UpdateItemQuantitySchema>;

// Get cart details schema
export const CartDetailsSchema = yup.object({
    userId: userIdSchema,
    guestId: guestIdSchema
});
export type CartDetailsSchemaType = yup.InferType<typeof CartDetailsSchema>;

// Merge guest cart schema
export const MergeGuestCartSchema = yup.object({
    guestId: guestIdSchema
});
export type MergeGuestCartSchemaType = yup.InferType<typeof MergeGuestCartSchema>;
