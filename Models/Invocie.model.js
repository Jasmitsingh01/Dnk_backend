import mongoose, { Schema, Types } from "mongoose";

const InvocieShecma = new Schema({
  IncvoiceItems: {
    type: Types.Array(Types.ObjectId),
    ref: "Product",
    required: true,
  },
  InvoiceBillingAddress: { type: String, required: true },
  InvoiceShippingAddress: { type: String, required: true },
  invocieQuantity: { type: Number, required: true, default: 0 },
  invociePrice: { type: Number, required: true, default: 0 },
  ShippingCharges: { type: Number, required: true },
  invoiceItemDiscount: { type: Number, required: true },
  invoiceCategory: { type: String, required: true },
});

const Invocie = mongoose.model("Invocie", InvocieShecma);

export default Invocie;
