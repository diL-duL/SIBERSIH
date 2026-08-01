export async function uploadImageToCloudinary(file: File) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "sibersih_preset"; 
  // We can use an unsigned upload preset, or signed upload.
  // Since we have API Key & Secret, we can do a signed upload if we generate a signature.
  // However, for simplicity using fetch, if we generate a signature:
  
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not set in .env");
  }

  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  
  // Create signature
  const crypto = require("crypto");
  const signature = crypto.createHash("sha1").update(`timestamp=${timestamp}${apiSecret}`).digest("hex");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary error:", data);
    throw new Error(data.error?.message || "Gagal mengunggah gambar");
  }

  return data.secure_url as string;
}
