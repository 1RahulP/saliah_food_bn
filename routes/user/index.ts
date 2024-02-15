import { Router } from "express";
import { handleAuthController, handleCheckoutController, handleLogoutController, handleOrderController, handleSigninController, handleSignupController, handleUserProfileController, paymentVerification } from "../../controller/user";
import { isUser } from "../../middleware";
const router = Router();

router.post("/signup", handleSignupController)
router.post("/signin", handleSigninController)
router.post('/profile', handleUserProfileController)


router.post("/logout", handleLogoutController)

router.get("/check", isUser, handleAuthController)

router.post("/  ", isUser, handleOrderController)

// RAZORPAY PAYMENT GATEWAY ... 
router.post("/checkout", isUser, handleCheckoutController)
router.route("/payment-verification").post(isUser, paymentVerification);


export default router;