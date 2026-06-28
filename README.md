# DocuVault 🔐

> **The Ultimate Life Admin Vault** — A secure, full-stack document management platform for organizing vital documents, tracking expiry dates, and receiving automated renewal reminders.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Architecture](#project-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [Database Schema](#database-schema)
8. [API Reference](#api-reference)
9. [Authentication Flow](#authentication-flow)
10. [Document Storage & Security](#document-storage--security)
11. [Background Worker & Notifications](#background-worker--notifications)
12. [Environment Variables](#environment-variables)
13. [Setup & Installation](#setup--installation)
14. [Running in Development](#running-in-development)
15. [Deployment](#deployment)

---

## Overview

DocuVault is a production-ready document vault application that lets users securely upload, categorize, and track important documents (passports, contracts, insurance policies, etc.) with expiry dates. The system proactively monitors expiry dates through a scheduled background worker and delivers both in-app and email notifications before documents expire.

---

## Features

### Core Features
- **Secure Document Upload** — Upload PDFs and images via drag-and-drop; files stored with authenticated access control on Cloudinary.
- **Signed URL Retrieval** — Document URLs are never exposed publicly; every download link is a time-limited (1-hour) cryptographic signed URL.
- **Expiry Tracking** — Set expiry dates and lead-time reminders (e.g., "notify me 30 days before").
- **Document Status Badges** — Documents are automatically classified as `valid`, `expiring`, or `expired`.
- **Custom Categories** — Create color-coded categories (e.g., Identity, Travel, Finance, Health) with per-user isolation.
- **Dashboard Statistics** — Live counts of total, valid, expiring, and expired documents.
- **In-App Notifications** — Notification center with unread badges, mark-as-read, and per-notification deletion.
- **Email Notifications** — Automated expiry reminder emails via Resend.
- **Dark / Light Mode** — Theme toggle persisted across sessions.
- **Responsive UI** — Sidebar navigation with mobile-friendly layout.

### Authentication Features
- **Email / Password Auth** — Bcrypt-hashed passwords, JWT-based sessions.
- **Google OAuth 2.0** — One-click sign-in with Google.
- **GitHub OAuth** — One-click sign-in with GitHub.
- **Account Deletion** — Users can permanently delete their account and all associated data.
- **Auto-seeded Categories** — New accounts automatically receive four default categories: Identity, Travel, Finance, and Health.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + Vite 8 |
| Frontend Styling | Tailwind CSS v4 + Framer Motion |
| Frontend Routing | React Router v7 |
| Frontend Data Fetching | TanStack Query (React Query) v5 + Axios |
| Backend Framework | Express.js v5 (TypeScript) |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Neon Serverless / standard pg) |
| Authentication | Passport.js (Google & GitHub OAuth) + JWT |
| File Storage | Cloudinary (authenticated access mode) |
| Email Delivery | Resend |
| Background Jobs | node-cron |
| Language | TypeScript (both frontend and backend) |

---

## Project Architecture

```
DocuVault/
├── Frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context (AuthContext)
│   │   ├── pages/             # Route-level page components
│   │   ├── services/          # Axios API client layer
│   │   └── main.tsx           # App entry point
│   ├── vite.config.ts         # Vite config (proxy, port 5000)
│   └── package.json
│
├── Backend/                   # Express.js TypeScript API
│   ├── src/
│   │   ├── config/            # Passport strategies, Cloudinary config
│   │   ├── controllers/       # Route handler logic
│   │   ├── db/                # Drizzle ORM schema + connection
│   │   ├── middlewares/       # JWT authentication middleware
│   │   ├── routes/            # Express route definitions
│   │   ├── utils/             # Resend email utility
│   │   ├── index.ts           # API server entry point (port 3000)
│   │   └── worker.ts          # Cron job entry point
│   ├── drizzle.config.ts      # Drizzle Kit configuration
│   └── package.json
│
└── README.md
```

---

## Frontend Architecture

### Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Marketing page with feature highlights and CTAs |
| `/login` | Login / Signup | Unified auth page for local and OAuth flows |
| `/dashboard` | Dashboard | Stats overview, recent alerts, quick actions |
| `/vault` | Vault | Searchable document grid with status badges and actions |
| `/notifications` | Notifications | Notification center with read/delete management |

### Key Components

| Component | Purpose |
|---|---|
| `Layout` | App shell — sidebar nav, global search bar, theme toggle, notification bell, profile dropdown |
| `UploadModal` | File dropzone (PDF/image), metadata form (title, expiry date, category, lead-time days) |
| `ManageCategoriesModal` | Create, view, and delete color-coded document categories |
| `DatePicker` | Custom expiry date input with validation |
| `AuthContext` | Global auth state: `user`, `login()`, `logout()`, token persistence via `localStorage` |

### Data Flow

```
AuthContext (localStorage token)
    └─> Axios instance (Bearer header injected automatically)
            └─> TanStack Query (caching, refetching, mutations)
                    └─> Page components + UI state
```

### API Proxy (Development)

Vite proxies all `/api/*` requests from port `5000` (frontend) to port `3000` (backend), eliminating CORS issues in development:

```ts
// vite.config.ts
server: {
  host: '0.0.0.0',
  port: 5000,
  proxy: {
    '/api': { target: 'http://localhost:3000', changeOrigin: true }
  }
}
```

---

## Backend Architecture

### Directory Structure

```
Backend/src/
├── config/
│   ├── passport.ts        # Google + GitHub Passport strategies
│   └── cloudinary.ts      # Cloudinary SDK configuration
├── controllers/
│   ├── auth.controller.ts        # signup, login, deleteAccount
│   ├── document.controller.ts    # upload, list (with signed URLs), delete
│   ├── category.controller.ts    # list, create, delete
│   ├── notification.controller.ts# list, mark read, delete
│   └── stats.controller.ts       # dashboard aggregate query
├── db/
│   ├── schema.ts          # Drizzle table definitions + relations
│   └── index.ts           # pg Pool connection + Drizzle instance
├── middlewares/
│   └── auth.ts            # JWT Bearer token verification middleware
├── routes/
│   ├── auth.routes.ts
│   ├── document.routes.ts
│   ├── category.routes.ts
│   └── notification.routes.ts
├── utils/
│   └── resend.ts          # Email sending utility
├── index.ts               # Express app bootstrap (port 3000)
└── worker.ts              # Cron job (runs daily at midnight)
```

### Middleware Stack

```
Request
  └─> CORS
  └─> express.json()
  └─> passport.initialize()
  └─> authenticateToken (on protected routes)
  └─> Controller
```

---

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `name` | text | Required |
| `email` | text | Unique, required |
| `password` | text | Nullable (OAuth users have no password) |
| `google_id` | text | Nullable |
| `github_id` | text | Nullable |
| `created_at` | timestamp | Auto-set |

### `categories`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users (cascade delete) |
| `name` | text | Required |
| `color` | text | Hex color, default `#3b82f6` |
| `created_at` | timestamp | Auto-set |

### `documents`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users (cascade delete) |
| `category_id` | UUID | FK → categories (set null on delete) |
| `title` | text | Required |
| `expiry_date` | date | Required |
| `file_url` | text | Cloudinary public URL (not served directly) |
| `cloudinary_public_id` | text | Used for signed URL generation and deletion |
| `status` | enum | `valid` \| `expiring` \| `expired` |
| `created_at` | timestamp | Auto-set |

### `reminders`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `document_id` | UUID | FK → documents (cascade delete) |
| `lead_time_days` | integer | Days before expiry to notify (default 30) |
| `last_notified_at` | timestamp | Nullable, updated on notification send |

### `notifications`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users (cascade delete) |
| `document_id` | UUID | FK → documents (cascade delete) |
| `type` | enum | `email` \| `in-app` |
| `message` | text | Notification body text |
| `is_read` | boolean | Default `false` |
| `created_at` | timestamp | Auto-set |

### Entity Relationships

```
users ──< categories
users ──< documents ──< reminders
users ──< notifications
documents >── categories (optional)
documents ──< notifications
```

---

## API Reference

All protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description | Request Body |
|---|---|---|---|---|
| POST | `/signup` | No | Register with email & password | `{ name, email, password }` |
| POST | `/login` | No | Login with email & password | `{ email, password }` |
| DELETE | `/account` | Yes | Delete authenticated user account | — |
| GET | `/google` | No | Initiate Google OAuth flow | — |
| GET | `/google/callback` | No | Google OAuth callback | — |
| GET | `/github` | No | Initiate GitHub OAuth flow | — |
| GET | `/github/callback` | No | GitHub OAuth callback | — |

**Signup / Login Response:**
```json
{
  "user": { "id": "uuid", "name": "Jane Doe", "email": "jane@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**OAuth Success Redirect:**
```
GET /login?token=<jwt>&user=<url-encoded-json>
```

---

### Document Routes — `/api/documents`

| Method | Endpoint | Auth | Description | Request |
|---|---|---|---|---|
| POST | `/` | Yes | Upload a document | `multipart/form-data` |
| GET | `/` | Yes | List all user documents | — |
| DELETE | `/:id` | Yes | Delete a document | Param: `id` |

**Upload Request (multipart/form-data):**
```
file          — The file (PDF or image)
title         — Document title (string)
categoryId    — Category UUID (optional)
expiryDate    — ISO date string (YYYY-MM-DD)
leadTimeDays  — Days before expiry for reminder (number, default 30)
```

**List Documents Response:**
```json
[
  {
    "id": "uuid",
    "title": "Passport",
    "expiryDate": "2027-03-15",
    "status": "valid",
    "fileUrl": "https://res.cloudinary.com/...?signature=...&expires_at=...",
    "category": { "id": "uuid", "name": "Identity", "color": "#3b82f6" }
  }
]
```
> `fileUrl` is a **signed URL** valid for 1 hour. Never the raw Cloudinary URL.

---

### Category Routes — `/api/categories`

| Method | Endpoint | Auth | Description | Request Body |
|---|---|---|---|---|
| GET | `/` | Yes | List user's categories | — |
| POST | `/` | Yes | Create a category | `{ name, color }` |
| DELETE | `/:id` | Yes | Delete a category | Param: `id` |

**Response:**
```json
[{ "id": "uuid", "name": "Finance", "color": "#f59e0b", "createdAt": "..." }]
```

---

### Notification Routes — `/api/notifications`

| Method | Endpoint | Auth | Description | Request |
|---|---|---|---|---|
| GET | `/` | Yes | List all notifications | — |
| POST | `/mark-read` | Yes | Mark all notifications as read | — |
| POST | `/:id/read` | Yes | Mark one notification as read | Param: `id` |
| DELETE | `/:id` | Yes | Delete a notification | Param: `id` |

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "in-app",
    "message": "Your document 'Passport' expires in 28 days.",
    "isRead": false,
    "createdAt": "2026-06-01T00:00:00.000Z"
  }
]
```

---

### Stats Route — `/api/stats`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/stats` | Yes | Dashboard aggregate statistics |

**Response:**
```json
{
  "total": 12,
  "valid": 8,
  "expiring": 3,
  "expired": 1,
  "notifications": [...]
}
```

---

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Service health check |

```json
{ "status": "ok" }
```

---

## Authentication Flow

### Email / Password

```
1. POST /api/auth/signup  →  hash password (bcrypt) → insert user → sign JWT → return token
2. POST /api/auth/login   →  find user → compare hash → sign JWT → return token
3. All protected requests →  "Authorization: Bearer <token>" → verify JWT → attach user to req
```

### OAuth (Google / GitHub)

```
1. User clicks "Sign in with Google" on frontend
2. Frontend navigates to GET /api/auth/google
3. Passport redirects to Google consent screen
4. Google calls back to GET /api/auth/google/callback
5. Passport retrieves profile:
   a. If user exists (by googleId) → use existing user
   b. If email exists (different login) → link googleId to account
   c. If new user → create account + seed default categories
6. Backend signs JWT
7. Backend redirects to: /login?token=<jwt>&user=<encoded-json>
8. Frontend AuthContext parses URL params, stores in localStorage
```

### JWT Middleware

```ts
// Every protected route:
authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}
```

---

## Document Storage & Security

### Upload Flow

```
1. User selects file in UploadModal
2. Frontend POSTs multipart/form-data to /api/documents
3. multer buffers the file in memory
4. Backend uploads buffer to Cloudinary with:
   - resource_type: 'auto'
   - access_mode: 'authenticated'   ← prevents public URL access
5. Cloudinary returns { public_id, secure_url }
6. Backend stores public_id + metadata in PostgreSQL
```

### Retrieval Flow

```
1. GET /api/documents (authenticated)
2. For each document, backend calls:
   cloudinary.url(public_id, {
     sign_url: true,
     expires_at: Date.now() + 3600,  // 1 hour
     resource_type: 'auto'
   })
3. Signed URL returned to frontend — expires automatically
```

### Deletion Flow

```
1. DELETE /api/documents/:id (authenticated)
2. Backend verifies document belongs to requesting user
3. cloudinary.uploader.destroy(cloudinary_public_id)
4. Document record deleted from PostgreSQL (cascades to reminders + notifications)
```

---

## Background Worker & Notifications

**File:** `Backend/src/worker.ts`
**Schedule:** Daily at midnight (`0 0 * * *`) via `node-cron`

### Worker Logic

```
Every day at 00:00:
  1. Query all documents with status = 'valid' or 'expiring'
  2. For each document:
     a. Calculate diffDays = expiryDate - today
     b. If diffDays <= 0:
        → Update status to 'expired'
     c. Else if diffDays <= leadTimeDays (from reminders table):
        → Send expiry email via Resend (if RESEND_API_KEY set)
        → Insert in-app notification into DB
        → Insert 'email' type notification into DB
        → Update document status to 'expiring'
        → Update reminders.last_notified_at = now()
```

### Email Format

```
From:    DocuVault <alerts@resend.dev>
Subject: Action Required: <document title> is expiring soon!
Body:    HTML email with days remaining and login CTA
```

> If `RESEND_API_KEY` is not set, the worker logs the email to console instead of sending it (safe for development).

---

## Environment Variables

Create a `.env` file in the project root (or `Backend/.env` for backend-only setup):

```env
# ─── Database ───────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host:5432/dbname

# ─── JWT ────────────────────────────────────────────────
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# ─── Google OAuth ───────────────────────────────────────
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ─── GitHub OAuth ───────────────────────────────────────
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# ─── Cloudinary ─────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ─── Email (Resend) ──────────────────────────────────────
RESEND_API_KEY=re_your_resend_api_key

# ─── URLs ───────────────────────────────────────────────
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5000

# ─── Server ─────────────────────────────────────────────
PORT=3000
NODE_ENV=development
```

### Getting Credentials

| Service | How to Obtain |
|---|---|
| **PostgreSQL** | [Neon](https://neon.tech) (free tier) or any PostgreSQL host |
| **JWT_SECRET** | Run `openssl rand -hex 32` in terminal |
| **Google OAuth** | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials |
| **GitHub OAuth** | GitHub → Settings → Developer Settings → OAuth Apps |
| **Cloudinary** | [cloudinary.com](https://cloudinary.com) → Dashboard |
| **Resend** | [resend.com](https://resend.com) → API Keys |

### OAuth Redirect URIs to Configure

**Google Cloud Console** — Add these Authorized redirect URIs:
```
http://localhost:3000/api/auth/google/callback
https://your-production-domain.com/api/auth/google/callback
```

**GitHub OAuth App** — Set Authorization callback URL:
```
http://localhost:3000/api/auth/github/callback
```

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- npm v8+
- A PostgreSQL database (local or cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/docuvault.git
cd docuvault
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### 3. Configure Environment

```bash
# Copy the example env file to the project root
cp .env.example .env

# Edit with your credentials
nano .env
```

### 4. Push the Database Schema

```bash
cd Backend
npm run db:push
```

This applies the Drizzle ORM schema (creates all tables) to your PostgreSQL database.

### 5. (Optional) Open Drizzle Studio

```bash
cd Backend
npm run db:studio
```

Opens a web-based database browser at `https://local.drizzle.studio`.

---

## Running in Development

### Start the Backend API (port 3000)

```bash
cd Backend
npm run dev
```

The backend uses `tsx watch` for hot-reload on TypeScript changes.

### Start the Frontend (port 5000)

```bash
cd Frontend
npm run dev
```

Vite proxies `/api/*` to `http://localhost:3000` automatically.

### Start the Background Worker (optional)

```bash
cd Backend
npm run dev:worker
```

Runs the cron worker in watch mode. Fires daily at midnight, or trigger manually for testing.

### Access the App

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## Deployment

### Build for Production

```bash
# Build backend
cd Backend
npm run build        # outputs compiled JS to Backend/dist/

# Build frontend
cd ../Frontend
npm run build        # outputs static files to Frontend/dist/
```

### Production Run Commands

**Backend:**
```bash
cd Backend && node dist/index.js
```

**Worker (separate process):**
```bash
cd Backend && node dist/worker.js
```

**Frontend (serve static files):**
Serve `Frontend/dist/` with any static file server (Nginx, Caddy, etc.).

### Environment Notes for Production

- Set `NODE_ENV=production`
- Set `BACKEND_URL` and `FRONTEND_URL` to your actual production domains
- Update OAuth redirect URIs in Google Console and GitHub to match production URLs
- Ensure your PostgreSQL database is accessible from the production server

---

## License

MIT — see [LICENSE](LICENSE) for details.
