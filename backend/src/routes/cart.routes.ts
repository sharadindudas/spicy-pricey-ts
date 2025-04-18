import { Router } from "express";
import { addToCart, cartDetails, deleteItemFromCart, mergeCartDetails, updateCartItemQuantity } from "../controllers/cart.controller";
import { userAuth } from "../middlewares/auth.middleware";

const cartRouter = Router();
cartRouter.post("/add", addToCart);
cartRouter.delete("/remove", deleteItemFromCart);
cartRouter.put("/update", updateCartItemQuantity);
cartRouter.get("/fetch", cartDetails);
cartRouter.post("/merge", userAuth, mergeCartDetails);

export default cartRouter;
