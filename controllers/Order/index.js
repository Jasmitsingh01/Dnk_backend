import { ApiResponseHandeler } from "../../utils/ApiResponseHandeler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import Order from "../../Models/order.model.js";
function GetOrder(data) {
  const Product_id = data?.map((order) => order?._id);
  const ToorderPrice = data?.reduce(
    (price, order) => price + order.product_price * order.cart_quantity,
    5
  );
  const OrderItemqunatity = data?.map((order) => order?.cart_quantity);
  const orderTos = data?.map((order) => order.product_createdby);
  const ItemsPrice = data?.map(
    (order) => order.product_price * order.cart_quantity
  );
  return {
    orderItem: Product_id,
    ToorderPrice,
    orderTos,
    ItemsPrice,
    OrderItemqunatity,
  };
}
const CreateOrder = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { cart, Address } = req.body;
    const { user_id } = req;
    const ItemsArray = JSON.parse(cart);
    const orderData = GetOrder(ItemsArray);
    if (!cart || !Address || Address === "" || !user_id) {
      throw new ApiError("cart values are required", 400);
    }
    if (!orderData) {
      throw new ApiError(400, "Invalid Data");
    }
    const NEWORDER = new Order({
      OrderTo: orderData.orderTos,
      orderItem: orderData.orderItem,
      orderTotal: orderData.ToorderPrice,

      orderItemPrices: orderData.ItemsPrice,
      orderItemQuantity: orderData.OrderItemqunatity,
      OrderBy: user_id,
      deliveredLocation: Address,
      orderPayment: "Paid",
    });
    if (!NEWORDER) {
      throw new ApiError(400, "Invalid Data");
    }
    const CreateOrderRequest = await NEWORDER.save();
    if (!CreateOrderRequest) {
      throw new ApiError(400, "Invalid Data");
    }
    res.status(201).send(new ApiResponse(201, "Order created successfully"));
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode)
      .send(new ApiError(error.message, error.statusCode));
  }
});

const DeleteOrder = ApiResponseHandeler((req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Invalid Data");
    }
    const DeleteOrder = Order.deleteOne({ _id: id });
    if (!DeleteOrder) {
      throw new ApiError(500, "Invalid Data");
    }
    res.status(200).send(new ApiResponse(200, "Order deleted successfully"));
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode)
      .send(new ApiError(error.message, error.statusCode));
  }
});

const GetOrders = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { isAdmin } = req.query;

    const { user_id } = req;
    if (isAdmin) {
      if (!user_id) {
        throw new ApiError("Invalid Data", 400);
      }
      const Orders = await Order.find({
        OrderTo: { $in: [user_id] },
      }).populate({ path: "orderItem", model: "Product" });
      if (!Orders) {
        throw new ApiError("Invalid Data", 400);
      }
      res.status(200).send(new ApiResponse(200, "Order Found ", Orders));
    } else {
      if (!user_id) {
        throw new ApiError("Invalid Data", 400);
      }
      const Orders = await Order.find({ OrderBy: user_id }).populate({
        path: "orderItem",
        model: "Product",
      });
      if (!Orders) {
        throw new ApiError("Invalid Data", 400);
      }
      res.status(200).send(new ApiResponse(200, "Order Found ", Orders));
    }
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode)
      .send(new ApiError(error.message, error.statusCode));
  }
});

const UpdateOrder = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Invalid Data");
    }
    const { status } = req.body;
    if (!status) {
      throw new ApiError(400, "Invalid Data");
    }
    const UpdateOrder = await Order.updateOne(
      { _id: id },
      { orderSatuts: status }
    );
    if (!UpdateOrder) {
      throw new ApiError(400, "Invalid Data");
    }
    res.status(200).send(new ApiResponse(200, "Order updated successfully"));
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode)
      .send(new ApiError(error.message, error.statusCode));
  }
});

export { CreateOrder, DeleteOrder, GetOrders, UpdateOrder };
