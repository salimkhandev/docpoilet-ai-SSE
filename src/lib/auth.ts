import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface UserPayload {
  userKey: string;
  userId: string;
  username: string;
  name: string;
  pictureUrl: string | null;
  email: string | null;
}

export function createUserToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyUserToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getUserKeyFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("userKey")?.value || null;
  if (!token) return null;
  const payload = verifyUserToken(token);
  return payload?.userKey || null;
}

export async function getUserFromCookie(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("userKey")?.value || null;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function setUserSession(payload: UserPayload): Promise<void> {
  const token = createUserToken(payload);
  const cookieStore = await cookies();
  cookieStore.set("userKey", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearUserSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("userKey");
}

