import { Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse } from "../@types/types";
import {
    AddToCartSchema,
    AddToCartSchemaType,
    DeleteCartItemSchema,
    DeleteCartItemSchemaType,
    AllCartDetailsSchema,
    AllCartDetailsSchemaType,
    UpdateCartItemQuantitySchema,
    UpdateCartItemQuantitySchemaType
} from "../schemas/cart.schema";
import { CartModel } from "../models/cart.model";

// Helper function to get the cart data of logged in user or guest
const getCartData = async (userId: string | undefined, guestId: string | undefined) => {
    if (userId) return await CartModel.findOne({ user: userId });
    else if (guestId) return await CartModel.findOne({ guestId });
    else return null;
};

// @route POST /api/cart/add
// @desc Add cart item for logged in user or guest
// @access public
const AddToCart = AsyncHandler(async (req, res: Response<ApiResponse>) => {
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

// @route PUT /api/cart/update
// @desc Update cart item quantity in the cart for logged in user or guest
// @access public
const UpdateCartItemQuantity = AsyncHandler(async (req, res: Response<ApiResponse>) => {
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

// @route DELETE /api/cart/delete
// @desc Delete cart item for logged in user or guest
// @access public
const DeleteCartItem = AsyncHandler(async (req, res: Response<ApiResponse>) => {
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

// @route GET /api/cart/fetch
// @desc Get logged in user or guest user's cart details
// @access public
const AllCartDetails = AsyncHandler(async (req, res: Response<ApiResponse>) => {
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

export { AddToCart, UpdateCartItemQuantity, DeleteCartItem, AllCartDetails };
