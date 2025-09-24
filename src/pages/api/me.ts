// pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const raw = req.headers.cookie;
    if (!raw) return res.status(401).json({ error: "Unauthorized" });

    const parsed = cookie.parse(raw);
    const token = parsed["token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = verifyToken(token);
    const uid = payload?.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, username: true },
    });

    if (!user) return res.status(401).json({ error: "Unauthorized" });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
