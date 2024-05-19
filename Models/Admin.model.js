import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
const admin = new Schema(
  {
    avatar: {
      type: String,
      required: true,
      default: "Please Enter Your Avatar",
    },

    admin_name: {
      type: String,
      required: true,
    },
    admin_email: {
      type: String,
      required: true,
      unique: true,
    },
    admin_password: {
      type: String,
      required: true,
    },
    admin_contact: {
      type: String,
      required: true,
      unique: true,
      default: "Please Enter Your Contact",
      length: 10,
    },
    admin_address: {
      type: String,
      required: true,
      default: "Please Enter Your Address",
    },
    admin_gender: {
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

admin.pre("save", function (next) {
  if (!this.isModified("admin_password")) return next();
  this.admin_password = bcrypt.hashSync(this.admin_password, 10);
  next();
});
admin.methods.isPassword = function (password) {
  const isMatch = bcrypt.compareSync(password, this.admin_password);

  return isMatch;
};

admin.methods.GenrateAccessToken = async function () {
  return Jwt.sign(
    {
      _id: this._id,
      name: this.admin_name,
      email: this.admin_email,
      avatar: this.avatar,
      gender: this.admin_gender,
      address: this.admin_address,
      contact: this.admin_contact,
    },
    process.env.Jwt_secret_AccessToken,
    {
      expiresIn: process.env.Jwt_expiresIn_AccessToken,
    }
  );
};
admin.methods.GenrateRefreshToken = async function () {
  return Jwt.sign(
    {
      _id: this._id,
      name: this.admin_name,
      email: this.admin_email,
      avatar: this.avatar,
      gender: this.admin_gender,
      address: this.admin_address,
      contact: this.admin_contact,
    },
    process.env.Jwt_secret_RefreshToken,
    {
      expiresIn: process.env.Jwt_expiresIn_RefreshToken,
    }
  );
};
const Admin = mongoose.model("Admin", admin);

export default Admin;
