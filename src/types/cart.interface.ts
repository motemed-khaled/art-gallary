import mongoose from "mongoose"

export interface Cart{
    cartItems: {
        product: mongoose.Schema.Types.ObjectId,
        quantity: number,
        price: number
    }[];
    totalPrice: number;
    user:mongoose.Schema.Types.ObjectId
};

export interface CartDocument extends Cart , Document{}