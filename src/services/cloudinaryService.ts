/**
 * Cloudinary Service for unsigned uploads and URL transformations
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dstgxr0ui';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

/**
 * Resizes and compresses an image File using HTML Canvas (max 1280px width, 70% quality)
 * matching Android's Bitmap.createScaledBitmap + JPEG compress behavior.
 */
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const maxWidth = 1280;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          const ratio = height / width;
          width = maxWidth;
          height = Math.round(width * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else resolve(file);
          },
          'image/jpeg',
          0.7
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Uploads an image blob or file to Cloudinary using unsigned upload preset
 */
export async function uploadToCloudinary(
  fileOrBlob: File | Blob,
  fileName?: string
): Promise<string> {
  const compressed = fileOrBlob instanceof File ? await compressImage(fileOrBlob) : fileOrBlob;

  const formData = new FormData();
  formData.append('file', compressed, fileName || 'upload.jpg');
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Gagal mengunggah gambar ke Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Transforms Cloudinary image URLs for optimized thumbnail / grid cards
 * (e.g. crop fill, auto format, auto quality)
 */
export function getCloudinaryThumbnail(url: string, width = 600, height = 400): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  // Insert transformation after /upload/
  return url.replace('/upload/', `/upload/c_fill,w_${width},h_${height},q_auto,f_auto/`);
}

/**
 * Transforms Cloudinary image URLs for optimized fullscreen detail viewing
 */
export function getCloudinaryOptimizedUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/q_auto,f_auto/');
}
