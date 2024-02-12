import { Request, Response } from "express";
import { signJWT, signupService } from "../../service/user";
import user from "../../model/user";
import { CheckoutRequest } from "../../type";
import { checkoutService } from "../../service/checkout";
import { instance } from "../..";
import crypto from "crypto";
import { Payment } from "../../model/paymentModel";
const bcryptjs = require("bcryptjs")

export const handleSignupController = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body;
        console.log(req.body);
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        const [userEmail, userPhone] = await Promise.all([user.findOne({ email }), user.findOne({ phone })]);
        if (userEmail) return res.status(400).json({ success: false, message: "Account already exists with this email" });
        if (userPhone) return res.status(400).json({ success: false, message: "Account already exists with this number" });
        const response = await signupService(name, email, password, phone,);
        console.log({ response });
        res.json({ response })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const handleSigninController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const existingUser = await user.findOne({ email });
        if (!existingUser || !(await bcryptjs.compare(password, existingUser.password))) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        const payload = {
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser?.role,
                expiresIn: process.env.LOGIN_EXPIRATION
            }
        };
        const token = signJWT(payload);
        res.json({ success: true, name: existingUser.name, email: existingUser.email, token });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const handleOrderController = async (req: Request, res: Response) => {
    try {
        // const existingUser = req?.user?.id;
        const existingUser = "65c9c80584259f8129dad481";
        console.log("Working fine by using token", { existingUser })
        const data: CheckoutRequest = req.body;
        console.log({ data })
        const response = await checkoutService(data, existingUser)
        console.log({ response })
        res.json({ response })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
export const handleCheckoutController = async (req: Request, res: Response) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        console.log({ order })
        res.status(200).json({ success: true, order })
    } catch (error) {
        console.log({ error })
    }
}

export const paymentVerification = async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log({ razorpay_order_id }, { razorpay_payment_id }, { razorpay_signature })
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log({ body })

    const key = process.env.RAZORPAY_API_SECRET as string

    const expectedSignature = crypto
        .createHmac("sha256", key)
        .update(body.toString())
        .digest("hex");
    console.log({ expectedSignature });

    if (!razorpay_signature) {
        console.error("razorpay_signature is undefined or not set.");
    } else {
        const isAuthentic = expectedSignature === razorpay_signature;
        console.log({ isAuthentic });
        if (isAuthentic) {
            await Payment.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });
            res.redirect(
                `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}` // This is the frontend url...
            );
        } else {
            res.status(400).json({
                success: false,
            });
        }
    }

};


