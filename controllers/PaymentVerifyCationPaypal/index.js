import ApiError from "../../utils/ApiError.js";
import { ApiResponseHandeler } from "../../utils/ApiResponseHandeler.js";
import fetch from "node-fetch";
import ApiResponse from "../../utils/ApiResponse.js";
const base = "https://api-m.sandbox.paypal.com";
import axios from "axios";
import base64 from "base-64";
const generateAccessToken = async () => {
  try {
    const client_id = process.env.client_id_papyal
        const client_secret = process.env.client_serect_papyal

       
        const response = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token',
          new URLSearchParams({
              'grant_type': 'client_credentials'
          }),
          {
              headers:
              {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Basic ' + base64.encode(client_id + ":" + client_secret)
              }
          })
      return Promise.resolve(response.data.access_token);
  } catch (error) {
    // console.log(error)
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
    // console.log(accessToken)
    if (!response.ok) {
      throw new ApiError("Invalid payment request ", 500);
    }
    const Data = await response.json();
    res
      .status(201)
      .send(new ApiResponse(201, "order created successfully", Data));
  } catch (error) {
    // console.log(error);
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
    // console.log(error);
    res
      .status(error.statusCode)
      .send(new ApiResponse(error.statusCode, error.message));
  }
});
export { paymentCreate, paymentVeriy };
