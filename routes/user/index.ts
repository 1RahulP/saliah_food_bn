import { Router } from "express";
import { handleCheckoutController, handleOrderController, handleSigninController, handleSignupController, paymentVerification } from "../../controller/user";
import { isUser } from "../../middleware";
const router = Router();

router.post("/signup", handleSignupController)
router.post("/signin", handleSigninController)

router.post("/order", handleOrderController)

router.post("/checkout", handleCheckoutController)
router.route("/payment-verification").post(paymentVerification);


export default router;