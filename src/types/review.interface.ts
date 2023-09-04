import mongoose , {Document} from "mongoose";

export interface Review {
    title: string;
    rating: number;
    user: mongoose.Schema.Types.ObjectId;
    product:mongoose.Schema.Types.ObjectId;
}

export interface ReviewDocument extends Review , Document {
}