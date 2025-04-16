import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
    {
        id: String,
        name: String,
        description: String,
        imageId: String,
        isVeg: Boolean,
        price: Number,
        quantity: {
            type: Number
        }
    },
    { _id: false, versionKey: false }
);

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        orderItems: [orderItemSchema],
        shippingAddress: {
            address: String,
            city: String,
            postalCode: String,
            country: String
        },
        paymentMethod: String,
        totalPrice: Number,
        isPaid: {
            type: Boolean,
            default: false
        },
        paidAt: Date,
        isDelivered: {
            type: Boolean,
            default: false
        },
        deliveredAt: Date,
        paymentStatus: {
            type: String,
            default: "pending"
        },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Processing"
        }
    },
    { timestamps: true, versionKey: false }
);

export const OrderModel = model("Order", orderSchema);
