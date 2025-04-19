import { Router } from "express";
import { addToCart, removeCartItem, updateItemQuantity, getCartDetails, mergeGuestCart } from "../controllers/cart.controller";
import { userAuth } from "../middlewares/auth.middleware";

const cartRouter = Router();
cartRouter.post("/add", addToCart);
cartRouter.delete("/remove", removeCartItem);
cartRouter.put("/update", updateItemQuantity);
cartRouter.get("/fetch", getCartDetails);
cartRouter.post("/merge", userAuth, mergeGuestCart);

export default cartRouter;
