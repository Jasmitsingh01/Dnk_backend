import { ApiResponseHandeler } from "../../utils/ApiResponseHandeler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import Product from "../../Models/product.model.js";
import UplodFiles from "../../utils/Upload.js";
import  jwt from "jsonwebtoken";
const CreateProduct = ApiResponseHandeler(async (req, res, next) => {
  // this Controller is responsible for creating products
  try {
    const {
      product_name,
      product_Code,
      product_quantity,
      product_brand,
      product_category,
      product_for_gender,
      product_size,
      product_status,
      product_price,
      product_discount_price,
      product_description,
    } = req.body;
    const { user_id, files } = req; // we Get all fileds that were is Needed
    if (
      !product_name ||
      !product_Code ||
      !product_quantity ||
      !product_brand ||
      !product_category ||
      !product_for_gender ||
      !product_size ||
      !product_status ||
      !product_price ||
      !product_discount_price ||
      !product_description ||
      !user_id ||
      !files
    ) {
      throw new ApiError("All Fields are required", 400); // throw a new api error when all fields are not present
    }
    const product_image = await UplodFiles(files); // Uplod the multiple Files to cloudnairy
    const product = new Product({
      // make a new Product object for mongodb Database
      product_name,
      product_Code,
      product_quantity,
      product_brand,
      product_category,
      product_for_gender,
      product_size,
      product_status,
      product_price,
      product_discount_price,
      product_description,
      product_image,
      product_createdby: user_id,
    });

    const saveProduct = await product.save(); // Save the product to mongodb Database

    if (!saveProduct) {
      throw new ApiError("Product Error while saving to Database", 500); // If error is occured during saving the product to mongodb Database the error will be thrown
    }
    res.status(201).json(new ApiResponse(201, "Product Created Sucessfully")); // Send response to user your product has been saved successfully or Created successfully
  } catch (error) {
    // if Any error was throw it should be handle by this Cacth block

    // loging the error to console
    console.log(error);
    // if the error is an instance of ApiError it should be thrown here And Send it to the user
    res.status(error.statusCode).json({ message: error.message });
  }
});
const UpdateProduct = ApiResponseHandeler(async (req, res, next) => {
  // this Controller is responsible for updating the existing  product
  try {
    const {
      product_name,
      product_Code,
      product_quantity,
      product_brand,
      product_category,
      product_for_gender,
      product_size,
      product_status,
      product_price,
      product_discount_price,
      product_description,
      product_image,
      product_rating,
    } = req.body;
    const { files } = req;
    const { id } = req.params; // Get all The Filed that have been upladed
    if (
      !product_name &&
      !product_Code &&
      !product_quantity &&
      !product_brand &&
      !product_category &&
      !product_for_gender &&
      !product_size &&
      !product_status &&
      !product_price &&
      !product_discount_price &&
      !product_description &&
      !files &&
      !product_rating
    ) {
      throw new ApiError(" No fields are found To be updated", 400); // if  all Fields are missing then nothing is updated to the Product.
    }
    const product = await Product.findById(id); // find the product with the specified id and update it accordingly.
    if (!product) {
      throw new ApiError("Product Not Found", 404);
    }
    if (product_name !== undefined || null || "") {
      // if product_name  then update the product_name field
      product.product_name = product_name;
    }
    if (product_Code !== undefined || null || "") {
      // if product_Code then update the product_code field
      product.product_Code = product_Code;
    }
    if (product_quantity !== undefined || null || "") {
      // if product_quantity then update the product_qunatity field
      product.product_quantity = product_quantity;
    }
    if (product_brand !== undefined || null || "") {
      // if product_brand then update the product_brand field
      product.product_brand = product_brand;
    }
    if (product_category !== undefined || null || "") {
      // if product_category then update the product_category field
      product.product_category = product_category;
    }
    if (product_for_gender !== undefined || null || "") {
      // if product_for_gender then update the product_for_gender filed
      product.product_for_gender = product_for_gender;
    }
    if (product_size !== undefined || null || "") {
      // if product_size then update the product_size field
      product.product_size = product_size;
    }
    if (product_status !== undefined || null || "") {
      // if product_status then update the product_status field
      product.product_status = product_status;
    }
    if (product_price !== undefined || null || "") {
      // if product_price then update the product_price field.
      product.product_price = product_price;
    }
    if (product_discount_price !== undefined || null || "") {
      // if product_discount_price then update the product_discount field
      product.product_discount_price = product_discount_price;
    }
    if (product_description !== undefined || null || "") {
      // if product_description then update the product_description field
      product.product_description = product_description;
    }
    if (files !== undefined || null || "") {
      // if product_image then update the product_image field
      const product_image_path = files?.map((file) => file?.filespath); // get Files path from Public Directory
      product.product_image_path = product_image_path;
      const product_image = await UplodFiles(files); // Uplod the multiple Files to cloudnairy
      product.product_image = product_image;
    }
    if (product_rating !== undefined || null || "") {
      // if product_rating then update the product_rating field
      const user =
        product.product_ratingcount == 0 ? 1 : product.product_ratingcount;
      product.product_rating = Math.ceil(
        (product.product_rating + product_rating) / user + 1
      );
      product.product_ratingcount = product.product_ratingcount + 1;
    }
    const saveProduct = await product.save(); // save the updated product
    if (!saveProduct) {
      throw new ApiError("Product Error while saving to Database", 500); // if some error Is occured while updating the product
    }
    // Finally send Sucessfully to the user
    res.status(200).json(new ApiResponse(200, "Product Updated Sucessfully"));
  } catch (error) {
    // Handler all error Here or send Error Respone To The user
    res.status(error.statusCode).json({ message: error.message });
  }
});
const DeleteProduct = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { id } = req.params; // Get the product ID from the request params and Find the product from the database
    const { slug } = req.query;

    if (slug) {
      //if slug is true then remove the product from the database
      const product = await Product.deleteOne({ _id: id });
      if (!product) {
        throw new ApiError("Product Not Found", 404);
      }
      res
        .status(202)
        .send(new ApiResponse(202, "product deleted successfully"));
    }
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError("Product Not Found", 404); // if the product is not found throw an error
    }
    product.product_status = "hidden"; // if the slug not then then the product is hidden

    const saveProduct = await product.save();
    if (!saveProduct) {
      throw new ApiError("Product Error while saving to Database", 500);
    }
    res.status(200).json(new ApiResponse(200, "Product Archived Sucessfully")); // Product was successfully saved
  } catch (error) {
    // Handle error the Error here and throw an error message
    console.log(error);
    res.status(error.statusCode).json({ message: error.message }); // Error response send back to user
  }
});
const GetProduct = ApiResponseHandeler(async (req, res, next) => {
  try {
    const {
      product_for_gender,
      product_category,
      product_per_page = 4,
      is_Admin 
    } = req.query; // get Query parameters
    let product;
    let Total_number_pages;
    if (is_Admin) {
    const user= jwt.verify(req?.cookies?._accessToken,process.env.Jwt_secret_AccessToken)
      if(!user){
        throw new ApiError("UnAuthorized Access",401)
      }

      product = await Product.find({product_createdby:user?._id});
      Total_number_pages = Math.ceil(product.length / product_per_page); // if is_Admin is true then return all products
    }
    if (product_for_gender == "undefined" && product_category == "undefined") {
      product = await Product.find({
        product_status: "public",
      });
      Total_number_pages = Math.ceil(product.length / product_per_page); //  if not  product gender and product Category then return all products
    }
    if (
      product_for_gender !== "undefined" ||
      product_category !== "undefined"
    ) {
      product = await Product.find({
        // if  product gender and product Category then return aacordingly
        product_status: "public",
        $or: [
          {
            product_for_gender,
          },
          {
            product_category,
          },
        ],
      });
      Total_number_pages = Math.ceil(product.length / product_per_page);
    }

    if (!product || product?.length === 0) {
      throw new ApiError("Product Not Found", 404); // Product not found
    }
    res.status(200).json(
      new ApiResponse(200, "Product Found Successfully", {
        product,
        Total_number_pages: Total_number_pages,
      }) // The total number of pages
    );
  } catch (error) {
    // handle error here and return the error object to the user
    console.log(error);
    res.status(error.statusCode).json({ message: error.message });
  }
});
const FindParticularProducts = ApiResponseHandeler(async (req, res, next) => {
  try {
    const { id } = req.params; // Get the product id from the request params

    const product = await Product.findById(id); // find the product by the id

    if (!product) {
      throw new ApiError("Product Not Found", 404); // Throw Error Product Not Found
    }
    res.status(200).json(new ApiResponse(200, "Product found", product)); // send New Response TO The User
  } catch (error) {
    // Handle The Error
    console.log(error);
    // send Error to user
    res.status(error.statusCode).json({ message: error.message });
  }
});

export {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetProduct,
  FindParticularProducts,
}; // Export all Controllers
