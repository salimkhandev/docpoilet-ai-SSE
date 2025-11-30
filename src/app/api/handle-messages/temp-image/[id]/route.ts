import { getTempImage } from "@/lib/temp-image-store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const imageData = getTempImage(id);

    if (!imageData) {
      return NextResponse.json(
        { error: "Image not found or expired" },
        { status: 404 }
      );
    }

    return new NextResponse(imageData.buffer, {
      headers: {
        "Content-Type": imageData.mimeType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 }
    );
  }
}

