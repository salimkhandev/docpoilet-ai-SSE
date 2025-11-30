import sharp from "sharp";

export interface ImageProcessingResult {
  buffer: Buffer;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  reduction: string;
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates image file type and size
 */
export function validateImageFile(
  file: File,
  maxSizeBytes: number = 10 * 1024 * 1024 // 10MB default
): ImageValidationResult {
  const validImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split(".").pop();
  const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

  const hasValidType = file.type && validImageTypes.includes(file.type);
  const hasValidExtension =
    fileExtension && validExtensions.includes(fileExtension);

  if (!hasValidType && !hasValidExtension) {
    return {
      isValid: false,
      error: "Invalid image type. Please upload JPEG, PNG, GIF, or WebP images.",
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Image size must be less than ${(maxSizeBytes / 1024 / 1024).toFixed(1)}MB.`,
    };
  }

  return { isValid: true };
}

/**
 * Compresses and optimizes an image using sharp
 * Ensures the image fits within Botpress's 128KB limit
 */
export async function compressImage(
  buffer: Buffer,
  maxSizeBytes: number = 120000 // Leave buffer below 131072 limit
): Promise<ImageProcessingResult> {
  const originalSize = buffer.length;
  let compressedBuffer: Buffer;
  let mimeType = "image/jpeg"; // Default to JPEG for better compression

  try {
    const sharpImage = sharp(buffer);
    const metadata = await sharpImage.metadata();

    // Resize if too large (max 1200px on longest side)
    let resized = sharpImage;
    if (metadata.width && metadata.height) {
      const maxDimension = 1200;
      if (
        metadata.width > maxDimension ||
        metadata.height > maxDimension
      ) {
        resized = sharpImage.resize(maxDimension, maxDimension, {
          fit: "inside",
          withoutEnlargement: true,
        });
      }
    }

    // Convert to JPEG and compress
    compressedBuffer = await resized
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    mimeType = "image/jpeg";

    // If still too large, reduce quality further
    let quality = 85;
    while (compressedBuffer.length > maxSizeBytes && quality > 30) {
      quality -= 10;
      compressedBuffer = await resized
        .jpeg({ quality, progressive: true })
        .toBuffer();
      console.log(
        `Compressed to ${compressedBuffer.length} bytes at quality ${quality}`
      );
    }

    // Last resort: resize more aggressively if still too large
    if (compressedBuffer.length > maxSizeBytes) {
      compressedBuffer = await sharpImage
        .resize(800, 800, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 70 })
        .toBuffer();
    }

    const compressedSize = compressedBuffer.length;
    const reduction = `${((1 - compressedSize / originalSize) * 100).toFixed(1)}%`;

    console.log("Image compressed:", {
      original: originalSize,
      compressed: compressedSize,
      reduction,
    });

    return {
      buffer: compressedBuffer,
      mimeType,
      originalSize,
      compressedSize,
      reduction,
    };
  } catch (error) {
    console.error("Sharp processing error, using original:", error);
    // Fallback to original if sharp fails
    return {
      buffer,
      mimeType: "image/jpeg",
      originalSize,
      compressedSize: originalSize,
      reduction: "0%",
    };
  }
}

/**
 * Converts a File object to Buffer
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

