import { JWT_SECRET } from "../config/config";
import { DecodedPayload } from "../@types/types";
import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import jwt from "jsonwebtoken";

export const userAuth = AsyncHandler(async (req, _res, next) => {
    // Get token from request cookies
    const { spicyPriceyToken } = req.cookies;

    // Validation of token
    if (!spicyPriceyToken) {
        throw new ErrorHandler("Please login to continue", 401);
    }

    // Decode the token
    const decodedPayload = jwt.verify(spicyPriceyToken, JWT_SECRET) as DecodedPayload;

    // Pass the decoded payload
    req.decoded = decodedPayload;

    // Move to next handler function
    next();
});
