import { Response } from "express";
import { AsyncHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import { CartModel } from "../models/cart.model";
import { AddToCartSchema } from "../schemas/cart.schema";

// Helper function to get cart data by user Id or guest Id
const getCart = async (userId: string | undefined, guestId: string | undefined) => {
    if (userId) return await CartModel.findOne({ user: userId });
    else if (guestId) return await CartModel.findOne({ guestId });
    return null;
};

// Add to cart
const AddToCart = AsyncHandler(async (req, res: Response<ApiResponse>) => {
    // Validation of data
    const validatedData = await AddToCartSchema.validate(req.body);

    // Get the validated data
    const { userId, guestId, restaurant, cartItem } = validatedData;

    // Check if the user is logged in or guest
    let cart = await getCart(userId, guestId);

    // If the cart already exists, update it
    if (cart) {
        const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItem.id);
        // If the cart item already exists, update the quantity
        if (cartItemIndex > -1) {
            cart.cartItems[cartItemIndex].quantity += cartItem.quantity;
        }
        // If the cart item does not exists, add the new cart item
        else {
            cart.cartItems.push(cartItem);
        }

        // Recalculate the total price
        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

        // Save the cart data on db
        await cart.save();

        // Return the response
        res.status(200).json({
            success: true,
            message: "Updated cart successfully",
            data: cart
        });
    }

    // If the cart does not exists, create it
    else {
        // Create a new cart for guest or user
        const newCart = await CartModel.create({
            user: userId ? userId : undefined,
            guestId: guestId ? guestId : "guest_" + new Date().getTime(),
            cartItems: [cartItem],
            totalPrice: cartItem.price * cartItem.quantity
        });

        // Return the response
        res.status(201).json({
            success: true,
            message: "Added cart successfully",
            data: newCart
        });
    }
});

export { AddToCart };
