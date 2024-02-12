import { Schema, model } from "mongoose";
const mongoose = require("mongoose")


export interface ICheckout extends Document {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    country: string,
    state: string,
    city: string,
    pincode: number,
    street: string,
    apartment: string,
    notes: string,
    orderSummary: {
        name: string,
        size: string,
        qty: number,
        amount: number,
        shipping: number,
        subTotal: number,
        total: number
    },
    status: string,
    createdId: string
}

const checkoutSchema = new Schema<ICheckout>({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    pincode: {
        type: Number,
        required: false
    },
    street: {
        type: String,
        required: false
    },
    apartment: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    orderSummary: {
        name: {
            type: String,
            required: false
        },
        size: {
            type: String,
            required: false
        },
        qty: {
            type: Number,
            required: false
        },
        amount: {
            type: Number,
            required: false
        },
        shipping: {
            type: Number,
            required: false
        },
        subTotal: {
            type: Number,
            required: false
        },
        total: {
            type: Number,
            required: false
        }
    },
    status: {
        type: String,
        default: "Pending"
    },
    createdId: { ref: "users", type: mongoose.Schema.Types.ObjectId }
},
    { timestamps: true }
)

export default model<ICheckout>("checkout", checkoutSchema);