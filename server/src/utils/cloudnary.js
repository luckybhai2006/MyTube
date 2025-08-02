import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("❌ No file path provided for upload.");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Supports image, video, etc.
    });

    // ✅ File uploaded successfully
    console.log("✅ Uploaded to Cloudinary:", response.secure_url);

    // Optional: Delete local file after successful upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.warn("⚠️ Failed to delete local file:", err);
    });

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);

    // Cleanup: delete file if upload failed
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("🗑️ Local file deleted after failure.");
      }
    } catch (fsErr) {
      console.warn("⚠️ Error deleting local file:", fsErr);
    }

    return null;
  }
};

export { uploadOnCloudinary };
