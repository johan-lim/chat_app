import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Users
  const [alice, bob, carol] = await Promise.all([
    prisma.user.upsert({
      where: { username: "alice" },
      update: {},
      create: {
        username: "alice",
        password: await bcrypt.hash("password", 10),
      },
    }),
    prisma.user.upsert({
      where: { username: "bob" },
      update: {},
      create: { username: "bob", password: await bcrypt.hash("password", 10) },
    }),
    prisma.user.upsert({
      where: { username: "carol" },
      update: {},
      create: {
        username: "carol",
        password: await bcrypt.hash("password", 10),
      },
    }),
  ]);

  // Alice ↔ Bob thread with a couple of messages
  const thread = await prisma.thread.create({
    data: {
      participants: {
        createMany: { data: [{ userId: alice.id }, { userId: bob.id }] },
      },
      messages: {
        create: [
          { authorId: alice.id, content: "Hi Bob!" },
          { authorId: bob.id, content: "Hey Alice 👋" },
        ],
      },
    },
  });

  // Bob ↔ Carol empty thread
  await prisma.thread.create({
    data: {
      participants: {
        createMany: { data: [{ userId: bob.id }, { userId: carol.id }] },
      },
    },
  });

  console.log("Seeded users and threads. Example thread id:", thread.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
