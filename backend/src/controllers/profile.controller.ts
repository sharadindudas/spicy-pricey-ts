import { Request, Response } from "express";
import { ApiResponse, User } from "../@types/types";
import { AsyncHandler } from "../utils/handlers";

// View profile
const viewProfile = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // Get logged in user's data
    const loggedInUser = req.user as User;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched user profile successfully",
        data: loggedInUser
    });
});

export { viewProfile };
