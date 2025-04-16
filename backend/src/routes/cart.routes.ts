import { Router } from "express";
import { addToCart, updateCartItemQuantity, deleteCartItem, allCartDetails, mergeGuestCart } from "../controllers/cart.controller";
import { userAuth } from "../middlewares/auth.middleware";

const cartRouter = Router();
cartRouter.post("/add", addToCart);
cartRouter.put("/update", updateCartItemQuantity);
cartRouter.delete("/delete", deleteCartItem);
cartRouter.get("/fetch", allCartDetails);
cartRouter.post("/merge", userAuth, mergeGuestCart);

export default cartRouter;
