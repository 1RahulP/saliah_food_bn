type OrderItem = {
    name: string;
    size: string;
    qty: number;
    amount: number;
    shipping: number;
    subTotal: number;
    total: number;
};

type OrderRequest = {
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
    orderSummary: OrderItem[];
    status: string;
};

