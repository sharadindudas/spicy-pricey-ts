import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

interface User extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "user" | "admin";
    validatePassword: (password: string) => Promise<boolean>;
    generateJWT: () => string;
}

const userSchema: Schema<User> = new Schema(
    {
        name: String,
        email: String,
        phone: String,
        password: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    { timestamps: true, versionKey: false }
);

// Hash the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Validate the password
userSchema.methods.validatePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

// Generate jwt
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export const UserModel = model<User>("User", userSchema);
