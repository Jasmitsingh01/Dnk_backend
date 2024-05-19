import { Router } from "express";
import {
  paymentCreate,
  paymentVeriy,
} from "../controllers/PaymentVerifyCationPaypal/index.js";

const Payment = Router();

Payment.route("/create-paypal-order").post(paymentCreate);
Payment.route("/order/:orderID/capture").post(paymentVeriy);

export default Payment;
