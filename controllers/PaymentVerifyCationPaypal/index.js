import ApiError from "../../utils/ApiError.js";
import { ApiResponseHandeler } from "../../utils/ApiResponseHandeler.js";
import fetch from "node-fetch";
import ApiResponse from "../../utils/ApiResponse.js";
const base = "https://api-m.sandbox.paypal.com";
const generateAccessToken = async () => {
  try {
    const PAYPAL_CLIENT_ID = process.env.client_id_papyal;
    const PAYPAL_CLIENT_SECRET = process.env.client_serect_papyal;
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const paymentCreate = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { cart, price } = req.body;
    if (!price || !cart) {
      throw new ApiError("Invalid payment request ", 400);
    }
    const url = `${base}/v2/checkout/orders`;
    const accessToken = await generateAccessToken();
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price + 5,
          },
        },
      ],
    };

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new ApiError("Invalid payment request ", 500);
    }
    const Data = await response.json();
    res
      .status(201)
      .send(new ApiResponse(201, "order created successfully", Data));
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode)
      .send(new ApiResponse(error.statusCode, error.message));
  }
});
const paymentVeriy = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { orderID } = req.params;
    if (!orderID) {
      throw new ApiError("Invalid payment request ", 400);
    }
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new ApiError("Invalid payment request ", 500);
    }

    const Data = await response.json();
    res.status(200).send(new ApiResponse(200, "success ", Data));
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode)
      .send(new ApiResponse(error.statusCode, error.message));
  }
});
export { paymentCreate, paymentVeriy };
