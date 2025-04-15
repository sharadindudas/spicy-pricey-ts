import { Router } from "express";
import { AddToCart } from "../controllers/cart.controller";

const cartRouter = Router();
cartRouter.post("/add", AddToCart);

export default cartRouter;
