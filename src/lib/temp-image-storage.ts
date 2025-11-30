import { storeTempImage } from "./temp-image-store";

export interface TempImageStorageOptions {
  buffer: Buffer;
  mimeType: string;
  request: Request;
}

/**
 * Gets the base URL for the current request
 */
function getBaseUrl(request: Request): string {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol =
    request.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `${protocol}://${host}`)
  );
}

/**
 * Checks if the current host is localhost
 */
function isLocalhost(host: string): boolean {
  return (
    host.includes("localhost") &&
    !process.env.VERCEL_URL &&
    !process.env.NEXT_PUBLIC_BASE_URL
  );
}

/**
 * Stores an image temporarily and returns a public URL
 * Falls back to temporary storage if imgbb.com upload fails
 */
export async function storeImageTemporarily(
  options: TempImageStorageOptions
): Promise<string> {
  const { buffer, mimeType, request } = options;
  const baseUrl = getBaseUrl(request);
  const host = request.headers.get("host") || "localhost:3000";

  // Check if localhost - temporary storage won't work for Botpress
  if (isLocalhost(host)) {
    throw new Error(
      "Cannot use temporary storage on localhost. Botpress cannot access localhost URLs. Please configure IMGBB_API_KEY."
    );
  }

  return storeTempImage(buffer, mimeType, baseUrl);
}

/**
 * Validates if we can use temporary storage (not localhost)
 */
export function canUseTemporaryStorage(request: Request): boolean {
  const host = request.headers.get("host") || "localhost:3000";
  return !isLocalhost(host);
}

