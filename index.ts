import "dotenv/config";
import express, { Express } from 'express'
import { createServer } from "http";
import { databaseConnect } from "./config/database";
const cors = require('cors')
const cookieParser = require('cookie-parser')
import singupRoutes from './routes/user'
import Razorpay from "razorpay";
import path from "path";
require('dotenv').config();


// INITIALIZING EXPREESS

const app: Express = express();
const server = createServer(app);
const port = process.env.PORT;

app.use(express.json());

databaseConnect();

// MIDDLEWARES
app.disable("x-powered-by");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ALLOWED_DOMAINS?.split(" "),
    optionsSuccessStatus: 200,
  })
);

require('dotenv').config({ path: '.env', override: true });
app.use('/profile', express.static(path.join(__dirname, 'uploads')));



//ROUTES
app.get("/", (req, res) => {
  res.status(200).json({ name: "Api Worked Fine" });
});
app.get("/api", (req, res) => {
  res.status(200).json({ name: "Hello World! 2" });
});

app.use("/api", singupRoutes);
app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);


export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY as string,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// PORT LISTEN
export const demo = server.listen(port, () => {
  console.log(`Server Runnig http://localhost:${port}`);
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CALL FROM FRONTEND >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// const checkoutHandler = async (amount) => {
//   const { data: { key } } = await axios.get("http://localhost:4000/api/getkey")
//   const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
//     amount
//   })
//   const options = {
//     key,
//     amount: order.amount,
//     currency: "INR",
//     name: "Developer by Aasif Aahaan",
//     description: "Tutorial of RazorPay",
//     order_id: order.id,
//     callback_url: "http://localhost:4000/api/paymentverification",
//     prefill: {
//       name: "Aasif Aahaan",
//       email: "aasifalvi8@gmail.com",
//       contact: "9897097503"
//     },
//     notes: {
//       "address": "Razorpay Corporate Office"
//     },
//     theme: {
//       "color": "#121212"
//     }
//   };
//   const razor = new window.Razorpay(options);
//   razor.open();
// }