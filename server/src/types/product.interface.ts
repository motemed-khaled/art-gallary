import mongoose , {Document} from "mongoose";

export interface Product{
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: mongoose.Schema.Types.ObjectId;
    ratingsAverage: number;
    ratingsQuantity: number;
}

export interface ProductDocument extends Document , Product{}