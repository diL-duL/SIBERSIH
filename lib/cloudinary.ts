import crypto from "crypto";

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const isDemoOrMissing =
    !cloudName ||
    !apiKey ||
    !apiSecret ||
    cloudName === "demo" ||
    apiKey === "123456789";

  if (!isDemoOrMissing) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const signature = crypto
        .createHash("sha1")
        .update(`timestamp=${timestamp}${apiSecret}`)
        .digest("hex");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.secure_url) {
        return data.secure_url as string;
      }
      console.warn("Cloudinary upload failed, falling back to base64 data URL:", data);
    } catch (err) {
      console.warn("Cloudinary error, falling back to base64 data URL:", err);
    }
  }

  // Fallback: Convert file to Base64 Data URL for local dev & testing
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = file.type || "image/jpeg";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
