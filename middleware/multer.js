import multer from "multer";

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/"); // public storage destination directory path where the file was stored
  },
  filename: (req, file, cb) => {
    // choose the Filename and extension
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: Storage }); // upload destination directory path
export const multiUpload = upload.array("product_image"); // This is used to upload multiple images of the same product
export default upload;
