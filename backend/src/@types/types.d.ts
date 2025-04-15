export interface ApiResponse {
    success: boolean;
    message: string;
    data?: unknown;
}

export interface DecodedPayload {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            decoded: DecodedPayload;
        }
    }
}
