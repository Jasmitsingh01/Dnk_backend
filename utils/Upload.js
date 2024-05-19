import UploadToCloudnary from "./UploadtoCloudinary.js";

const UplodFiles = async (Files) => {
  // upload files is a function that takes a list of files and returns a Promise
  const url = Files.map(async (file) => {
    const result = await UploadToCloudnary(file?.path);
    return result;
  });
  return await Promise.all(url);
};

export default UplodFiles;
