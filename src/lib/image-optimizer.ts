/**
 * Resizes and compresses an image client-side, converting it to WebP format.
 * Rejects files if they exceed a size threshold after compression.
 * 
 * @param file Raw input File from input element
 * @param maxDimension Maximum width/height pixel boundary
 * @param quality Compression quality parameter (0.0 to 1.0)
 * @param maxSizeBytes Limit in bytes (e.g., 500 * 1024)
 * @returns Promise resolving to an optimized Blob ready for Supabase transit.
 */
export async function optimizeImage(
  file: File,
  maxDimension = 800,
  quality = 0.8,
  maxSizeBytes = 500 * 1024
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // 1. Check if the browser supports FileReader
    if (!window.FileReader || !window.HTMLCanvasElement) {
      return resolve(file); // Fallback to raw file if features are missing
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // 2. Compute aspect ratio dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // 3. Draw on Canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Could not construct 2D canvas context."));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 4. Output as WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Canvas export returned empty blob."));
            }

            if (blob.size > maxSizeBytes) {
              // Try compressing again with lower quality
              canvas.toBlob(
                (lowQualityBlob) => {
                  if (lowQualityBlob && lowQualityBlob.size <= maxSizeBytes) {
                    resolve(lowQualityBlob);
                  } else {
                    reject(
                      new Error(
                        `Image is too large (${Math.round(
                          blob.size / 1024
                        )}KB). Compressed version exceeds maximum allowed size of 500KB.`
                      )
                    );
                  }
                },
                "image/webp",
                0.5
              );
            } else {
              resolve(blob);
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => reject(new Error("Could not parse image source."));
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
  });
}
