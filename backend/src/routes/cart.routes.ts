import { Router } from "express";
import { AddToCart, UpdateCartItemQuantity, DeleteCartItem, AllCartDetails } from "../controllers/cart.controller";

const cartRouter = Router();
cartRouter.post("/add", AddToCart);
cartRouter.put("/update", UpdateCartItemQuantity);
cartRouter.delete("/delete", DeleteCartItem);
cartRouter.get("/fetch", AllCartDetails);

export default cartRouter;
