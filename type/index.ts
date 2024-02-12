interface OrderSummary {
    name: string;
    size: string;
    qty: number;
    amount: number;
    shipping: number;
    subTotal: number;
    total: number;
}

export interface CheckoutRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    pincode: number;
    street: string;
    apartment: string;
    notes: string;
    orderSummary: OrderSummary;
}
