# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Setup
```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# Edit .env.local and set NEXTAUTH_SECRET to a secure value
npm run seed  # Creates test user (test@example.com / Test@123) and sample data
```

### Development
```bash
npm run dev     # Start dev server at http://localhost:3000
npm run build   # Production build
npm start       # Start production server
npm run lint    # Run ESLint
```

### Database
```bash
npm run seed                        # Seed database with test user and sample projects/tasks
docker compose up -d mongo          # Start MongoDB only
docker compose up --build           # Start full stack (Next.js + MongoDB)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router) with TypeScript
- **Authentication**: NextAuth v4 with JWT sessions and Credentials provider
- **Database**: MongoDB via Mongoose (dbname: "pmtool")
- **UI**: Material UI (MUI) v7 with Emotion styling
- **State**: Redux Toolkit (client-side project list state)
- **Forms**: React Hook Form + Yup validation
- **HTTP**: Axios for API calls, SWR for data fetching

### Project Structure
```
app/
  api/                      # REST API routes (require authentication)
    auth/[...nextauth]/     # NextAuth handler
    projects/               # Project CRUD endpoints
    tasks/                  # Task CRUD endpoints
    register/               # User registration endpoint
  (pages)/                  # UI pages
    login/, register/, dashboard/, projects/[id]/

components/
  Providers.tsx             # Client wrapper: SessionProvider + Redux + MUI Theme

lib/
  db.ts                     # MongoDB connection with caching
  validators.ts             # Yup schemas (registerSchema, projectSchema, taskSchema)

models/
  User.ts                   # Mongoose schema: email (unique), passwordHash, name
  Project.ts                # Mongoose schema: user ref, title, description, status (active|completed)
  Task.ts                   # Mongoose schema: project ref, title, description, status (todo|in-progress|done), dueDate

store/
  index.ts                  # Redux store configuration
  projectsSlice.ts          # Redux slice: fetchProjects async thunk
```

### Key Patterns

**Authentication Flow:**
- NextAuth with JWT sessions stored client-side
- All API routes check session via `getServerSession(authOptions)`
- User ID injected into JWT token callbacks and available as `session.user.id`
- Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char

**Database Connection:**
- `dbConnect()` uses global caching to avoid connection exhaustion in serverless
- All models use `models.ModelName || model()` pattern for hot reload compatibility
- User-scoped queries: Projects filtered by `user` field, Tasks filtered by `project.user`

**API Structure:**
- REST conventions: GET (list/single), POST (create), PATCH (update), DELETE
- All mutations validate input with Yup schemas before DB operations
- Error responses: 401 (unauthorized), 404 (not found), 400 (validation), 500 (server error)
- List endpoints support pagination via query params: `?page=1&limit=10`
- API returns: `{ items, pagination: { page, limit, total, totalPages } }`

**Client-Side State:**
- Dashboard and project detail pages use local state with axios for data fetching
- Pagination state managed per-component (page, limit, total, totalPages)
- MUI Pagination component handles page navigation
- Component-level state via React Hook Form for forms

**Data Relationships:**
- User → Projects (one-to-many via `user` field)
- Project → Tasks (one-to-many via `project` field)
- Deleting a project does NOT cascade delete tasks (orphaned tasks remain)

## Environment Variables

Required in `.env.local`:
- `MONGODB_URI` - MongoDB connection string (e.g., mongodb://localhost:27017/pmtool)
- `NEXTAUTH_URL` - Application URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET` - JWT signing secret (must be set to a secure random value)

## Important Notes

- **Install dependencies**: Always use `npm install --legacy-peer-deps` due to React 19 peer dependency conflicts
- **TypeScript**: Path alias `@/*` maps to project root
- **Mongoose models**: Use conditional export pattern to prevent recompilation errors in dev mode
- **No type checking script**: Run `npx tsc --noEmit` manually to type check without ESLint
- **Authentication**: API routes require `getServerSession(authOptions)` - import authOptions from auth route
- **Docker**: Dev Dockerfile uses hot-reload via volume mounts; mongo persists data in named volume
