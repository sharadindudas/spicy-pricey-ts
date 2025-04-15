import { Schema, model } from "mongoose";

const cartItemSchema = new Schema(
    {
        id: String,
        name: String,
        description: String,
        imageId: String,
        isVeg: Boolean,
        price: Number,
        quantity: {
            type: Number,
            default: 1
        }
    },
    { _id: false, versionKey: false }
);

const restaurantSchema = new Schema(
    {
        id: String,
        lat: Number,
        lng: Number,
        name: String,
        city: String,
        cloudinaryImageId: String,
        areaName: String
    },
    { _id: false, versionKey: false }
);

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        guestId: String,
        restaurant: restaurantSchema,
        cartItems: [cartItemSchema],
        totalPrice: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true, versionKey: false }
);

export const CartModel = model("Cart", cartSchema);
