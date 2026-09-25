/**
 * Utilitas kompresi gambar di sisi klien (Client-Side HTML5 Canvas).
 * Mengurangi ukuran gambar mentah kamera HP (5-12 MB) menjadi ~200-400 KB
 * sebelum diunggah ke server dan Cloudinary, menghemat bandwidth & kuota storage free-tier.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0
  mimeType?: string;
}

export async function compressImageClient(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.75,
    mimeType = "image/jpeg",
  } = options;

  // Jika bukan gambar, kembalikan file asli
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Jika file berupa SVG atau GIF animasi, jangan di-compress via canvas
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Hitung skala aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Isi latar belakang dengan warna putih solid untuk mencegah artefak hitam pada gambar PNG transparan
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        // Gambar ulang di canvas dengan resolusi yang telah disesuaikan
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Ganti nama ekstensi jika berubah ke JPEG
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const newExtension = mimeType === "image/webp" ? ".webp" : ".jpg";
            const compressedFile = new File([blob], `${baseName}${newExtension}`, {
              type: mimeType,
              lastModified: Date.now(),
            });

            // Gunakan hasil kompresi jika ukurannya lebih kecil atau jika file aslinya PNG berukuran besar
            const isLargePng = (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) && compressedFile.size <= 2 * 1024 * 1024;
            if (compressedFile.size < file.size || isLargePng) {
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };

      if (readerEvent.target?.result) {
        img.src = readerEvent.target.result as string;
      } else {
        resolve(file);
      }
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
