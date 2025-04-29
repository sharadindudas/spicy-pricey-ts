import { Request, Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import { CartModel } from "../models/cart.model";
import {
    AddToCartSchema,
    AddToCartSchemaType,
    RemoveCartItemSchema,
    RemoveCartItemSchemaType,
    UpdateItemQuantitySchema,
    UpdateItemQuantitySchemaType,
    CartDetailsSchema,
    CartDetailsSchemaType,
    MergeGuestCartSchema,
    MergeGuestCartSchemaType,
    CartItemSchemaType
} from "../schemas/cart.schema";

// Get cart details by logged in or guest user
const fetchCart = async (userId?: string, guestId?: string) => {
    if (userId) return await CartModel.findOne({ user: userId });
    if (guestId) return await CartModel.findOne({ guestId });
    return null;
};

// Calculate the total price of cart items
const calculateTotalPrice = (cartItems: CartItemSchemaType[]) => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// Calculate the total number of cart items
const calculateCartItemsCount = (cartItems: CartItemSchemaType[]) => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
};

// Reusable empty cart
const emptyCart = {
    restaurant: {},
    cartItems: [],
    cartItemsCount: 0,
    totalPrice: 0
};

// Add item to cart
const addToCart = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Validation of data
    const { userId, guestId, restaurant, cartItem } = await AddToCartSchema.validate(req.body as AddToCartSchemaType, {
        abortEarly: false,
        stripUnknown: true
    });

    // Get the cart details
    const cart = await fetchCart(userId, guestId);

    // If the cart exists, update it
    if (cart) {
        // Handle restaurant conflict
        if (cart.restaurant && cart.restaurant.id !== restaurant.id) {
            throw new ErrorHandler("Your cart cannot contain items from another restaurant", 409);
        }

        // Check if the cart item exists in the cart or not
        const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItem.id);

        // If the cart item doesn't exists, add it to cart
        if (cartItemIndex === -1) {
            cart.cartItems.push(cartItem);
        }
        // If the cart item already exists, update the quantity
        else {
            cart.cartItems[cartItemIndex].quantity += cartItem.quantity;
        }

        // Update the cart data
        cart.restaurant = restaurant;
        cart.cartItemsCount = calculateCartItemsCount(cart.cartItems as CartItemSchemaType[]);
        cart.totalPrice = calculateTotalPrice(cart.cartItems as CartItemSchemaType[]);

        // Save the cart data
        await cart.save();

        // Return the response
        res.status(200).json({
            success: true,
            message: "Item added to cart",
            data: cart
        });
    }

    // If the cart doesn't exists, create it
    else {
        // Generate the guest id
        const generatedGuestId = guestId || `guest_${new Date().getTime()}`;

        // Create a new cart
        const newCart = await CartModel.create({
            user: userId || undefined,
            guestId: userId ? undefined : generatedGuestId,
            restaurant,
            cartItems: [cartItem],
            cartItemsCount: cartItem.quantity,
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

// Remove item from cart
const removeCartItem = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Validation of data
    const { userId, guestId, cartItemId } = await RemoveCartItemSchema.validate(req.body as RemoveCartItemSchemaType, {
        abortEarly: false,
        stripUnknown: true
    });

    // Check if the cart exists in the db or not
    const cart = await fetchCart(userId, guestId);
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    }

    // Check if the cart item exists in the cart or not
    const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);
    if (cartItemIndex === -1) {
        throw new ErrorHandler("Cart item not found", 404);
    }
    // Delete the cart item
    cart.cartItems.splice(cartItemIndex, 1);

    // Check if the cart item is the last item or not
    if (cart.cartItems.length === 0) {
        // Reset the cart
        cart.restaurant = undefined;
        cart.cartItemsCount = 0;
        cart.totalPrice = 0;
    }

    // Calculate the total price and cart items count
    cart.totalPrice = calculateTotalPrice(cart.cartItems as CartItemSchemaType[]);
    cart.cartItemsCount = calculateCartItemsCount(cart.cartItems as CartItemSchemaType[]);

    // Save the cart data
    await cart.save();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: cart
    });
});

// Update item quantity on cart
const updateItemQuantity = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Validation of data
    const { userId, guestId, cartItemId, quantity } = await UpdateItemQuantitySchema.validate(req.body as UpdateItemQuantitySchemaType, {
        abortEarly: false,
        stripUnknown: true
    });

    // Check if the cart exists in the db or not
    const cart = await fetchCart(userId, guestId);
    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    }

    // Check if the cart item exists in the cart or not
    const cartItemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);
    if (cartItemIndex === -1) {
        throw new ErrorHandler("Cart item not found", 404);
    }

    if (quantity > 0) {
        // Increase the quantity
        cart.cartItems[cartItemIndex].quantity = quantity;
    } else {
        // Decrease the quantity
        cart.cartItems.splice(cartItemIndex, 1);

        // Check if the cart item is the last item or not
        if (cart.cartItems.length === 0) {
            cart.restaurant = undefined;
            cart.cartItemsCount = 0;
            cart.totalPrice = 0;
        }
    }

    // Recalculate the cart items count and total price
    if (cart.cartItems.length > 0) {
        cart.cartItemsCount = calculateCartItemsCount(cart.cartItems as CartItemSchemaType[]);
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

// Fetch cart details for logged in or guest user
const getCartDetails = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Validation of data
    const { userId, guestId } = await CartDetailsSchema.validate(req.query as CartDetailsSchemaType, { abortEarly: false, stripUnknown: true });

    // Get the cart details
    const cart = await fetchCart(userId, guestId);

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched cart successfully",
        data: cart ? cart : emptyCart
    });
});

// Merge guest cart into user cart
const mergeGuestCart = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Validation of data
    const { guestId } = await MergeGuestCartSchema.validate(req.body as MergeGuestCartSchemaType, { abortEarly: false, stripUnknown: true });

    // Get logged in user's id
    const { _id: userId } = req.user;

    // Get the user and guest cart
    const userCart = await CartModel.findOne({ user: userId }),
        guestCart = await CartModel.findOne({ guestId });

    // If the guest cart doesn't exists
    if (!guestCart || guestCart.cartItems.length === 0) {
        // Return the response
        res.status(200).json({
            success: true,
            message: userCart ? "Fetched user cart successfully" : "Fetched cart successfully",
            data: userCart || emptyCart
        });
        return;
    }

    // If the user cart doesn't exists
    if (!userCart) {
        // Create a new user cart with guest cart data
        const newUserCart = await CartModel.create({
            user: userId,
            restaurant: guestCart.restaurant,
            cartItems: guestCart.cartItems,
            cartItemsCount: guestCart.cartItemsCount,
            totalPrice: guestCart.totalPrice
        });

        // Remove the guest cart from db
        await CartModel.deleteOne({ guestId });

        // Return the response
        res.status(201).json({
            success: true,
            message: "Guest cart converted to user cart successfully",
            data: newUserCart
        });
    }

    // If user cart and guest cart exists
    else {
        // If user cart items is empty, replace the existing user cart with guest cart data
        if (userCart.cartItems.length === 0) {
            userCart.restaurant = guestCart.restaurant;
            userCart.cartItems = guestCart.cartItems;
            userCart.cartItemsCount = guestCart.cartItemsCount;
            userCart.totalPrice = guestCart.totalPrice;
        }

        // If different restaurant, replace the existing user cart with guest cart data
        else if (userCart.restaurant?.id !== guestCart.restaurant?.id) {
            userCart.restaurant = guestCart.restaurant;
            userCart.cartItems = guestCart.cartItems;
            userCart.cartItemsCount = guestCart.cartItemsCount;
            userCart.totalPrice = guestCart.totalPrice;
        }

        // If same restaurant, merge the guest cart with user cart
        else {
            // Merge the cart items from guest cart with user cart
            guestCart.cartItems.forEach((guestItem) => {
                // Check if the guest item already exists in user cart or not
                const guestItemIndex = userCart.cartItems.findIndex((userItem) => userItem.id === guestItem.id);

                // If the guest item doesn't exists, add it to user cart
                if (guestItemIndex === -1) {
                    userCart.cartItems.push(guestItem);
                }
                // If the guest item exists, update the quantity
                else {
                    userCart.cartItems[guestItemIndex].quantity += guestItem.quantity;
                }
            });

            // Calculate the total price and cart items count
            userCart.totalPrice = calculateTotalPrice(userCart.cartItems as CartItemSchemaType[]);
            userCart.cartItemsCount = calculateCartItemsCount(userCart.cartItems as CartItemSchemaType[]);
        }

        // Save the user cart data
        await userCart.save();

        // Remove the guest cart from db
        await CartModel.deleteOne({ guestId });

        // Return the response
        res.status(200).json({
            success: true,
            message: "Guest cart merged successfully",
            data: userCart
        });
    }
});

export { addToCart, removeCartItem, updateItemQuantity, getCartDetails, mergeGuestCart };
