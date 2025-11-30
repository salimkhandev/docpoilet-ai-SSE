import { getUserKeyFromCookie } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `https://chat.botpress.cloud/${process.env.BOT_ID}`;

export async function POST(request: NextRequest) {
  try {
    const userKey = await getUserKeyFromCookie();

    if (!userKey) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { message, conversationId } = await request.json();

    if (!message || !conversationId) {
      return NextResponse.json(
        { error: "Message and conversation ID are required" },
        { status: 400 }
      );
    }

    const url = `${BASE_URL}/messages`;
    const options = {
      method: "POST",
      headers: {
        "x-user-key": userKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: {
          type: "text",
          text: message,
        },
        conversationId: conversationId,
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    const aiResponse = data.message.payload?.text || null;

    return NextResponse.json({
      success: true,
      text: aiResponse,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

