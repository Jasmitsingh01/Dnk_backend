import ApiError from "../utils/ApiError.js";
import { ApiResponseHandeler } from "../utils/ApiResponseHandeler.js";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import Admin from "../Models/Admin.model.js";

const VerfiyToken = ApiResponseHandeler(async (req, res, next) => {
  // verify the token is valid and send the response to the server with the token  and the response body as the body parameter
  try {
    const token =
      req?.cookies?._accessToken || req.headers.Authencation?.split(" ")[1];
    
    const { isAdmin } = req.query;
    if (!token) {
      throw new ApiError("Authentication token is required", 401);
    }
    const verfiy = jwt.verify(token, process.env.Jwt_secret_AccessToken);
    let user;

    if (isAdmin) {
      user = await Admin.findOne({ _id: verfiy?._id });
    } else {
      user = await User.findOne({ _id: verfiy._id });
    }
    if (!user) {
      throw new ApiError("Authentication token is invalid", 401);
    }
    req.user_id = user._id;
    next();
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).send(error.message);
  }
});

export { VerfiyToken };
