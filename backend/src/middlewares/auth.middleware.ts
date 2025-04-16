import { JWT_SECRET } from "../config/config";
import { DecodedPayload, User } from "../@types/types";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

export const userAuth = AsyncHandler(async (req, _res, next) => {
    // Get token from request cookies
    const { spicyPriceyToken } = req.cookies;

    // Validation of token
    if (!spicyPriceyToken) {
        throw new ErrorHandler("Please login to continue", 401);
    }

    // Decode the token
    const decodedPayload = jwt.verify(spicyPriceyToken, JWT_SECRET) as DecodedPayload;

    // Get the user details
    const user = (await UserModel.findById(decodedPayload._id)) as User;
    if (!user) {
        throw new ErrorHandler("User does not exists", 404);
    }
    // Pass the decoded payload and user data
    req.decoded = decodedPayload;
    req.user = user;

    // Move to next handler function
    next();
});
