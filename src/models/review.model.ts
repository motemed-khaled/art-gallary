import mongoose from "mongoose";
import { ReviewDocument } from "../types/review.interface";
import { UserDocument } from "../types/user.interface";
import { productModel } from "./product.model";


const reviewSchema = new mongoose.Schema<ReviewDocument>({
    title: {
        type: String,
    },
    rating: {
        type: Number,
        min: [1, "min rating is 1.0"],
        max: [5, "max rating is 5.0"],
    },
    user: {
        type:mongoose.Schema.Types.ObjectId ,
        ref: "users",
        required: [true, "review must belong to user"]
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "products",
        required: [true, "review must belong to product"]
    },
}, { timestamps: true });

reviewSchema.pre(["find"  ,"findOneAndDelete" ,"findOneAndUpdate"], function (next) {
    this.populate<UserDocument>({path:"user" , select:"name userImg"})
    next();
});

reviewSchema.statics.calculateAverageRationgAndCount = async function (productId: string) {
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: "product",
                avgRating: { $avg: "$rating" },
                ratingQuantity: { $sum: 1 }
            }
        }
    ]);
    
    if (result.length > 0) {
        await productModel.findByIdAndUpdate(
            productId,
            {
                ratingsAverage: result[0].avgRating,
                ratingsQuantity: result[0].ratingQuantity,
            }
        );
    } else {
        await productModel.findByIdAndUpdate(
            productId,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0,
            }
        );
    }
};

reviewSchema.post("save", async function () {
    await (this as any).constructor.calculateAverageRationgAndCount(this.product);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
    if(doc) await doc.constructor.calculateAverageRationgAndCount(doc.product);
});

export const reviewModel = mongoose.model<ReviewDocument>("reviews", reviewSchema);