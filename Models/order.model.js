import mongoose, { Schema, Types } from "mongoose";

const orderSchema = new Schema({
  deliveredLocation: { type: String, required: true },
  orderSatuts: { type: String, required: true, default: "Accepted" },
  orderMessage: { type: String, required: true, default: Date.now },
  orderItem: { type: Array(Types.ObjectId), ref: "Product", required: true },
  orderItemPrices: { type: Array(Number), required: true, default: 0 },
  orderItemQuantity: { type: Array(Number), required: true, default: 0 },

  orderPayment: { type: String, required: true },
  orderTotal: { type: Number, required: true, default: 0 },
  OrderBy: { type: Types.ObjectId, ref: "User", required: true },
  OrderTo: { type: [Types.ObjectId], ref: "Admin", required: true },
},{
  timestamps: true,
});
const Order = mongoose.model("Order", orderSchema);

export default Order;
