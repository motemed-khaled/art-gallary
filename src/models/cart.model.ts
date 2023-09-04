import mongoose from "mongoose";
import { CartDocument } from "../types/cart.interface";

const cartSchema = new mongoose.Schema<CartDocument>({
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number
        }
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    totalPrice: {
        type: Number
    }
}, { timestamps: true });

export const cartModel = mongoose.model<CartDocument>("cart", cartSchema);