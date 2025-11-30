import { getUserKeyFromCookie } from "@/lib/auth";
import {
    compressImage,
    fileToBuffer,
    validateImageFile,
} from "@/lib/image-processing";
import {
    canUseTemporaryStorage,
    storeImageTemporarily,
} from "@/lib/temp-image-storage";
import {
    getImgBBApiKey,
    uploadToImgBB,
} from "@/services/imgbb-service";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `https://chat.botpress.cloud/${process.env.BOT_ID}`;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/handle-messages/send-image
 * 
 * Handles image uploads, compression, and sending to Botpress
 * 
 * Request body (FormData):
 * - image: File - The image file to upload
 * - conversationId: string - The Botpress conversation ID
 * 
 * Returns:
 * - success: boolean
 * - text: string | null - AI response from Botpress
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const userKey = await getUserKeyFromCookie();
    if (!userKey) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const conversationId = formData.get("conversationId") as string | null;

    // Validate required fields
    if (!imageFile || !conversationId) {
      console.error("Missing required fields:", {
        hasImageFile: !!imageFile,
        hasConversationId: !!conversationId,
        imageFileType: imageFile?.constructor?.name,
      });
      return NextResponse.json(
        { error: "Image file and conversation ID are required" },
        { status: 400 }
      );
    }

    // Validate file object
    if (!(imageFile instanceof File)) {
      console.error("Image file is not a File object:", typeof imageFile);
      return NextResponse.json(
        { error: "Invalid file format" },
        { status: 400 }
      );
    }

    // Validate image file type and size
    const validation = validateImageFile(imageFile, MAX_FILE_SIZE);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Process and compress image
    let imageUrl: string;
    
    try {
      // Convert file to buffer
      const buffer = await fileToBuffer(imageFile);
      console.log("Original image size:", buffer.length, "bytes");

      // Compress image using sharp
      const compressionResult = await compressImage(buffer);
      const { buffer: compressedBuffer, mimeType } = compressionResult;

      // Upload to imgbb.com to get a publicly accessible URL
      try {
        const imgbbApiKey = getImgBBApiKey();
        imageUrl = await uploadToImgBB({
          apiKey: imgbbApiKey,
          imageBuffer: compressedBuffer,
          expiration: 3600, // 1 hour
        });
      } catch (uploadError) {
        console.error("Error uploading to imgbb.com:", uploadError);

        // Fallback: Try temporary storage if we have a public URL
        if (canUseTemporaryStorage(request)) {
          imageUrl = await storeImageTemporarily({
            buffer: compressedBuffer,
            mimeType,
            request,
          });
          console.log("Fallback: Image stored temporarily:", imageUrl);
        } else {
          return NextResponse.json(
            {
              error: "Failed to upload image to imgbb.com",
              details:
                uploadError instanceof Error
                  ? uploadError.message
                  : "Unknown error. Please check your IMGBB_API_KEY.",
            },
            { status: 500 }
          );
        }
      }
    } catch (processingError) {
      console.error("Error processing image:", processingError);
      return NextResponse.json(
        {
          error: "Failed to process image file",
          details:
            processingError instanceof Error
              ? processingError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }

    // Send image URL to Botpress
    const botpressResponse = await sendImageToBotpress({
      userKey,
      imageUrl,
      conversationId,
    });

    if (!botpressResponse.success) {
      return NextResponse.json(
        {
          error: botpressResponse.error || "Failed to send image to Botpress",
          details: botpressResponse.details,
        },
        { status: botpressResponse.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      text: botpressResponse.text,
    });
  } catch (error) {
    console.error("Error sending image:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error stack:", errorStack);

    return NextResponse.json(
      {
        error: "Failed to send image",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Sends image URL to Botpress
 * Botpress doesn't accept type: "image", so we use type: "audio" with audioUrl
 */
interface SendImageToBotpressOptions {
  userKey: string;
  imageUrl: string;
  conversationId: string;
}

interface BotpressResponse {
  success: boolean;
  text?: string | null;
  error?: string;
  details?: string;
  status?: number;
}

async function sendImageToBotpress(
  options: SendImageToBotpressOptions
): Promise<BotpressResponse> {
  const { userKey, imageUrl, conversationId } = options;

  const url = `${BASE_URL}/messages`;
  const requestBody = {
    payload: {
      type: "audio", // Botpress uses "audio" type even for images
      audioUrl: imageUrl,
    },
    conversationId,
  };

  console.log("Sending image to Botpress:", {
    url,
    conversationId,
    imageUrl,
    payloadType: requestBody.payload.type,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-user-key": userKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Parse response
    let data;
    try {
      const responseText = await response.text();
      console.log("Botpress response status:", response.status);
      console.log("Botpress response text:", responseText);

      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        data = {};
      }
    } catch (parseError) {
      console.error("Error parsing Botpress response:", parseError);
      return {
        success: false,
        error: "Invalid response from Botpress",
        details: "Failed to parse response",
        status: 500,
      };
    }

    if (!response.ok) {
      console.error("Botpress API error:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      return {
        success: false,
        error: "Failed to send image to Botpress",
        details: data.error || data.message || `Status: ${response.status}`,
        status: response.status,
      };
    }

    const aiResponse = data.message?.payload?.text || null;

    return {
      success: true,
      text: aiResponse,
    };
  } catch (error) {
    console.error("Error calling Botpress API:", error);
    return {
      success: false,
      error: "Failed to communicate with Botpress",
      details: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
}

