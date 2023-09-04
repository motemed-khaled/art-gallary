import mongoose from "mongoose";
import { OrderDocument } from "../types/order.interface";


export const orderSchema = new mongoose.Schema<OrderDocument>({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number
            },
            price: {
                type: Number
            }
        }
    ],
    shippingAdress: {
        type: String
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    totalOrederPrice: {
        type: Number
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card"],
        default: "cash"
    },
    isPaid: {
        type: Boolean,
        default:false
    },
    paidAt: Date,
    isDeliverd: {
        type: Boolean,
        default:false
    },
    deliverdAt: Date
}, { timestamps: true });


export const orderModel = mongoose.model("orders", orderSchema);