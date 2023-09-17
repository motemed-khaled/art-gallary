import path from "path";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
dotenv.config();
import { dbConnection } from "./config/database";
import { globalError } from "./middleWares/globalError.middleware";
import { mountRoutes } from "./routes/mount.routes";
import { webHookCheckOut } from "./controllers/order.controller";

// connect db
dbConnection();
const app = express();

app.use(cors());
app.options("*", cors());

// compress all response
app.use(compression());

// stripe webhook
app.post("/webHook-checkout", express.raw({ type: 'application/json' }), webHookCheckOut);

//middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
// to serve all image
app.use(express.static(path.join(path.dirname("src/uploads"), "uploads")));

// to applay data sanitization
app.use(mongoSanitize());

// to protect aganist http parameters polluation attack
app.use(
  hpp({
    whitelist: ["price", "sold", "stock", "ratingsQuantity", "ratingsAverage"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message:
    "Too many requests created from this IP, please try again after an 15 min",
});
// Apply the rate limiting middleware to forgotpassword requests
app.use("/api/v1/auth/forgetPassword", limiter);

//mount routes
mountRoutes(app);

// handle express global error
app.use(globalError);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("app run in port 5000");
});
//handle error outside express
process.on("unhandledRejection", (err: Error) => {
  console.error(`unhandledRejection : ${err.name}|${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
