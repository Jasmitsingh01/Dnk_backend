import { Router } from "express";
import {
  CreateProduct,
  DeleteProduct,
  FindParticularProducts,
  GetProduct,
  UpdateProduct,
  AdminGetAllProducts
} from "../controllers/Product/index.js";
import upload, { multiUpload } from "../middleware/multer.js";
import { VerfiyToken } from "../middleware/verfiyToken.js";
const ProductRouter = Router();
// This is a routes which handels the product related opterations
ProductRouter.route("/").post(VerfiyToken, multiUpload, CreateProduct);
ProductRouter.route("/all").get(GetProduct);

ProductRouter.route("/single/:id")
  .get(FindParticularProducts)
  .delete(DeleteProduct)
 
  ProductRouter.put("/single/:id",VerfiyToken,multiUpload,UpdateProduct);
  ProductRouter.route("/admin/all").get(VerfiyToken,AdminGetAllProducts);
export default ProductRouter;
