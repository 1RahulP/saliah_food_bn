import { Schema, model } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User",
    },
},
    { timestamps: true }
)

export default model<IUser>("users", userSchema);