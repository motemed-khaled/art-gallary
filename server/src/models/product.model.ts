import mongoose from "mongoose";
import { ProductDocument } from "../types/product.interface";

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
        min: [1, "Rating must be equal or above 1.0"],
        max: [5, "Rating must be equal or below 5.0"],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

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