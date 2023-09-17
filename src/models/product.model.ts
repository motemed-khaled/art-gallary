import mongoose from "mongoose";
import { ProductDocument } from "../types/product.interface";
import { ReviewDocument } from "../types/review.interface";
import { reviewModel } from "./review.model";

const productSchema = new mongoose.Schema<ProductDocument>({
    name: {
        type: String,
        required: [true, "product name required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "product description required"],
    },
    price: {
        type: Number,
        required: [true, "product price required"]
    },
    stock: {
        type: Number,
        required: [true, "product stock required"]
    },
    image: {
        type: String,
        required: [true, "product image required"]
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "product must belong to category"]
    },
    ratingsAverage: {
        type: Number,
        default:0
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default:0
    },
    view: {
        type: Number,
        default:0
    },
    fav:{
        type:Boolean,
        default:false
    }
}, { timestamps: true  ,toObject: { virtuals: true },
toJSON: { virtuals: true},});

productSchema.virtual("reviews", {
    ref: "reviews",
    foreignField: "product",
    localField: "_id",
    justOne: false, // Set justOne to false to return an array of reviews
});

const setImageUrl = (doc: ProductDocument) => {
    if (doc.image) {
        const imgUrl = `${process.env.BASE_URL}/product/${doc.image}`
        doc.image = imgUrl;
    }
};

productSchema.post("save", (doc) => {
    setImageUrl(doc)
});

productSchema.post("init", (doc) => {
    setImageUrl(doc)
});

export const productModel = mongoose.model<ProductDocument>("products", productSchema);