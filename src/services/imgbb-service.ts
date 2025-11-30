/**
 * ImgBB.com API Service
 * Handles image uploads to imgbb.com for publicly accessible URLs
 * Documentation: https://api.imgbb.com/
 */

export interface ImgBBUploadResponse {
  success: boolean;
  status: number;
  data?: {
    id: string;
    title: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      url: string;
    };
    medium: {
      url: string;
    };
    delete_url: string;
  };
  error?: {
    message: string;
    code?: string;
  };
}

export interface ImgBBUploadOptions {
  apiKey: string;
  imageBuffer: Buffer;
  expiration?: number; // in seconds (60-15552000)
}

/**
 * Uploads an image to imgbb.com and returns the public URL
 */
export async function uploadToImgBB(
  options: ImgBBUploadOptions
): Promise<string> {
  const { apiKey, imageBuffer, expiration = 3600 } = options;

  // Convert buffer to base64
  const base64Image = imageBuffer.toString("base64");

  // Construct form data
  const formDataBody = new URLSearchParams();
  formDataBody.append("key", apiKey);
  formDataBody.append("image", base64Image);
  formDataBody.append("expiration", expiration.toString());

  // Upload to imgbb.com API v1
  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formDataBody.toString(),
  });

  const data: ImgBBUploadResponse = await response.json();

  if (!response.ok || !data.success || !data.data?.url) {
    const errorMessage =
      data.error?.message ||
      `imgbb API error: ${response.status} - ${JSON.stringify(data)}`;
    throw new Error(errorMessage);
  }

  console.log("Image uploaded to imgbb.com:", {
    url: data.data.url,
    displayUrl: data.data.display_url,
    size: data.data.size,
    id: data.data.id,
  });

  return data.data.url;
}

/**
 * Gets the imgbb.com API key from environment variables
 */
export function getImgBBApiKey(): string {
  return (
    process.env.IMGBB_API_KEY || "7c701d96eb0d92df20f261a1c95fc6d4"
  );
}

