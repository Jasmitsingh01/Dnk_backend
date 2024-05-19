import { Router } from "express";
import {
  CreateOrder,
  DeleteOrder,
  GetOrders,
  UpdateOrder,
} from "../controllers/Order/index.js";
import { VerfiyToken } from "../middleware/verfiyToken.js";
const OrderRouter = Router();
// this is routes will handle the order related operations such as updating the order and deleting the order itself from the database
OrderRouter.route("/")
  .post(VerfiyToken, CreateOrder)
  .get(VerfiyToken, GetOrders);
OrderRouter.route("/:id").delete(DeleteOrder).post(UpdateOrder);
export default OrderRouter;
