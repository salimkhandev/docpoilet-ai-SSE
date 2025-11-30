import { setUserSession } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `https://chat.botpress.cloud/${process.env.BOT_ID}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, name, pictureUrl, email } = body;

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: "Username, password, and name are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    // const botpress_userId = `user_${username}_${Date.now()}`;


    const url = `${BASE_URL}/users`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: username,
        name: name,
        pictureUrl: pictureUrl || "",
        profile: JSON.stringify({
          email: email || "",
        }),
      }),
    };

    const response = await fetch(url, options);
    const botpressData = await response.json();

    if (!response.ok || !botpressData?.key) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    const userKey = botpressData.key;

    const result = await usersCollection.insertOne({
      username,
      password_hash,
      name,
      picture_url: pictureUrl || null,
      email: email || null,
      userKey,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const userId = result.insertedId.toString();

    // Store user data in JWT for faster /me endpoint
    await setUserSession({
      userKey,
      userId,
      username,
      name,
      pictureUrl: pictureUrl || null,
      email: email || null,
    });

    return NextResponse.json({
      success: true,
      data: {
        userId,
        username,
        name,
        pictureUrl: pictureUrl || null,
        email: email || null,
      },
      botpress: botpressData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user account" },
      { status: 500 }
    );
  }
}

