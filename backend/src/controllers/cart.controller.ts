import { Request, Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import { CartModel } from "../models/cart.model";
import {
    AddToCartSchema,
    AddToCartSchemaType,
    CartDetailsSchema,
    CartDetailsSchemaType,
    CartItemSchemaType,
    RemoveCartItemSchema,
    RemoveCartItemSchemaType,
    MergeGuestCartSchema,
    MergeGuestCartSchemaType,
    UpdateItemQuantitySchema,
    UpdateItemQuantitySchemaType
} from "../schemas/cart.schema";

/**
 * CartController - Handles all cart-related operations
 *
 * This module contains functions to manage shopping cart operations including:
 * - Adding items to cart
 * - Removing items from cart
 * - Updating item quantities
 * - Retrieving cart information
 * - Merging guest cart with user cart
 */

// Retrieves cart details for either a logged-in user or guest user
const fetchCartByUserIdentifier = async (userId?: string, guestId?: string) => {
    if (userId) return await CartModel.findOne({ user: userId });
    if (guestId) return await CartModel.findOne({ guestId });
    return null;
};

// Recalculates the total price of items in a cart
const calculateTotalPrice = (cartItems: CartItemSchemaType[]) => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Adds an item to the user's or guest's cart
 * Creates a new cart if one doesn't exist
 */
const addToCart = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Validation of data
    const { userId, guestId, restaurant, cartItem } = await AddToCartSchema.validate(req.body as AddToCartSchemaType, {
        abortEarly: false,
        stripUnknown: true
    });

    // Check if the cart exists in the db or not
    const existingCart = await fetchCartByUserIdentifier(userId, guestId);

    // If the cart exists, update it
    if (existingCart) {
        // Verify the restaurant
        if (existingCart.restaurant && existingCart.restaurant.id !== restaurant.id) {
            throw new ErrorHandler("Your cart contains items from another restaurant", 409);
        }

        // Find the cart item
        const cartItemIndex = existingCart.cartItems.findIndex((item) => item.id === cartItem.id);

        // If cart item exists, update quantity
        if (cartItemIndex > -1) {
            existingCart.cartItems[cartItemIndex].quantity += cartItem.quantity;
        }
        // If cart item doesn't exists, add it to cart
        else {
            existingCart.cartItems.push(cartItem);
        }

        // Update restaurant info and recalculate total price
        existingCart.restaurant = restaurant;
        existingCart.totalPrice = calculateTotalPrice(existingCart.cartItems as CartItemSchemaType[]);

        // Save the cart data
        await existingCart.save();

        // Return the response
        res.status(200).json({
            success: true,
            message: "Item added to cart",
            data: existingCart
        });
    }

    // If the cart doesn't exists, create it
    else {
        const generatedGuestId = guestId || `guest_${Date.now()}`;
        const newCart = await CartModel.create({
            user: userId || undefined,
            guestId: userId ? undefined : generatedGuestId,
            restaurant,
            cartItems: [cartItem],
            totalPrice: cartItem.price * cartItem.quantity
        });

        // Return the response
        res.status(201).json({
            success: true,
            message: "Item added to cart",
            data: newCart
        });
    }
});

/**
 * Removes a specific item from the cart
 * Updates cart state or clears restaurant if cart becomes empty
 */
const removeCartItem = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Validation of data
    const { userId, guestId, cartItemId } = await RemoveCartItemSchema.validate(req.body as RemoveCartItemSchemaType, {
        abortEarly: false,
        stripUnknown: true
    });

    // Get the cart details from logged-in user or guest user
    const cart = await fetchCartByUserIdentifier(userId, guestId);

    // Check if the cart exists in the db or not
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    }

    // Check if the cart item exists in the cart or not
    const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);
    if (cartItemIndex === -1) {
        throw new ErrorHandler("Item not found in cart", 404);
    }

    // Remove the item from cart
    cart.cartItems.splice(cartItemIndex, 1);

    // Check if the cart items are empty or not
    if (cart.cartItems.length === 0) {
        // Reset cart
        cart.restaurant = undefined;
        cart.totalPrice = 0;
    } else {
        // Recalculate the total price
        cart.totalPrice = calculateTotalPrice(cart.cartItems as CartItemSchemaType[]);
    }

    // Save the cart data
    await cart.save();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: cart
    });
});

/**
 * Updates the quantity of an item in the cart
 * Removes item if quantity is set to zero
 */
const updateItemQuantity = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Validation of data
    const { userId, guestId, cartItemId, quantity } = await UpdateItemQuantitySchema.validate(req.body as UpdateItemQuantitySchemaType, {
        abortEarly: false,
        stripUnknown: true
    });

    // Get the cart data from logged-in user or guest user
    const cart = await fetchCartByUserIdentifier(userId, guestId);

    // Check if the cart exists in the db or not
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    }

    // Check if the cart item exists in the cart or not
    const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);
    if (cartItemIndex === -1) {
        throw new ErrorHandler("Item not found in cart", 404);
    }

    // Handle quantity update
    if (quantity > 0) {
        // Increase the quantity
        cart.cartItems[cartItemIndex].quantity = quantity;
    } else {
        // Decrease the quantity
        cart.cartItems.splice(cartItemIndex, 1);

        // Check if the cart is empty or not
        if (cart.cartItems.length === 0) {
            cart.restaurant = undefined;
            cart.totalPrice = 0;
        }
    }

    // Recalculate the total price
    if (cart.cartItems.length > 0) {
        cart.totalPrice = calculateTotalPrice(cart.cartItems as CartItemSchemaType[]);
    }

    // Save the cart data
    await cart.save();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: cart
    });
});

/**
 * Retrieves the current cart details for a user or guest
 */
const getCartDetails = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Validation of data
    const { userId, guestId } = await CartDetailsSchema.validate(req.query as CartDetailsSchemaType, { abortEarly: false, stripUnknown: true });

    // Get the cart data from logged-in user or guest user
    const cart = await fetchCartByUserIdentifier(userId, guestId);

    // Check if the cart exists in the db or not
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    }

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched cart successfully",
        data: cart
    });
});

/**
 * Merges a guest user's cart into a logged-in user's cart
 * Handles restaurant conflicts and preserves items when possible
 */
const mergeGuestCart = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get logged in user's id
    const { _id: userId } = req.user;

    // Validation of data
    const { guestId } = await MergeGuestCartSchema.validate(req.body as MergeGuestCartSchemaType, { abortEarly: false, stripUnknown: true });

    // Get the cart data of both user and guest
    const userCart = await CartModel.findOne({ user: userId });
    const guestCart = await CartModel.findOne({ guestId });

    // If the guest cart exists
    if (guestCart) {
        // Check if the guest cart is empty or not
        if (guestCart.cartItems.length === 0) {
            throw new ErrorHandler("Guest cart is empty", 400);
        }

        // If the user cart exists
        if (userCart) {
            // Verify the restaurant
            if (userCart.cartItems.length > 0 && guestCart.restaurant?.id !== userCart.restaurant?.id) {
                // Replace the user cart with guest cart
                userCart.restaurant = guestCart.restaurant;
                userCart.cartItems = guestCart.cartItems;
                userCart.totalPrice = guestCart.totalPrice;
            }

            // Set the restaurant if user cart is empty
            if (userCart.cartItems.length === 0) {
                userCart.restaurant = guestCart.restaurant;
            }

            // Merge the cart items from guest cart into user cart
            guestCart.cartItems.forEach((guestItem) => {
                // Find the cart item inside user cart
                const existingItemIndex = userCart.cartItems.findIndex((item) => item.id === guestItem.id);

                // If the cart item doesn't exists, add it
                if (existingItemIndex === -1) {
                    userCart.cartItems.push(guestItem);
                }
                // If the cart item exists, update the quantity
                else {
                    userCart.cartItems[existingItemIndex].quantity = guestItem.quantity;
                }
            });

            // Recalculate the total price
            userCart.totalPrice = calculateTotalPrice(userCart.cartItems as CartItemSchemaType[]);

            // Save the cart data
            await userCart.save();

            // Remove the guest cart
            await CartModel.findOneAndDelete({ guestId });

            // Return the response
            res.status(200).json({
                success: true,
                message: "Guest cart merged successfully",
                data: userCart
            });
        }

        // If the user cart doesn't exists
        else {
            // Remove the guest cart
            await CartModel.findOneAndDelete({ guestId });

            // Create a new user cart
            const newUserCart = await CartModel.create({
                user: userId,
                restaurant: guestCart.restaurant,
                cartItems: guestCart.cartItems,
                totalPrice: guestCart.totalPrice
            });

            // Return the response
            res.status(200).json({
                success: true,
                message: "Guest cart converted to user cart",
                data: newUserCart
            });
        }
    }

    // If the guest cart doesn't exists
    else {
        res.status(200).json({
            success: true,
            message: "Using existing user cart",
            data: userCart
        });
    }
});

export { addToCart, removeCartItem, updateItemQuantity, getCartDetails, mergeGuestCart };
