import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { viewProfile } from "../controllers/profile.controller";

const profileRouter = Router();
profileRouter.get("/view", userAuth, viewProfile);

export default profileRouter;
