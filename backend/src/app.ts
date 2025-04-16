import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { FRONTEND_URL } from "./config/config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notfoundMiddleware } from "./middlewares/notfound.middleware";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";
import cartRouter from "./routes/cart.routes";
import checkoutRouter from "./routes/checkout.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "OPTIONS"]
    })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);

app.use(errorMiddleware);
app.use(notfoundMiddleware);

export default app;
