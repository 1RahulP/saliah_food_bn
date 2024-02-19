import express from "express";
import CouponController from "../../controller/coupon/index";
const router = express.Router();

router.post("/coupons", CouponController.createCoupon);
router.get("/coupons", CouponController.getAllCoupons);
router.get("/coupons/:id", CouponController.getCouponById);
router.put("/coupons/:id", CouponController.updateCoupon);
router.delete("/coupons/:id", CouponController.deleteCoupon);
