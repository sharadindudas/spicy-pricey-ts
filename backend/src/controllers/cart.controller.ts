import { Request, Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import {
    AddToCartSchema,
    AddToCartSchemaType,
    AllCartDetailsSchema,
    AllCartDetailsSchemaType,
    DeleteCartItemSchema,
    DeleteCartItemSchemaType,
    MergeCartSchema,
    MergeCartSchemaType,
    UpdateCartItemQuantitySchema,
    UpdateCartItemQuantitySchemaType
} from "../schemas/cart.schema";
import { CartModel } from "../models/cart.model";

// Helper function to get the cart data of logged in user or guest
const getCartDetails = async (userId: string | undefined, guestId: string | undefined) => {
    if (userId) return await CartModel.findOne({ user: userId });
    else if (guestId) return await CartModel.findOne({ guestId });
    else return null;
};

// Add cart item for logged in user or guest user
const addToCart = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body
    const addToCartData = req.body as AddToCartSchemaType;

    // Validation of data
    const { userId, guestId, restaurant, cartItem } = await AddToCartSchema.validate(addToCartData, { abortEarly: false, stripUnknown: true });

    // Get the cart data from logged in user or guest user
    const cart = await getCartDetails(userId, guestId);

    // If the cart data exists, update it
    if (cart) {
        // Check if the cart item is from same restaurant or not
        if (cart.restaurant) {
            if (cart.restaurant.id !== restaurant.id) {
                throw new ErrorHandler("Your cart contains items from other restaurant. Please reset your cart", 409);
            }
        }

        // Find the cart item
        const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItem.id);

        // If the cart item does not exists, add it
        if (cartItemIndex === -1) {
            cart.cartItems.push(cartItem);
        }
        // If the cart item exists, update the quantity
        else {
            cart.cartItems[cartItemIndex].quantity += cartItem.quantity;
        }

        // Add the restaurant info to the cart
        cart.restaurant = restaurant;

        // Recalculate the total price
        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Save the cart details
        await cart.save();

        // Return the response
        res.status(200).json({
            success: true,
            message: "Item added to cart",
            data: cart
        });
    }

    // If the cart data doesn't exists, create it
    else {
        // Create a new cart
        const newCart = await CartModel.create({
            userId: userId ? userId : undefined,
            guestId: guestId ? guestId : "guest_" + new Date().getTime(),
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

// Delete cart item from cart
const deleteItemFromCart = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body
    const deleteCartData = req.body as DeleteCartItemSchemaType;

    // Validation of data
    const { userId, guestId, cartItemId } = await DeleteCartItemSchema.validate(deleteCartData, { abortEarly: false, stripUnknown: true });

    // Get the cart data from logged in user or guest user
    const cart = await getCartDetails(userId, guestId);

    // Check if the cart exists in the db or not
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    }

    // Find the cart item
    const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);
    if (cartItemIndex === -1) {
        throw new ErrorHandler("Item not found in cart", 404);
    }

    // Remove the cart item from the cart
    cart.cartItems.splice(cartItemIndex, 1);

    // Check if the cart item is the last item in the cart or not
    if (cart.cartItems.length === 0) {
        // Remove restaurant info and reset total price
        cart.restaurant = undefined;
        cart.totalPrice = 0;
    } else {
        // Calculate the total price
        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
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

// Update cart item quantity for logged in user or guest user
const updateCartItemQuantity = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body
    const updateCartData = req.body as UpdateCartItemQuantitySchemaType;

    // Validation of data
    const { userId, guestId, cartItemId, quantity } = await UpdateCartItemQuantitySchema.validate(updateCartData, {
        abortEarly: false,
        stripUnknown: true
    });

    // Get the cart data from logged in user or guest user
    const cart = await getCartDetails(userId, guestId);

    // Check if the cart exists in the db or not
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    }

    // Find the cart item
    const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);

    // If the cart item doesn't exists
    if (cartItemIndex === -1) {
        throw new ErrorHandler("Item not found in cart", 404);
    }

    // Update the cart item quantity
    if (quantity > 0) {
        cart.cartItems[cartItemIndex].quantity = quantity;
    } else {
        // Remove the item if quantity is 0
        cart.cartItems.splice(cartItemIndex, 1);

        // Check if the cart item is the last item in the cart or not
        if (cart.cartItems.length === 0) {
            // Remove restaurant info and reset total price
            cart.restaurant = undefined;
            cart.totalPrice = 0;
        }
    }

    // Calculate the total price if there are items in cart
    if (cart.cartItems.length > 0) {
        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    // Save the cart data
    await cart.save();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Updated cart successfully",
        data: cart
    });
});

// Get logged in user or guest user cart details
const cartDetails = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request query
    const allCartData = req.query as AllCartDetailsSchemaType;

    // Validation of data
    const { userId, guestId } = await AllCartDetailsSchema.validate(allCartData, { abortEarly: false, stripUnknown: true });

    // Get the cart data from logged in user or guest user
    const cart = await getCartDetails(userId, guestId);

    // Check if the cart exists in the db or not
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    } else {
        // Return the response
        res.status(200).json({
            success: true,
            message: "Fetched cart successfully",
            data: cart
        });
    }
});

// Merge guest user's cart into user's cart on login
const mergeCartDetails = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body
    const mergeCartData = req.body as MergeCartSchemaType;

    // Get logged in user's id from auth middleware
    const { _id: userId } = req.user;

    // Validation of data
    const { guestId } = await MergeCartSchema.validate(mergeCartData, { abortEarly: false, stripUnknown: true });

    // Find the guest cart and user cart
    const guestCart = await CartModel.findOne({ guestId });
    const userCart = await CartModel.findOne({ user: userId });

    // Check if the guest cart exists in the db or not
    if (guestCart) {
        // Check if the cart items is empty or not
        if (guestCart.cartItems.length === 0) {
            throw new ErrorHandler("Guest cart is empty", 400);
        }

        // If the user cart exists
        if (userCart) {
            // Check if the restaurant is same on both user cart and guest cart
            if (userCart.cartItems.length > 0 && guestCart.restaurant?.id !== userCart.restaurant?.id) {
                // Carts have items from different restaurants - handle the conflict
                userCart.restaurant = guestCart.restaurant;
                userCart.cartItems = guestCart.cartItems;
                userCart.totalPrice = guestCart.totalPrice;
            }

            // If user cart is empty, adopt the guest cart's restaurant
            if (userCart.cartItems.length === 0) {
                userCart.restaurant = guestCart.restaurant;
            }

            // Merge the guest cart into user cart
            guestCart.cartItems.forEach((guestItem) => {
                // Find the cart item from the user cart
                const cartItemIndex = userCart.cartItems.findIndex((item) => item.id === guestItem.id);

                // If the cart item doesn't exists in the guest cart, add it to user cart
                if (cartItemIndex === -1) {
                    userCart.cartItems.push(guestItem);
                }
                // If the cart item exists in the guest cart, update the quantity
                else {
                    userCart.cartItems[cartItemIndex].quantity = guestItem.quantity;
                }
            });

            // Calculate the total price
            userCart.totalPrice = userCart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

            // Save the cart data
            await userCart.save();

            // Remove the guest cart after merging
            await CartModel.findOneAndDelete({ guestId });

            // Return the response
            res.status(200).json({
                success: true,
                message: "Merged cart successfully",
                data: userCart
            });
        }

        // If user cart doesn't exists
        else {
            // Create a new user cart using guest cart
            const newUserCart = await CartModel.create({
                user: userId,
                restaurant: guestCart.restaurant,
                cartItems: guestCart.cartItems,
                totalPrice: guestCart.totalPrice
            });

            // Remove the guest cart after creating new user cart
            await CartModel.findOneAndDelete({ guestId });

            // Return the response
            res.status(200).json({
                success: true,
                message: "Created user cart successfully",
                data: newUserCart
            });
        }
    } else {
        // Guest cart has already been merged, return the user cart
        if (userCart) {
            res.status(200).json({
                success: true,
                message: "Fetched cart successfully",
                data: userCart
            });
        } else {
            // If the guest cart doesn't exists
            throw new ErrorHandler("Guest cart not found", 404);
        }
    }
});

export { addToCart, deleteItemFromCart, updateCartItemQuantity, cartDetails, mergeCartDetails };
