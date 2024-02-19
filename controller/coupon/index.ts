import { Request, Response } from "express";
import Coupon from "../../model/couponModel";

class CouponController {
  async createCoupon(req: Request, res: Response) {
    try {
      const {
        code,
        expiryDate,
        maxUses,
        discountPercentage,
        maxDiscountAmount,
      } = req.body;
      const coupon = new Coupon({
        code,
        expiryDate,
        maxUses,
        discountPercentage,
        maxDiscountAmount,
      });
      await coupon.save();
      res.status(201).send(coupon);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  async getAllCoupons(req: Request, res: Response) {
    try {
      const coupons = await Coupon.find();
      res.send(coupons);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  async getCouponById(req: Request, res: Response) {
    try {
      const coupon = await Coupon.findById(req.params.id);
      if (!coupon) {
        return res.status(404).send("Coupon not found");
      }
      res.send(coupon);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  async updateCoupon(req: Request, res: Response) {
    try {
      const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!coupon) {
        return res.status(404).send("Coupon not found");
      }
      res.send(coupon);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  async deleteCoupon(req: Request, res: Response) {
    try {
      const coupon = await Coupon.findByIdAndDelete(req.params.id);
      if (!coupon) {
        return res.status(404).send("Coupon not found");
      }
      res.send("Coupon deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
}


export default new CouponController();