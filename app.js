import express from "express";
import { userRouter } from "./routes/User.routes.js";
import OrderRouter from "./routes/Order.routes.js";
import ProductRouter from "./routes/Products.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import Payment from "./routes/PaymentVerfiycation.routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// set the view engine to ejs
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(
  cors({
    origin:"https://dnkecommerce.netlify.app",
    credentials: true,
    optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use("/api/user", userRouter);
app.use("/api/product", ProductRouter);
app.use("/api/payment", Payment);
app.use("/api/order", OrderRouter);

export default app;
