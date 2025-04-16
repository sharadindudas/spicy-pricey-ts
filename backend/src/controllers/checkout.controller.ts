import { Request, Response } from "express";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { ApiResponse, User } from "../@types/types";
import { CheckoutModel } from "../models/checkout.model";

// Create new checkout
const addCheckout = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    // Get logged in user's id
    const { _id: userId } = req.user as User;

    // Validation of data
    if (!checkoutItems || checkoutItems.length === 0) {
        throw new ErrorHandler("No items in checkout", 400);
    }

    // Create a new checkout
    const newCheckout = await CheckoutModel.create({
        user: userId,
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        paymentStatus: "Pending",
        isPaid: false
    });
    console.log(`Checkout created for user: ${userId}`);

    // Return the response
    res.status(201).json({
        success: true,
        message: "Created new checkout successfully",
        data: newCheckout
    });
});

// Update checkout to mark as paid after successful payment
const updateCheckoutPaymentStatus = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get data from request body and params
    const { paymentStatus, paymentDetails } = req.body;
    const { id: checkoutId } = req.params;

    // Check if the checkout exists in the db or not
    const checkoutExists = await CheckoutModel.findById(checkoutId);
    if (!checkoutExists) {
        throw new ErrorHandler("Checkout does not exists", 404);
    }

    // If the payment status is paid
    if (paymentStatus === "paid") {
        checkoutExists.isPaid = true;
        checkoutExists.paidAt = new Date(Date.now());
        checkoutExists.paymentStatus = paymentStatus;
        checkoutExists.paymentDetails = paymentDetails;

        // Update the checkout details
        await checkoutExists.save();

        // Return the response
        res.status(200).json({
            success: true,
            message: "Updated checkout successfully",
            data: checkoutExists
        });
    }

    // If the payment status is something else
    else {
        throw new ErrorHandler("Invalid payment status", 400);
    }
});

export { addCheckout, updateCheckoutPaymentStatus };
