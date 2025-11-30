import { getUserFromCookie } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userPayload = await getUserFromCookie();

    if (!userPayload) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Return user data directly from JWT - no database query needed!
    return NextResponse.json({
      success: true,
      data: {
        userId: userPayload.userId,
        username: userPayload.username,
        name: userPayload.name,
        pictureUrl: userPayload.pictureUrl,
        email: userPayload.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get user information" },
      { status: 500 }
    );
  }
}

