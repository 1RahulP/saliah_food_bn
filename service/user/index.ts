import user from "../../model/user";
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

export const signupService = async (
    name: string,
    email: string,
    password: string,
    phone: string,
) => {

    // GET THE HASHED PASSWORD 
    const hashedPassword = await bcryptjs.hash(password, 10);
    const payload = {
        name,
        email,
        phone,
        password: hashedPassword,
    }

    const newUser = new user({
        ...payload,
    })
    await newUser.save()
    return newUser;
};

export const signJWT = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY as any, {
        expiresIn: "7d",
    });
};

export const verifyJWT = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY as any);
};