import { NextFunction, Request, Response } from "express";
import { signJWT, signupService } from "../../service/user";
import User from "../../model/user";
import { orderService } from "../../service/order";
import { instance } from "../..";
import crypto from "crypto";
import { Payment } from "../../model/paymentModel";
import { upload } from "../../helper/multer";
const bcryptjs = require("bcryptjs");
import * as fs from "fs";

export const handleSignupController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const [userEmail, userPhone] = await Promise.all([
      User.findOne({ email }),
      // User.findOne({ phone }),
    ]);
    if (userEmail)
      return res.status(400).json({
        success: false,
        message: "Account already exists with this email",
      });
    // if (userPhone)
    //   return res.status(400).json({
    //     success: false,
    //     message: "Account already exists with this number",
    //   });
    const response = await signupService(name, email, password, phone);

    const payload = {
      user: {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response?.role,
        expiresIn: process.env.LOGIN_EXPIRATION,
      },
    };
    const token = signJWT(payload);
    const user = {
      name: response.name,
      email: response.email,
      role: response?.role,
    };
    res.cookie("SALIAH_FOODS_TOKEN", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({ response, token: token, success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const handleEmailExist = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userEmail = await User.findOne({ email: email });

    if (userEmail) {
      return res.status(400).json({
        success: false,
        message: "Account already exists with this email",
      });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Email is available" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleUserProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error uploading files." });
      }
      const uploadedFiles = req.files as Express.Multer.File[];
      const profile = uploadedFiles.map(
        (file) => `${process.env.BASE_URL}/profile/${file.filename}`
      );
      try {
        await Promise.all(
          profile.map(async (filePath) => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          })
        );
        const url = profile[0];
        return res.json({
          success: true,
          message: "Files uploaded successfully.",
          response: url,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: "Error handling files." });
      }
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const handleSigninController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (
      !existingUser ||
      !(await bcryptjs.compare(password, existingUser.password))
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const payload = {
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser?.role,
        expiresIn: process.env.LOGIN_EXPIRATION,
      },
    };
    const token = signJWT(payload);
    const user = {
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser?.role,
    };
    res
      .cookie("SALIAH_FOODS_TOKEN", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .send({
        success: true,
        user,
        token: token,
      });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleLogoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleAuthController = async (req: Request, res: Response) => {
  try {
    res.json({ loggedIn: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleOrderController = async (req: Request, res: Response) => {
  try {
    const existingUser = req?.user;
    if (existingUser) {
      const data: OrderRequest = req.body;

      // const response = await orderService(data, existingUser?.id);
      res.json({ response: data });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const handleCheckoutController = async (req: Request, res: Response) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
      receipt: "order_rcptid_" + Math.floor(Math.random() * 1000),
      payment_capture: 1,
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log({ error });
  }
};

// Function to verify webhook signature ...
export const paymentVerification = async (req: Request, res: Response) => {
  const existingUser = req.body?.id;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, event } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const webhookSecret = process.env.RAZORPAY_API_SECRET as string;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body.toString())
    .digest("hex");

  if (!razorpay_signature) {
    console.error("razorpay_signature is undefined or not set.");
    return res
      .status(400)
      .json({ success: false, message: "razorpay_signature is missing" });
  }

  // Verify webhook signature
  const isAuthentic = expectedSignature === razorpay_signature;
  if (!isAuthentic) {
    console.error("Webhook signature verification failed");
    return res.status(403).json({
      success: false,
      message: "Webhook signature verification failed",
    });
  } else {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      createdId: existingUser,
    });
    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}` // This is the frontend url...
    );
  }

  // Process payment events
  // if (event === 'payment.authorized') {
  //     console.log('Payment authorized:', razorpay_payment_id);
  // } else if (event === 'payment.captured') {
  //     console.log('Payment captured:', razorpay_payment_id);
  // } else {
  //     console.log('Received payment event:', event);
  // }

  // Respond with success status
  res.status(200).json({ success: true });
};

// export const paymentVerification = async (req: Request, res: Response) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     console.log({ razorpay_order_id }, { razorpay_payment_id }, { razorpay_signature })
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     console.log({ body })

//     const webhookSecret  = process.env.RAZORPAY_API_SECRET as string

//     const expectedSignature = crypto
//         .createHmac("sha256", webhookSecret )
//         .update(body.toString())
//         .digest("hex");
//     console.log({ expectedSignature });

//     if (!razorpay_signature) {
//         console.error("razorpay_signature is undefined or not set.");
//     } else {
//         const isAuthentic = expectedSignature === razorpay_signature;
//         console.log({ isAuthentic });
//         if (isAuthentic) {
//             await Payment.create({
//                 razorpay_order_id,
//                 razorpay_payment_id,
//                 razorpay_signature,
//             });
//             res.redirect(
//                 `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}` // This is the frontend url...
//             );
//         } else {
//             res.status(400).json({
//                 success: false,
//             });
//         }
//     }

// };

// LIVE MODE RAZORPAY CODE ...

// const RazorpayPayment = ({ productName, productAmount, productQuantity }) => {
//     const handlePayment = async () => {
//         const options = {
//             key: 'YOUR_LIVE_RAZORPAY_API_KEY', // Replace with your live Razorpay API key
//             amount: productAmount * productQuantity * 100, // Total amount in paise
//             currency: 'INR',
//             name: productName,
//             description: `${productQuantity} ${productName}(s) Purchase`,
//             image: 'https://example.com/logo.png', // Replace with your company logo URL
//             handler: function (response) {
//                 alert('Payment successful: ' + response.razorpay_payment_id);
//             },
//             prefill: {
//                 name: 'John Doe', // You can dynamically pass user information here
//                 email: 'john@example.com',
//                 contact: '9876543210'
//             },
//             theme: {
//                 color: '#528FF0' // Customize the theme color as per your preference
//             }
//         };

//         const razorpay = new Razorpay(options);
//         razorpay.open();
//     };

//     return (
//         <div>
//         <button onClick= { handlePayment } > Pay with Razorpay < /button>
//         < /div>
//     );
// };

// export default RazorpayPayment;
