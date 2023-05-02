import cloudinary from '../utils/cloudinary.js';

const uploadSingleImageToCloudinary = async (filePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `${folderName.folder}`
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export default uploadSingleImageToCloudinary;
