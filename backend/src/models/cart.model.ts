import { Schema, model } from "mongoose";

const cartItemSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        description: {
            type: String
        },
        imageId: {
            type: String
        },
        isVeg: {
            type: Boolean
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    },
    { _id: false, versionKey: false }
);

const restaurantSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        cloudinaryImageId: {
            type: String,
            required: true
        },
        areaName: {
            type: String,
            required: true
        }
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
            required: true,
            default: 0
        }
    },
    { timestamps: true, versionKey: false }
);

export const CartModel = model("Cart", cartSchema);
