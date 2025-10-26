# Project Management Tool (Next.js + MUI + TypeScript)

A basic project management tool with authentication, projects, tasks, seed data, and Docker.

## Tech Stack
- Next.js (App Router, TypeScript)
- NextAuth (Credentials, JWT sessions)
- MongoDB (Mongoose)
- MUI (Material UI)
- React Hook Form + Yup (validation)
- Redux Toolkit (state management)
- Docker Compose (web + mongo)

## Prerequisites
- Node 18+ (Node 20 recommended)
- Docker (optional, for containerized setup)

## Getting Started (Local)
1. Copy envs:
```
cp .env.example .env.local
```
2. Update `NEXTAUTH_SECRET` with a secure value.
3. Start MongoDB (local or Docker):
   - Local: ensure MongoDB runs at `mongodb://localhost:27017`
   - Docker: `docker compose up -d mongo`
4. Install deps and run dev:
```
npm install --legacy-peer-deps
npm run dev
```
5. Seed database:
```
npm run seed
```
This creates:
- User: test@example.com / Test@123
- 2 projects with 3 tasks each

## Docker (Full)
```
docker compose up --build
```
App: http://localhost:3000

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — start production server
- `npm run seed` — seed database

## Features
- Register, login, logout with NextAuth (JWT-based sessions)
- Projects: CRUD via REST API routes
- Tasks: CRUD + filter by status
- MUI components, form validation
- Redux for project list state

## Known Limitations
- Minimal UI, limited error handling
- No pagination/search yet
- Auth uses Credentials provider (email/password)

## License
MIT
