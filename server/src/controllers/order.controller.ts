import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";


import { ExpressReq } from "../types/expressReq.interface";
import { orderModel } from './../models/order.model';
import { ApiError } from "../utils/apiError";
import { cartModel } from "../models/cart.model";
import { productModel } from "../models/product.model";
import { getAll, getOne } from "./handlers.controller";



export const createCashOrder = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    
    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        next(new ApiError("no cart for this user", 404));
        return;
    }

    const order = await orderModel.create({
        cartItems: cart.cartItems,
        user: req.user._id,
        shippingAdress: req.user.address,
    });

    if (order) {
        order.totalOrederPrice = cart.totalPrice + order.shippingPrice;
        await order.save();

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