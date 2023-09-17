import { Application } from "express";
import { router as userRoutes } from "./user.routes";
import { router as authRoutes } from "./auth.routes";
import { router as categoryRoutes } from "./category.routes";
import { router as productRoutes } from "./product.routes";
import { router as reviewRoutes } from "./review.routes";
import { router as cartRoutes } from "./cart.routes";
import { router as orderRoutes } from "./order.routes";
import { router as whisListRoutes } from "./whishList.routes";


export const mountRoutes = (app: Application) => {
    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/category", categoryRoutes);
    app.use("/api/v1/product", productRoutes);
    app.use("/api/v1/review", reviewRoutes);
    app.use("/api/v1/cart", cartRoutes);
    app.use("/api/v1/order", orderRoutes);
    app.use("/api/v1/whishList", whisListRoutes);
};