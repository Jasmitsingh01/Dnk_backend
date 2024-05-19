import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
const user = new Schema(
  {
    avatar: {
      type: String,
      required: true,
      default: "Please Enter Your Avatar",
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
      default: "Please Enter Your Contact",
      length: 10,
    },
    address: {
      type: String,
      required: true,

      default: "Please Enter Your Address",
    },
    gender: {
      type: String,
      required: true,

      default: "Please Enter Your gender",
    },

    accessToken: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

user.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
user.methods.isPassword = function (password) {
  const isMatch = bcrypt.compareSync(password, this.password);

  return isMatch;
};

user.methods.GenrateAccessToken = async function () {
  return Jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      gender: this.gender,
      address: this.address,
      contact: this.contact,
    },
    process.env.Jwt_secret_AccessToken,
    {
      expiresIn: process.env.Jwt_expiresIn_AccessToken,
    }
  );
};
user.methods.GenrateRefreshToken = async function () {
  return Jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      gender: this.gender,
      address: this.address,
      contact: this.contact,
    },
    process.env.Jwt_secret_RefreshToken,
    {
      expiresIn: process.env.Jwt_expiresIn_RefreshToken,
    }
  );
};
const User = mongoose.model("User", user);

export default User;
