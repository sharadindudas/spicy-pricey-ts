export interface ApiResponse {
    success: boolean;
    message: string;
    data?: unknown;
}

export interface DecodedPayload {
    _id: string;
    role: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

declare global {
    namespace Express {
        interface Request {
            decoded: DecodedPayload;
            user: User;
        }
    }
}
