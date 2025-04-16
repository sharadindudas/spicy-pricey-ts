import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware";
import { addCheckout, updateCheckoutPaymentStatus } from "../controllers/checkout.controller";

const checkoutRouter = Router();
checkoutRouter.post("/add", userAuth, addCheckout);
checkoutRouter.put("/:id/pay", userAuth, updateCheckoutPaymentStatus);

export default checkoutRouter;
