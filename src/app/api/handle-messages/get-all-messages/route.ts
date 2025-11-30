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
    const conversationId = searchParams.get("conversationId");
    
    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const url = `${BASE_URL}/conversations/${conversationId}/messages`;
    const options = {
      method: "GET",
      headers: {
        "x-user-key": userKey,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

