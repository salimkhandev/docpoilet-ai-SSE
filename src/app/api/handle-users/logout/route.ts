import { clearUserSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await clearUserSession();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}

