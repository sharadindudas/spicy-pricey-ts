import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { FRONTEND_URL } from "./config/config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notfoundMiddleware } from "./middlewares/notfound.middleware";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "OPTIONS"]
    })
);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use(errorMiddleware);
app.use(notfoundMiddleware);

export default app;
