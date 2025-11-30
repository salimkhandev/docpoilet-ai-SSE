import { getUserKeyFromCookie } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `https://chat.botpress.cloud/${process.env.BOT_ID}`;

export async function DELETE(request: NextRequest) {
  try {
    const userKey = await getUserKeyFromCookie();

    if (!userKey) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Conversation id is required" },
        { status: 400 }
      );
    }

    const url = `${BASE_URL}/conversations/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "x-user-key": userKey,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to delete conversation" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}

