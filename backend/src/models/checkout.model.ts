import { Schema, model } from "mongoose";

const checkoutItemSchema = new Schema(
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

const checkoutSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        checkoutItems: [checkoutItemSchema],
        shippingAddress: {
            address: String,
            city: String,
            postalCode: String,
            country: String
        },
        totalPrice: Number,
        paymentMethod: String,
        isPaid: {
            type: Boolean,
            default: false
        },
        paidAt: Date,
        paymentStatus: {
            type: String,
            default: "Pending"
        },
        paymentDetails: {
            type: Schema.Types.Mixed // store payment related details (transaction id, paypal response)
        },
        isFinalized: {
            type: Boolean,
            default: false
        },
        finalizedAt: Date
    },
    { timestamps: true, versionKey: false }
);

export const CheckoutModel = model("Checkout", checkoutSchema);
