import { Response } from "express";
import { ApiResponse, DecodedPayload } from "../@types/types";
import { UserModel } from "../models/user.model";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";

// View profile
const viewProfile = AsyncHandler(async (req, res: Response<ApiResponse>) => {
    // Get data from request decoded
    const { _id } = req.decoded as DecodedPayload;

    // Get the user details
    const loggedInUser = await UserModel.findById(_id).select("-password");
    if (!loggedInUser) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched user profile successfully",
        data: loggedInUser
    });
});

export { viewProfile };
