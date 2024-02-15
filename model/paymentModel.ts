const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  createdId: { ref: "users", type: mongoose.Schema.Types.ObjectId }
});

export const Payment = mongoose.model("Payment", paymentSchema);
