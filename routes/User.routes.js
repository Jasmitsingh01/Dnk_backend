import { Router } from "express";
import {
  userLogin,
  userLogout,
  userRegister,
  userUpdate,
  getUserDetails,
} from "../controllers/User/index.js";
import { VerfiyToken } from "../middleware/verfiyToken.js";
export const userRouter = Router();
// This is the router that will be used to register users with the application user accounts specified in the routes and other user accounts opteration
userRouter.route("/login").post(userLogin);
userRouter.route("/singup").post(userRegister);
userRouter.route("/logout").post(userLogout);
userRouter.route("/update").post(VerfiyToken, userUpdate);
userRouter.route("/detils").get(VerfiyToken, getUserDetails);

userRouter;
