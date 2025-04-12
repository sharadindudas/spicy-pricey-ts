import { AsyncHandler, ErrorHandler } from "../utils/handlers";
import { UserModel } from "../models/user.model";
import { LoginSchema, SignupSchema } from "../schemas/auth.schema";
import { RequestHandler } from "express";

// Signup
const signup = AsyncHandler(async (req, res) => {
    // Get data from request body
    const signupData = req.body;

    // Validation of data
    const validatedData = await SignupSchema.validate(signupData, { abortEarly: false, stripUnknown: true });

    // Get the validated data
    const { name, email, phone, password } = validatedData;

    // Check if the user already exists in the db or not
    const userExists = await UserModel.findOne({
        $or: [{ email }, { phone }]
    });
    if (userExists) {
        throw new ErrorHandler("User already exists", 409);
    }

    // Create new user
    const newUser = await UserModel.create({
        name,
        email,
        phone,
        password
    });

    // Remove sensitive data
    newUser.password = undefined!;

    // Return the response
    res.status(201).json({
        success: true,
        message: "Registered successfully",
        data: newUser
    });
});

// Login
const login = AsyncHandler(async (req, res) => {
    // Get data from request body
    const loginData = req.body;

    // Validation of data
    const validatedData = await LoginSchema.validate(loginData, { abortEarly: false, stripUnknown: true });

    // Get the validated data
    const { identity, password } = validatedData;

    // Check if the user exists in the db or not
    const userExists = await UserModel.findOne({
        $or: [{ email: identity }, { phone: identity }]
    });
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Validate the password
    const isValidPassword = await userExists.validatePassword(password);
    if (!isValidPassword) {
        throw new ErrorHandler("Invalid Credentials", 401);
    }

    // Generate jwt
    const token = userExists.generateJWT();

    // Remove sensitive data
    userExists.password = undefined!;

    // Set the cookie and return the response
    res.cookie("spicyPriceyToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
        .status(200)
        .json({
            success: true,
            message: "Logged in successfully",
            data: userExists
        });
});

// Logout
const logout: RequestHandler = async (_req, res) => {
    // Remove the cookie and return the response
    res.clearCookie("spicyPriceyToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
        .status(200)
        .json({
            success: true,
            message: "Logged out successfully"
        });
};

export { signup, login, logout };
