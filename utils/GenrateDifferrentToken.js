import Admin from "../Models/Admin.model.js";
import User from "../Models/user.model.js";
import ApiError from "./ApiError.js";

export const GenerateToken = async (user_id, isAdmin) => {
  // generate token is a function which takes a user_id  as an argument and generates a access token and  refresh token
  try {
    let user;
    if (isAdmin) {
      user = await Admin.findById(user_id); // find the user in the database by its id
    } else {
      user = await User.findById(user_id); // find the user in the database by its id
    }
    const AccessToken = await user.GenrateAccessToken(); // Generate the access token
    const RefreshToken = await user.GenrateRefreshToken(); // Generate the refresh token
    if (
      RefreshToken === null ||
      undefined ||
      "" ||
      AccessToken === null ||
      undefined ||
      ""
    ) {
      throw new ApiError("Invalid Refrestoken and AccessToken values", 500); // if the RefrestToken and access token values are invalid
    }
    user.refreshToken = await RefreshToken; // set the refresh token
    user.accessToken = await AccessToken; // set the access token
    const Data = await user.save({ validateBeforeSave: false }); // save the resfresh token in the database
    if (!Data) {
      throw new ApiError("Invalid Refrestoken and AccessToken values", 500); // if the RefrestToken and access token values are invalid
    }

    return {
      AccessToken,
      RefreshToken, // return the access token and refresh token
    };
  } catch (error) {
    console.log(error);
  }
};
