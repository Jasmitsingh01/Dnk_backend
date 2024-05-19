import mongoose, { Schema } from "mongoose";

const ProductShecma = new Schema(
  {
    product_name: { type: String, required: true },
    product_Code: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true, default: 0 },
    product_image: {
      type: mongoose.Types.Array(String),
      required: true,
      default: null,
    },
    product_for_gender: { type: String, required: true },
    product_size: { type: String },
    product_discount_price: { type: Number, required: true, default: 0 },
    product_category: { type: String, required: true },
    product_brand: { type: String, required: true },
    product_quantity: { type: Number, required: true, default: 0 },
    product_rating: { type: Number, required: true, default: 0 },
    product_ratingcount: { type: Number, required: true, default: 0 },
    product_status: { type: String, required: true, default: "hidden" },
    product_discount: { type: Number, required: true, default: 0 },
    product_image_path: {
      type: mongoose.Types.Array(String),
      required: true,
      default: null,
    },
    product_createdby: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    product_sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductShecma);

export default Product;
