import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

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
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  // threadId from dynamic route
  const tid = Array.isArray(req.query.threadId)
    ? req.query.threadId[0]
    : req.query.threadId;
  const threadId = Number(tid);
  if (!Number.isInteger(threadId)) {
    return res.status(400).json({ error: "Bad threadId" });
  }

  try {
    switch (req.method) {
      case "GET": {
        // Optional query params
        const sinceIdStr =
          typeof req.query.sinceId === "string" ? req.query.sinceId : undefined;
        const limitStr =
          typeof req.query.limit === "string" ? req.query.limit : undefined;
        const sinceId = sinceIdStr ? Number(sinceIdStr) : undefined;
        const take = Math.min(Number(limitStr ?? 100), 200);

        const where = {
          threadId,
          ...(sinceId ? { id: { gt: sinceId } } : {}),
        };

        const items = await prisma.message.findMany({
          where,
          orderBy: { createdAt: "asc" },
          take,
          include: { author: { select: { id: true, username: true } } },
        });

        const payload = {
          items: items.map((m) => ({
            id: m.id,
            threadId: m.threadId,
            createdAt: m.createdAt.toISOString(),
            content: m.content,
            author: m.author,
          })),
          nextCursor: null as number | null,
        };

        return res.status(200).json(payload);
      }

      case "POST": {
        const content =
          typeof req.body?.content === "string" ? req.body.content : "";
        if (!content.trim()) {
          return res.status(400).json({ error: "Empty content" });
        }

        // Ensure the user is a participant in the thread
        const isParticipant = await prisma.threadParticipant.findFirst({
          where: { threadId, userId: uid },
          select: { threadId: true },
        });
        if (!isParticipant) {
          return res.status(403).json({ error: "Forbidden" });
        }

        const m = await prisma.message.create({
          data: { threadId, authorId: uid, content },
          include: { author: { select: { id: true, username: true } } },
        });

        const payload = {
          id: m.id,
          threadId: m.threadId,
          createdAt: m.createdAt.toISOString(),
          content: m.content,
          author: m.author,
        };

        return res.status(200).json(payload);
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
