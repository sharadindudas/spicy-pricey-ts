import { Request, Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse, User } from "../@types/types";
import {
    AddToCartSchema,
    AddToCartSchemaType,
    DeleteCartItemSchema,
    DeleteCartItemSchemaType,
    AllCartDetailsSchema,
    AllCartDetailsSchemaType,
    UpdateCartItemQuantitySchema,
    UpdateCartItemQuantitySchemaType,
    MergeGuestCartSchemaType,
    MergeGuestCartSchema
} from "../schemas/cart.schema";
import { CartModel } from "../models/cart.model";
import mongoose from "mongoose";

// Helper function to get the cart data of logged in user or guest
const getCartData = async (userId: string | undefined, guestId: string | undefined) => {
    if (userId) return await CartModel.findOne({ user: userId });
    else if (guestId) return await CartModel.findOne({ guestId });
    else return null;
};

// Add cart item for logged in user or guest
const addToCart = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body
    const addToCartData = req.body as AddToCartSchemaType;

    // Validation of data
    const { userId, guestId, restaurant, cartItem } = await AddToCartSchema.validate(addToCartData, { abortEarly: false, stripUnknown: true });

    // Get the cart data from logged in user or guest
    const cart = await getCartData(userId, guestId);

    // If the cart data exists, update it
    if (cart) {
        // Find the cart item from the cart
        const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItem.id);

        // If the cart item exists, update the quantity
        if (cartItemIndex > -1) {
            cart.cartItems[cartItemIndex].quantity += cartItem.quantity;
        }

        // If the cart item does not exists, add it to cart
        else {
            cart.cartItems.push(cartItem);
        }

        // Recalculate the total price of the cart items
        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

        // Update the cart data
        await cart.save();

        // Return the response
        res.status(200).json({
            success: true,
            message: "Updated cart successfully",
            data: cart
        });
    }

    // If the cart data doesn't exists, create it
    else {
        // Create a new cart
        const newCart = await CartModel.create({
            user: userId ? userId : undefined,
            guestId: guestId ? guestId : "guest_" + new Date().getTime(),
            restaurant,
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

// Update cart item quantity in the cart for logged in user or guest
const updateCartItemQuantity = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body
    const updateCartItemQuantityData = req.body as UpdateCartItemQuantitySchemaType;

    // Validation of data
    const { userId, guestId, cartItemId, quantity } = await UpdateCartItemQuantitySchema.validate(updateCartItemQuantityData, {
        abortEarly: false,
        stripUnknown: true
    });

    // Get the cart data from logged in user or guest
    const cart = await getCartData(userId, guestId);

    // Check if the cart exists in the db or not
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    } else {
        // Find the cart item from the cart
        const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);

        // Check if the cart item exists or not
        if (cartItemIndex === -1) {
            throw new ErrorHandler("Item not found in cart", 404);
        } else {
            // Update the cart item quantity
            if (quantity > 0) {
                cart.cartItems[cartItemIndex].quantity = quantity;
            }
            // Remove cart item if quantity is 0
            else {
                cart.cartItems.splice(cartItemIndex, 1);
            }

            // Calculate the total price
            cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

            // Update the cart data
            await cart.save();

            // Return the response
            res.status(200).json({
                success: true,
                message: "Updated cart successfully",
                data: cart
            });
        }
    }
});

// Delete cart item for logged in user or guest
const deleteCartItem = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body
    const deleteCartItemData = req.body as DeleteCartItemSchemaType;

    // Validation of data
    const { userId, guestId, cartItemId } = await DeleteCartItemSchema.validate(deleteCartItemData, { abortEarly: false, stripUnknown: true });

    // Get the cart data from logged in user or guest
    const cart = await getCartData(userId, guestId);

    // Check if the cart data exists in the db or not
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    } else {
        // Find the cart item from the cart
        const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);

        // Check if the cart item exists or not
        if (cartItemIndex === -1) {
            throw new ErrorHandler("Item not found in cart", 404);
        } else {
            // Delete the cart item from the cart
            cart.cartItems.splice(cartItemIndex, 1);

            // Calculate the total price
            cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

            // Update the cart data
            await cart.save();

            // Return the response
            res.status(200).json({
                success: true,
                message: "Deleted cart item successfully",
                data: cart
            });
        }
    }
});

// Get logged in user or guest user's cart details
const allCartDetails = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request query
    const cartDetailsData = req.query as AllCartDetailsSchemaType;

    // Validation of data
    const { userId, guestId } = await AllCartDetailsSchema.validate(cartDetailsData, { abortEarly: false, stripUnknown: true });

    // Get the cart data for logged in user or guest
    const cart = await getCartData(userId, guestId);

    // Check if the cart exists in the db or not
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    } else {
        res.status(200).json({
            success: true,
            message: "Fetched cart successfully",
            data: cart
        });
    }
});

// Merge guest cart into user cart on login
const mergeGuestCart = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body
    const mergeGuestCartData = req.body as MergeGuestCartSchemaType;

    // Validation of data
    const { guestId } = await MergeGuestCartSchema.validate(mergeGuestCartData, { abortEarly: false, stripUnknown: true });

    // Get logged in user's id
    const { _id: userId } = req.user as User;

    // Find the guest cart and user cart
    const guestCart = await CartModel.findOne({ guestId });
    const userCart = await CartModel.findOne({ user: userId });

    // Check if the guest cart exists or not
    if (guestCart) {
        // If the guest cart is empty
        if (guestCart.cartItems.length === 0) {
            throw new ErrorHandler("Guest cart is empty", 400);
        }

        // If the user cart exists, merge the guest cart
        if (userCart) {
            // Merge the guest cart into user cart
            guestCart.cartItems.forEach((guestCartItem) => {
                // Find the cart item inside the user cart
                const cartItemIndex = userCart.cartItems.findIndex((userCartItem) => userCartItem.id === guestCartItem.id);

                // If the cart item exists, update the quantity
                if (cartItemIndex > -1) {
                    userCart.cartItems[cartItemIndex].quantity += guestCartItem.quantity as number;
                }
                // If the cart item doesn't exists, push it
                else {
                    userCart.cartItems.push(guestCartItem);
                }
            });

            // Recalculate the total price
            userCart.totalPrice = userCart.cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

            // Update the user cart data
            await userCart.save();

            // Remove the guest cart after merging
            await CartModel.findOneAndDelete({ guestId });

            // Return the response
            res.status(200).json({
                success: true,
                message: "Fetched cart successfully",
                data: userCart
            });
        }

        // If the user cart doesn't exists, assign the guest cart to the user
        else {
            guestCart.user = new mongoose.Types.ObjectId(userId);
            guestCart.guestId = undefined;
            await guestCart.save();

            // Return the response
            res.status(200).json({
                success: true,
                message: "Fetched cart successfully",
                data: guestCart
            });
        }
    }

    // If the guest cart doesn't exists
    else {
        // Guest cart has already been merged, return user cart
        if (userCart) {
            res.status(200).json({
                success: true,
                message: "Fetched cart successfully",
                data: userCart
            });
        }

        throw new ErrorHandler("Guest cart not found", 404);
    }
});

export { addToCart, updateCartItemQuantity, deleteCartItem, allCartDetails, mergeGuestCart };
