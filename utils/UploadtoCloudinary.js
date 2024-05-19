import { v2 as cloud } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
// IT is a setup of cloudinary that will be used to configure the cloud instance
cloud.config({
  cloud_name: process.env.cloudinary_cloud,
  api_key: process.env.cloudinary_api_Key,
  api_secret: process.env.cloudinary_api_secret_key,
});
const UploadToCloudnary = async (localpath) => {
  // The UploadToCloudnary function will be called when the cloud instance is created and takes files path as argument and returns a uploaded Image file url
  try {
    if (!localpath) return null;
    const responce = await cloud.uploader.upload(localpath, {
      resource_type: "image",
    });
    console.log(
      "File is uploaded on Cloudnary and Url of image is ",
      responce.url
    );
    return responce.url;
  } catch (error) {
    fs.unlinkSync(localpath); // Delete temporary file from local filesystem before
    console.log("file is not Uploaded", error);
    return null;
  }
};

export default UploadToCloudnary;
