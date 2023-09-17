import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";


import { ExpressReq } from "../types/expressReq.interface";
import { productModel } from './../models/product.model';
import { cartModel } from './../models/cart.model';
import { CartDocument } from "../types/cart.interface";
import { ApiError } from "../utils/apiError";


const calcTotalPrice = (cart: CartDocument): number => {
    // calculate total cart price 
    let totalPrice = 0;
    cart.cartItems.forEach(ele =>
        totalPrice += ele.quantity * ele.price
    );
    return totalPrice
};

export const addProductToCart = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {

    const { productId } = req.body;
    const currentProduct = await productModel.findById(productId);
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        cart = await cartModel.create({
            cartItems: {
                product: productId,
                price: currentProduct.price,
            },
            user: req.user._id
        });
    } else {
        const existProduct = cart.cartItems.findIndex(pro => pro.product.toString() == productId);
        if (existProduct > -1) {
            cart.cartItems[existProduct].quantity += 1;
        } else {
            cart.cartItems.push({ product: productId, price: currentProduct.price, quantity: 1 });
        }
    }

    cart.totalPrice = calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({ status: "success", message: "product added to cart", cartLength: cart.cartItems.length, data: cart })
});

export const getLoggedUserCart = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const cart = await cartModel.findOne({ user: req.user._id }).populate({
        path: 'cartItems.product',
        select: 'name ratingsAverage price stock image',
    });
    
    if (!cart) {
        next(new ApiError("no cart for exist user", 404));
        return;
    }

    res.status(200).json({status:"success" , cartLength : cart.cartItems.length , data:cart})
});

export const deleteSpecificCart = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { cartItems: { product: req.params.id } }
        },
        { new: true }
    );

    cart.totalPrice = calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({ status: "success",message:"product removed from cart " ,cartLength: cart.cartItems.length, data: cart });

});

export const deleteUserCart = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const cart = await cartModel.findOneAndDelete({ user: req.user._id });
    res.status(204).send()
});

export const updateUserCartQuantity = asyncHandler(async (req: ExpressReq, res: Response, next: NextFunction) => {
    const { quantity } = req.body;
    const cart = await cartModel.findOne({ user: req.user._id }).populate({
        path: 'cartItems.product',
        select: ' name ratingsAverage price stock image',
    });
    if (!cart) {
        next(new ApiError("no cart for this user", 404));
        return;
    }

    const cartItemIndex = cart.cartItems.findIndex((pro:any) => pro.product._id.toString() === req.params.id);
    if (cartItemIndex > -1) {
        cart.cartItems[cartItemIndex].quantity = quantity;
    } else {
        next(new ApiError("no cart item in this id", 404));
        return;
    }

    cart.totalPrice = calcTotalPrice(cart);
    await cart.save();

    res.status(200).json({ status: "success", cartLength: cart.cartItems.length, data: cart });
});