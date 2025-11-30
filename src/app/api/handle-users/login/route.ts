import { setUserSession } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password_hash as string
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await usersCollection.findOneAndUpdate(
      { _id: user._id },
      { $set: { updated_at: new Date() } }
    );

    const userKey = user.userKey as string;
    if (!userKey) {
      return NextResponse.json(
        { error: "User key not found" },
        { status: 500 }
      );
    }

    // Store user data in JWT for faster /me endpoint
    await setUserSession({
      userKey,
      userId: user._id.toString(),
      username: user.username,
      name: user.name,
      pictureUrl: user.picture_url || null,
      email: user.email || null,
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: user._id.toString(),
        username: user.username,
        name: user.name,
        pictureUrl: user.picture_url || null,
        email: user.email || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}

