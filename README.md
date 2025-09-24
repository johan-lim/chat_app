# Messaging App

## 1. Purpose

This is a simple full-stack messaging app built as a coding assignment.  
It demonstrates:

- User authentication (login with username + password)
- Direct messaging threads (DMs)
- Real-time-like updates via polling (extendable to websockets)
- Type-safe API with Prisma + PostgreSQL

---

## 2. Tech Stack

- **Frontend**: Next.js (Pages router) + React + TypeScript + TailwindCSS
- **Backend**: Next.js API routes (Node.js)
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: Cookie-based JWT authentication (httpOnly cookies)
- **Dev Tools**: Docker Compose for database, Prisma Migrate + Seed

---

## 3. Getting Started

### Prerequisites

- Node.js (>= 18)
- Docker + Docker Compose

### 1. Clone the repo

```bash
git clone https://github.com/johan-lim/chat_app.git
cd chat_app
```

### 2. Startup postgres (you can use an existing local postgres if that makes more sense, just edit .env)

```bash
docker compose up -d
```

### 3. Install dependencies

```bash
npm install
```

### 4. Seed the database with users + some threads

```bash
npx prisma migrate dev
npm run prisma-seed
```

Example login credentials:

alice / password
bob / password
alice / password

### 5. Run the app

```bash
npm run dev
```

The app should be available on localhost:3000

## 4. Design Choices

- Next.js (Pages Router): Chosen for speed of development and built-in API routes.
- Prisma + Postgres: Type-safe database layer with a simple schema.
- JWT + cookies: Keeps auth simple, avoids extra libraries.
- Polling instead of websockets: Faster to implement within ~4h timeframe. Could be extended to WebSockets or subscriptions if more time were available.
- Seeded users: Registration was skipped to save time, per assignment instructions.
