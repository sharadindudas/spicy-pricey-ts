import express from "express";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notfoundMiddleware } from "./middlewares/notfound.middleware";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use(errorMiddleware);
app.use(notfoundMiddleware);

export default app;
