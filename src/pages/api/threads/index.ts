// pages/api/threads/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth"; // we only need verifyToken here

function getUserIdFromReq(req: NextApiRequest): number | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const parsed = cookie.parse(raw);
  const token = parsed["token"];
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.uid ?? null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uid = getUserIdFromReq(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const threads = await prisma.thread.findMany({
          where: { participants: { some: { userId: uid } } },
          orderBy: { createdAt: "desc" },
          include: {
            participants: {
              include: { user: { select: { id: true, username: true } } },
            },
            messages: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        });

        const payload = threads.map((t) => ({
          id: t.id,
          createdAt: t.createdAt.toISOString(),
          participants: t.participants.map((p) => p.user),
          lastMessage: t.messages[0]
            ? {
                id: t.messages[0].id,
                content: t.messages[0].content,
                createdAt: t.messages[0].createdAt.toISOString(),
              }
            : null,
        }));

        return res.status(200).json(payload);
      }

      case "POST": {
        const { username: otherUsername } = req.body ?? {};
        const username =
          typeof otherUsername === "string" ? otherUsername.trim() : "";
        if (!username) {
          return res.status(400).json({ error: "Bad request" });
        }

        const other = await prisma.user.findUnique({ where: { username } });
        if (!other) {
          return res.status(404).json({ error: "User not found" });
        }

        const created = await prisma.thread.create({
          data: {
            participants: {
              createMany: { data: [{ userId: uid }, { userId: other.id }] },
            },
          },
          select: { id: true },
        });

        return res.status(200).json(created);
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end("Method Not Allowed");
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
