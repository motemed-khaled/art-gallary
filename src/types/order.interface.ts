import mongoose from "mongoose";

export interface Order {
    user: mongoose.Schema.Types.ObjectId;
    cartItems: {
        product: mongoose.Schema.Types.ObjectId,
        quantity: number,
        price: number
    }[];
    shippingAdress: string;
    shippingPrice: number;
    totalOrederPrice: number;
    paymentMethod: string;
    isPaid: boolean;
    paidAt: Date;
    isDeliverd: boolean;
    deliverdAt: Date;
}

export interface OrderDocument extends Order, Document {
}