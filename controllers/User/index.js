import { ApiResponseHandeler } from "../../utils/ApiResponseHandeler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import User from "../../Models/user.model.js";
import UploadToCloudnary from "../../utils/UploadtoCloudinary.js";
import { GenerateToken } from "../../utils/GenrateDifferrentToken.js";
import Admin from "../../Models/Admin.model.js";

// user Login Controller
const userLogin = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { email, password, admin_password, admin_email, isAdmin } = req.body; // email, password from user
    if (isAdmin) {
      if (!admin_password || !admin_email) {
        throw new ApiError(" All fields are required", 400); // if email or password is missing return an error
      }
      const finduser = await Admin.findOne({ admin_email: admin_email }); // find user by email
      if (!finduser) {
        throw new ApiError("User not found", 404); // if user is not found return an error
      }
      const isMatch = finduser.isPassword(admin_password); // check the user password correct or not
      if (!isMatch) {
        throw new ApiError("Invalid password", 401); // if user password is incorrect return an error
      }
      const { AccessToken, RefreshToken } = await GenerateToken(
        finduser._id,
        isAdmin
      ); // generate the refresh token  and access token
      const cookiesOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: true,
        sameSite: true,
      }; // set the cookies options for the user
      res
        .cookie("_accessToken", AccessToken, cookiesOptions)
        .cookie("_refreshToken", RefreshToken, cookiesOptions)
        .status(200)
        .send(
          new ApiResponse(200, "Login admin Successfully", {
            Admin: true,
            AccessToken: AccessToken,
            RefreshToken: RefreshToken,
            address: Admin.admin_address,
            contact: Admin.admin_contact,
          })
        );
    } else {
      if (!email || !password) {
        throw new ApiError(" All fields are required", 400); // if email or password is missing return an error
      }
      const finduser = await User.findOne({ email: email }); // find user by email
      if (!finduser) {
        throw new ApiError("User not found", 404); // if user is not found return an error
      }
    console.log(password,finduser.password)
      const isMatch = finduser.isPassword(password); // check the user password correct or not
      if (!isMatch) {
        throw new ApiError("Invalid password", 401); // if user password is incorrect return an error
      }
      const Tokens = await GenerateToken(finduser._id); // generate the refresh token  and access token
      const cookiesOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: true,
        sameSite: true,
      }; // set the cookies options for the user

      res.cookie("_accessToken", Tokens.AccessToken, cookiesOptions); // set user cookies
      res.cookie("_refreshToken", Tokens.RefreshToken, cookiesOptions); // set user cookies
      res.status(200).json(
        new ApiResponse(200, "Login user Successfully", {
          AccessToken: Tokens.AccessToken,
          RefreshToken: Tokens.RefreshToken,
          address: finduser.address,
          contact: finduser.contact,
        }) // send the successfuly message to the user
      );
    }
  } catch (error) {
    // If above have an error then it will handle here
    console.log(error);
    res.status(error.statusCode).send(error.message); // send the error message to the user
  }
});
// user Register Controller
const userRegister = ApiResponseHandeler(async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      conatct_number,
      isAdmin,
      admin_name,
      admin_email,
      admin_password,
      admin_contact,
    } = req.body; // get the user details from the request body
    if (isAdmin) {
      if (!admin_name || !admin_email || !admin_password || !admin_contact) {
        throw new ApiError(" All fields are required", 400); // if this mandertory field is invalid, throw an error
      }
      const finduser = await Admin.findOne({
        $or: [{ admin_email: admin_email }, { admin_contact: admin_contact }],
      }); // find the user by email  if it exists then  throw an error
      if (finduser) {
        throw new ApiError("User already exist", 400);
      }
      const user = new Admin({
        admin_name,
        admin_email,
        admin_password,
        admin_contact,
      }); // Create new user object for mongodb instance
      const RefreshToken = await user.GenrateRefreshToken(); // genrates the access token and Refresh
      const AccessToken = await user.GenrateAccessToken();
      user.refreshToken = RefreshToken;
      user.accessToken = AccessToken;
      const data = await user.save();
      if (!data) {
        throw new ApiError("something went wrong", 500);
      }
      const cookiesOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: true,
        sameSite: true,
      };
      res
        .status(200)
        .cookie(
          "_accessToken",
          AccessToken,

          cookiesOptions
        )
        .cookie("_refreshToken", RefreshToken, cookiesOptions) // access token and refresh token and set to the user Cookies
        .send(
          new ApiResponse(200, "user Successfully logged in", {
            success: true,
            AccessToken: AccessToken,
            RefreshToken: RefreshToken,
            Admin: true,
            address: Admin.admin_address,
            contact: Admin.admin_contact,
          })
        ); // send success response
    } else {
      if (!name || !email || !password || !conatct_number) {
        throw new ApiError(" All fields are required", 400); // if this mandertory field is invalid, throw an error
      }
      const finduser = await User.findOne({
        $or: [{ email: email }, { contact: conatct_number }],
      }); // find the user by email and contact number  if it exists then  throw an error
      if (finduser) {
        throw new ApiError("User already exist", 400);
      }
      const user = new User({
        name,
        email: email,
        password,
        contact: conatct_number,
        isAdmin: isAdmin,
      }); // Create new user object for mongodb instance
      const RefreshToken = await user.GenrateRefreshToken(); // genrates the access token and Refresh
      const AccessToken = await user.GenrateAccessToken();
      user.refreshToken = RefreshToken;
      user.accessToken = AccessToken;

      const data = await user.save();
      if (!data) {
        throw new ApiError("something went wrong", 500);
      }
      const cookiesOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: true,
        sameSite: true,
      }; // set Cookies options

      res
        .status(200)
        .cookie(
          "_accessToken",
          AccessToken,

          cookiesOptions
        )
        .cookie("_refreshToken", RefreshToken, cookiesOptions) // access token and refresh token and set to the user Cookies
        .json(
          new ApiResponse(200, "user Successfully logged in", {
            success: true,
            AccessToken: AccessToken,
            RefreshToken: RefreshToken,
            address: user.address,
            contact: user.contact,
          })
        ); // send success response
    }
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode).send(error?.message); // send error message
  }
});
// user Logout
const userLogout = ApiResponseHandeler((req, res, next) => {
  try {
    res.clearCookie("_accessToken");
    res.clearCookie("_refreshToken"); // the access token and refresh token From cookies
    res.status(200).json(new ApiResponse(200, "Logout user Successfully", {})); // send success message/response
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({ message: error.message }); // send error message
  }
});

// use update Profile
const userUpdate = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { name, email, avatar, address, gender, isAdmin } = req.body; // Get All Fileds Of user from user
    const { user_id } = req; // Get User id of user
    console.log(req.body);
    if (!email && !isAdmin && !gender && !name && !address) {
      throw new ApiError("Nothing will Updated", 400);
    }
    const finduser = await User.findById(user_id); // Find user by id
    if (!finduser) {
      throw new ApiError("User not found", 404); // if user is not found
    }
    // Any of the filed is Present then those Finds are updated
    if (name !== null && name !== undefined && name !== "") {
      finduser.name = name;
    }
    if (email !== null && email !== undefined && email !== "") {
      finduser.email = email;
    }

    if (address !== null && address !== undefined && address !== "") {
      finduser.address = address;
    }
    if (gender !== null && gender !== undefined && gender !== "") {
      finduser.gender = gender;
    }
    if (isAdmin !== null && isAdmin !== undefined && isAdmin !== false) {
      finduser.isAdmin = isAdmin;
    }
    const Data = await finduser.save({ validateBeforeSave: false }); // save user into database
    if (!Data) {
      throw new ApiError("something went wrong", 500);
    }
    res
      .status(200)
      .send(new ApiResponse(200, "Update user Successfully", Data)); // Send successfull response back to user
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({ message: error.message }); // Send error response back to user
  }
});
// Get user information
const getUserDetails = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { user_id } = req;
    const finduser = await User.findById(user_id);
    if (!finduser) {
      throw new ApiError("User not found", 404);
    }
    res.status(200).send(new ApiResponse(200, "user Found", finduser));
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({ message: error.message });
  }
});
export { userLogin, userRegister, userLogout, userUpdate, getUserDetails };
