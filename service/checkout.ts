import checkout from "../model/order";
import { CheckoutRequest } from "../type";

export const checkoutService = async (data: CheckoutRequest, userId: string) => {
    try {
        const response = await checkout.create({
            ...data,
            createdId: userId as string,
        })
        console.log({ response })
        return response;
    } catch (error: any) {
        throw error
    }
}