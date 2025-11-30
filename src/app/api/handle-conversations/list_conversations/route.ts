import { getUserKeyFromCookie } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `https://chat.botpress.cloud/${process.env.BOT_ID}`;

export async function GET(request: NextRequest) {
  try {
    const userKey = await getUserKeyFromCookie();

    if (!userKey) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    const url = `${BASE_URL}/conversations?limit=${limit}&offset=${offset}`;
    const options = {
      method: "GET",
      headers: {
        "x-user-key": userKey,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    // console.log(data);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to list conversations" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || { conversations: [] },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list conversations" },
      { status: 500 }
    );
  }
}

