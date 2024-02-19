import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the coupon document
export interface CouponDocument extends Document {
  code: string;
  expiryDate: Date;
  maxUses: number;
  discountPercentage: number;
  maxDiscountAmount: number;
}

// Define the schema for the coupon
const couponSchema = new Schema<CouponDocument>({
  code: { type: String, required: true, unique: true },
  expiryDate: { type: Date, required: true },
  maxUses: { type: Number, required: true, default: 1 },
  discountPercentage: { type: Number, required: true },
  maxDiscountAmount: { type: Number, required: true },
});


// Create the model
const Coupon = mongoose.model<CouponDocument>("Coupon", couponSchema);

export default Coupon;
