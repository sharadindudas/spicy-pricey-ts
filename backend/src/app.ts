import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { FRONTEND_URL } from "./config/config";

// Middleware imports
import { errorMiddleware } from "./middlewares/error.middleware";
import { notfoundMiddleware } from "./middlewares/notfound.middleware";

// Route imports
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";
import cartRouter from "./routes/cart.routes";

// Express initialization
const app = express();

// Global middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
    })
);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests from this IP, please try again later"
    })
);

// Api routes
app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/cart", cartRouter);

// Error handling middleware
app.use(errorMiddleware);
app.use(notfoundMiddleware);

export default app;
