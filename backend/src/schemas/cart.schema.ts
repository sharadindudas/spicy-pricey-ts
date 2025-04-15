import * as yup from "yup";

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
        quantity: yup.number().positive().default(1).required("Please provide the item quantity")
    })
});
export type AddToCartSchemaType = yup.InferType<typeof AddToCartSchema>;
