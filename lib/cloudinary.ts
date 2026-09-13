import crypto from "crypto";

export function getCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/image/upload/");
    if (parts.length < 2) return null;
    let afterUpload = parts[1];
    afterUpload = afterUpload.split("?")[0];
    const segments = afterUpload.split("/");
    const versionIndex = segments.findIndex((seg) => /^v\d+$/.test(seg));
    const publicIdWithExt =
      versionIndex !== -1
        ? segments.slice(versionIndex + 1).join("/")
        : segments[segments.length - 1];

    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    return lastDotIndex !== -1
      ? publicIdWithExt.substring(0, lastDotIndex)
      : publicIdWithExt;
  } catch (err) {
    console.warn("Gagal mengekstrak Cloudinary public ID:", url, err);
    return null;
  }
}

export async function deleteImageFromCloudinary(
  imageUrl: string | null | undefined
): Promise<boolean> {
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) return false;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret ||
    cloudName === "demo" ||
    apiKey === "123456789"
  ) {
    return false;
  }

  const publicId = getCloudinaryPublicId(imageUrl);
  if (!publicId) return false;

  try {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    // Parameter signature harus berurutan alfabetis: public_id sebelum timestamp
    const signature = crypto
      .createHash("sha1")
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return response.ok && data.result === "ok";
  } catch (err) {
    console.warn("Cloudinary delete asset gagal:", publicId, err);
    return false;
  }
}

/**
 * Hapus beberapa gambar sekaligus secara paralel menggunakan Promise.allSettled
 * untuk mencegah blocking thread dan membersihkan kuota Cloudinary secara efisien.
 */
export async function deleteMultipleImagesFromCloudinary(
  imageUrls: (string | null | undefined)[]
): Promise<void> {
  const validUrls = imageUrls.filter(
    (url): url is string => Boolean(url && url.includes("cloudinary.com"))
  );
  if (validUrls.length === 0) return;

  await Promise.allSettled(validUrls.map((url) => deleteImageFromCloudinary(url)));
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  // Validasi keamanan: Pastikan file berupa gambar dan ukuran wajar
  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("File yang diunggah harus berupa gambar (JPEG, PNG, WEBP).");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Ukuran foto melebihi batas maksimal 10MB.");
  }

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
      const folder = "sibersih/reports";

      // Parameter signature berurutan alfabetis: folder lalu timestamp
      const signature = crypto
        .createHash("sha1")
        .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
        .digest("hex");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
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
        // Otomatisasi transformasi format & kualitas Cloudinary (f_auto,q_auto) untuk menghemat bandwidth
        const rawUrl = data.secure_url as string;
        if (rawUrl.includes("/image/upload/") && !rawUrl.includes("f_auto")) {
          return rawUrl.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
        }
        return rawUrl;
      }
      console.error("Cloudinary upload failed with response:", data);
      throw new Error(data.error?.message || "Gagal mengunggah foto ke Cloudinary.");
    } catch (err: unknown) {
      console.error("Cloudinary connection error:", err);
      // Jika credentials sudah diset tapi gagal, lempar error agar tidak mengotori DB dengan Base64
      const errMsg = err instanceof Error ? err.message : "Gagal mengunggah foto ke Cloudinary.";
      throw new Error(`Upload Cloudinary gagal: ${errMsg}`);
    }
  }

  // Fallback HANYA untuk development offline tanpa API key: Convert file to Base64
  console.warn("PERINGATAN: Menggunakan Base64 Data URL fallback karena kredensial Cloudinary belum dikonfigurasi.");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = file.type || "image/jpeg";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
