import express from "express";
import authRouter from "./routes/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notfoundMiddleware } from "./middlewares/notfound.middleware";

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

app.use(errorMiddleware);
app.use(notfoundMiddleware);

export default app;
