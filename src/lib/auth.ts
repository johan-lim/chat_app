// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type JWTPayload = { uid: number };

export function signToken(uid: number) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign({ uid } satisfies JWTPayload, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getUserIdFromCookie(): Promise<number | null> {
  const cookieStore = await cookies(); // async now
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.uid ?? null;
}
