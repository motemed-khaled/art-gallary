import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import stripe, { Stripe } from "stripe";


import { ExpressReq } from "../types/expressReq.interface";
import { orderModel } from './../models/order.model';
import { ApiError } from "../utils/apiError";
import { cartModel } from "../models/cart.model";
import { productModel } from "../models/product.model";
import { getAll, getOne } from "./handlers.controller";
import { userModel } from "../models/user.model";



export const createCashOrder = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    
    // app setting
    const shippingPrice = req.body.shippingPrice || 0;


    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        next(new ApiError("no cart for this user", 404));
        return;
    }

    const order = await orderModel.create({
        cartItems: cart.cartItems,
        user: req.user._id,
        shippingAdress: req.user.address,
        totalOrederPrice: cart.totalPrice + shippingPrice,
        shippingPrice:shippingPrice
    });

    if (order) {

        const bulkOptions = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stock: -item.quantity, sold: +item.quantity } }
            },
        }));

        await productModel.bulkWrite(bulkOptions, {});
        await cartModel.findOneAndDelete({ user: req.user._id });
    }

    res.status(200).json({ status: "success", data: order });
});

export const filterOrderByCurrentUser = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    let filterObj = {};
    if (req.user.role === "user") {
        filterObj={user:req.user._id}
    }
    req.filterObj = filterObj;
    next();
});

export const getAllOrder = getAll(orderModel);

export const getSpecificOrderCheck = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    if (req.user.role === "user") {
        const order = await orderModel.find({ user: req.user._id });
        const specificOrder = order.filter(order => order._id.toString() == req.params.id);
        if (specificOrder.length<1) {
            next(new ApiError("you not owner for this order", 404));
            return;
        }
    };
    next();
});

export const getSpecificOrder = getOne(orderModel);

export const updateIsPaid =  asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
        next(new ApiError("no order in this id", 404));
        return;
    }

    order.isPaid = true;
    order.paidAt = new Date(Date.now());
    const updatedOrder = await order.save();
    res.status(200).json({ status: "success", data: updatedOrder });
});

export const updateIsDeliverd =  asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
        next(new ApiError("no order in this id", 404));
        return;
    }

    order.isDeliverd = true;
    order.deliverdAt = new Date(Date.now());
    const updatedOrder = await order.save();
    res.status(200).json({ status: "success", data: updatedOrder });
});

// create stripe session
export const checkOutSession =  asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {

    // app setting 
    const shippingPrice = req.body.shippingPrice || 0;

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        next(new ApiError("no cart in for this user", 404));
        return;
    }

    const totalOrderPrice = cart.totalPrice + shippingPrice;

    const stripe = new Stripe(process.env.STRIPE_SECRET , {
        apiVersion:"2023-08-16"
    });
    
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: "egp",
                unit_amount: totalOrderPrice * 100,
                product_data: {
                    name: req.user.name,
                }
            },
            quantity: 1
        }],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get("host")}/orders`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        metadata: {
            address: req.user.address,
            cartId: cart._id.toString(),
            shippingPrice:shippingPrice
        }
    });
    console.log(req.user._id)
    res.status(200).json({ status: "success", session });
});

const createOnlineOrder = async (session: any, req: ExpressReq) => {
    
    const metaData = session.metadata;
    const orderPrice = session.amount_total / 100;
    const userEmail = session.customer_email;

    const cart = await cartModel.findById(metaData.cartId);
    const user = await userModel.findOne({email:userEmail})

    const order = await orderModel.create({
        cartItems: cart.cartItems,
        user: user._id,
        shippingAdress: metaData.address,
        totalOrederPrice:orderPrice,
        shippingPrice: metaData.shippingPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethod:"card"
    });

    if (order) {

        const bulkOptions = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stock: -item.quantity, sold: +item.quantity } }
            },
        }));

        await productModel.bulkWrite(bulkOptions, {});
        await cartModel.findOneAndDelete({ user: req.user._id });
    }
}

export const webHookCheckOut =  asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET , {
        apiVersion:"2023-08-16"
    });
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_STRIPE_SECRET);
    } catch (err:any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    
    if (event.type === "checkout.session.completed") {
        createOnlineOrder(event.data.object , req);
    }
    res.status(200).json({ recieved: true });
});