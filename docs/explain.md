# MOOI — Project Explanation

> **Estimated read time:** 12–15 minutes  
> This document explains what MOOI is, what users can do on the website, and how it is built under the hood. Use it for presentations, portfolio write-ups, or onboarding a new developer.

---

## 1. What is MOOI?

**MOOI** is a full-stack blogging platform — a place where people can sign up, write rich-text posts with images, browse a shared feed, like content, and hold threaded discussions through comments.

At a high level, think of it as a lightweight, self-hosted alternative to platforms like Medium or Dev.to, but scoped to your own deployment. Users get a personal writing space, a public reading experience, and social features (likes and comments) without needing a third-party backend-as-a-service.

The name **mooi** (Dutch for “beautiful”) reflects the design goal: a polished, dark-themed reading and writing experience with smooth interactions — animated like buttons, a rich text editor, and a consistent purple/indigo visual identity.

---

## 2. Who is it for? (Non-technical overview)

### For readers
- Anyone can open a **public post URL** and read the full article, even without logging in.
- Logged-in users see a **Home feed** of all active posts from every author on the platform.
- Readers can **like posts** and open the **comments panel** to join the conversation.

### For writers
- After signing up, users can **create posts** with a title, featured image, rich HTML content, and a publish status (`active` or `inactive`).
- Writers manage their own content from **My Posts** — a dashboard showing only posts they authored.
- On posts they own, **Edit** and **Delete** controls appear on the post detail page.
- Inactive posts are hidden from the public feed but still visible to the author in My Posts — useful for drafts or archived content.

### For you (the builder)
- MOOI is a portfolio-grade project demonstrating authentication, CRUD, file uploads, nested data (comments), and a clean React frontend talking to a custom REST API.
- It also documents a real migration story: the app **started on Appwrite** and was later moved to **Express + MongoDB** while keeping the UI largely intact.

---

## 3. User journeys (step by step)

### Journey A — New visitor becomes a member

1. User lands on the site. If not logged in, protected pages redirect to **Login**.
2. User clicks **Signup**, enters name, email, and password.
3. The backend creates an account, hashes the password, issues a JWT session cookie, and the user is redirected to **Home**.
4. Redux stores the user profile so the header shows **My Posts**, **Add Post**, and **Logout** instead of Login/Signup.

### Journey B — Writing and publishing

1. User clicks **Add Post** in the header.
2. They fill in a title (slug auto-generates from the title), write content in the **TinyMCE** rich text editor, upload a featured image, and choose **active** or **inactive** status.
3. On submit, the image uploads first, then the post is saved to MongoDB.
4. User is redirected to the new post’s detail page at `/post/{slug}`.

### Journey C — Engaging with content

1. From **Home**, the user browses post cards showing title, author, featured image, and like count.
2. They can like directly from a card (heart icon with hover animation) or open the post for the full experience.
3. On the post page, they use **Like**, see the live count, and toggle **Comments** to open the discussion panel.
4. Inside comments: write a top-level comment, **reply** to someone (nested thread), or **like** individual comments.

### Journey D — Managing your own posts

1. User opens **My Posts** (`/all-posts`) to see every post they wrote, including inactive ones.
2. Clicking a card opens the detail page where **Edit** and **Delete** appear in the top-right (author only).
3. **Edit** opens the same form pre-filled with existing data; a new image optionally replaces the old one.
4. **Delete** removes the post, its featured file, and all associated comments.

### Journey E — Logging out

1. User clicks **Logout** in the header.
2. Session cookie is cleared, Redux auth state resets, and the user is sent to Login.
3. They can still read public post URLs, but liking, commenting, and writing require signing in again.

---

## 4. Pages and navigation

| Route | Page | Auth required? | Purpose |
|-------|------|----------------|---------|
| `/` | Home | Yes | Feed of all **active** posts from all users |
| `/login` | Login | No | Sign in (redirects home if already logged in) |
| `/signup` | Signup | No | Register (redirects home if already logged in) |
| `/all-posts` | My Posts | Yes | Author’s own posts (all statuses) |
| `/add-post` | Add Post | Yes | Create a new post |
| `/edit-post/:slug` | Edit Post | Yes | Update an existing post (author only) |
| `/post/:slug` | Post detail | No* | Read, like, comment; edit/delete if author |

\*Post detail is public for **active** posts. Inactive posts are only visible to their author.

### Layout shell

Every page shares:
- A **fixed header** with the MOOI logo (links to Home) and context-aware navigation.
- A **footer** with placeholder company/support/legal links.
- A centered **Container** (`max-w-7xl`) for readable content width.

The visual theme uses custom Tailwind colors: `indigo-ink`, `lavender-purple`, `mauve-magic`, and `royal-violet` — giving a cohesive dark-purple aesthetic.

---

## 5. Features in detail

### 5.1 Authentication & security

- Passwords are hashed with **bcryptjs** before storage — never saved in plain text.
- Sessions use **JWT** stored in an **httpOnly cookie** named `mooi_token`, so JavaScript cannot read the token directly (mitigates XSS token theft).
- All authenticated API calls send `credentials: "include"` so the browser attaches the cookie automatically.
- Route guards on the frontend (`AuthLayout`) prevent unauthenticated access to writing and feed pages.
- The backend independently verifies the JWT on protected endpoints — frontend guards are UX, not security.

### 5.2 Posts

Each post stores:
- **title** — display heading
- **slug** — used as MongoDB `_id` and in URLs (auto-generated from title)
- **content** — HTML from TinyMCE
- **featuredImage** — ID referencing an uploaded file
- **status** — `active` (public feed) or `inactive` (author-only visibility)
- **userid** / **authorName** — ownership and display
- **likedBy** — array of user IDs for like tracking

Posts support full **CRUD**: create, read, update, delete. Delete is cascading: featured image file and all comments for that post are removed.

### 5.3 Likes

- One click toggles like/unlike on posts and comments.
- The API returns updated `likesCount` and `isLiked` so the UI reflects state immediately after the request.
- The UI uses an **IconActionButton** with an animated heart SVG — scales up on hover, fills red when liked.

### 5.4 Comments

- Threaded discussions via optional `parentId` on replies.
- Max comment length: **2000 characters** with a live counter in the form.
- Comment likes work the same way as post likes.
- The `CommentsPanel` loads on demand when the user clicks the Comments button on a post.
- Unauthenticated users who try to comment or like are redirected to Login.

### 5.5 File uploads

- Featured images only: PNG, JPG, JPEG, GIF.
- **5 MB** upload limit enforced by Multer on the server.
- Files are stored on disk in `server/uploads/`; metadata (owner, mime type, size) lives in MongoDB.
- Images are served at `GET /api/files/:id` with visibility tied to post status.
- Replacing an image on edit deletes the old file from storage.

### 5.6 Rich text editing

- **TinyMCE** runs locally via the npm package — no Tiny Cloud API key required.
- Writers get formatting tools for headings, lists, links, and more.
- Post content is rendered on the detail page with `html-react-parser`.

---

## 6. Technical architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ Redux       │  │ React Router │  │ Local state    │ │
│  │ (auth only) │  │ (7 routes)   │  │ posts/comments │ │
│  └──────┬──────┘  └──────────────┘  └────────────────┘ │
│         │                                                │
│  ┌──────┴──────────────────────────────────────────┐   │
│  │ API clients (fetch + credentials: include)       │   │
│  │  • src/appwrite/auth.js    → /api/auth/*         │   │
│  │  • src/appwrite/config.js  → posts, files, likes │   │
│  │  • src/services/comments.js → comments API       │   │
│  └──────┬──────────────────────────────────────────┘   │
└─────────┼───────────────────────────────────────────────┘
          │ HTTP (localhost:5173 → localhost:4000)
          ▼
┌─────────────────────────────────────────────────────────┐
│              Express 5 API (server/src/index.js)       │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐  │
│  │ JWT auth │  │ Multer   │  │ Mongoose models     │  │
│  │ middleware│  │ uploads  │  │ User, Post, File,   │  │
│  └──────────┘  └──────────┘  │ Comment             │  │
│                               └──────────┬──────────┘  │
└──────────────────────────────────────────┼──────────────┘
                                           │
                    ┌──────────────────────┴──────────────┐
                    ▼                                      ▼
            MongoDB Atlas                          server/uploads/
         (users, posts, files,                  (binary image files)
          comments metadata)
```

### Why the folder is still called `appwrite/`

The project originally used the **Appwrite** BaaS (Backend as a Service). During migration, the Appwrite SDK calls were replaced with `fetch` wrappers, but the folder name `src/appwrite/` was kept to minimize churn. The `appwrite` npm package is still listed in `package.json` but is **not imported** anywhere — it is a leftover dependency.

The API response shape intentionally mirrors Appwrite conventions (`$id`, `$createdAt`, `$updatedAt`) so the React components did not need a full rewrite.

---

## 7. Tech stack reference

### Frontend
| Tool | Role |
|------|------|
| **React 18** | UI components and pages |
| **Vite 4** | Dev server and production bundler |
| **Tailwind CSS 3** | Utility-first styling with custom color palette |
| **React Router 6** | Client-side routing |
| **Redux Toolkit** | Global auth state (`status`, `userData`) |
| **React Hook Form** | Post create/edit form handling |
| **TinyMCE** | WYSIWYG rich text editor |
| **html-react-parser** | Safely render post HTML on detail page |

### Backend
| Tool | Role |
|------|------|
| **Node.js + Express 5** | REST API server |
| **Mongoose 8** | MongoDB ODM and schemas |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT creation and verification |
| **multer** | Multipart file upload handling |
| **cookie-parser** | Read `mooi_token` from requests |
| **cors** | Allow frontend origin with credentials |

### Infrastructure
| Piece | Detail |
|-------|--------|
| **Database** | MongoDB Atlas (cloud-hosted) |
| **File storage** | Local disk (`server/uploads/`) |
| **Frontend URL** | `http://localhost:5173` (Vite default) |
| **Backend URL** | `http://localhost:4000` |
| **Config** | `VITE_API_BASE_URL` (frontend), `.env` (backend) |

---

## 8. API overview

All endpoints live in `server/src/index.js`.

### Auth
- `POST /api/auth/register` — create account + set session cookie
- `POST /api/auth/login` — authenticate + set cookie
- `GET /api/auth/me` — return current user or `null`
- `POST /api/auth/logout` — clear cookie

### Posts
- `GET /api/posts?status=active` — public feed
- `GET /api/posts?scope=all` — current user’s posts (auth required)
- `GET /api/posts/:id` — single post
- `POST /api/posts` — create
- `PATCH /api/posts/:id` — update (author only)
- `DELETE /api/posts/:id` — delete (author only, cascades)
- `POST /api/posts/:id/like` — toggle like

### Comments
- `GET /api/posts/:id/comments` — nested comment tree
- `POST /api/posts/:id/comments` — create comment or reply
- `POST /api/comments/:id/like` — toggle comment like

### Files
- `POST /api/files` — upload image
- `GET /api/files/:id` — serve image
- `DELETE /api/files/:id` — delete (owner only)

### Health
- `GET /api/health` — `{ ok: true }` for uptime checks

---

## 9. Data models (MongoDB)

### User
- `name`, `email` (unique), `passwordHash`
- Timestamps: `createdAt`, `updatedAt`

### Post
- `_id` = URL slug (string, not ObjectId)
- `title`, `content`, `featuredImage`, `status`, `userid`, `authorName`
- `likedBy: [userId, ...]`

### FileEntry
- `_id` = UUID
- `ownerId`, `originalName`, `storedName`, `mimeType`, `size`

### Comment
- `postId`, `parentId` (null for top-level)
- `authorId`, `authorName`, `content` (max 2000 chars)
- `likedBy: [userId, ...]`

---

## 10. State management strategy

**Redux** handles only authentication:
- `auth.status` — boolean logged-in flag
- `auth.userData` — `{ $id, name, email, ... }`

Everything else — posts list, single post, comments, like counts — uses **local React state** (`useState` + `useEffect`) inside page and component files. Data is refetched after mutations rather than using optimistic updates.

On app startup, `App.jsx` calls `getCurrentUser()`, shows a loading screen, then dispatches `login` or `logout` before rendering routes.

---

## 11. Migration story (why this project is interesting)

MOOI is not just a greenfield blog — it documents a real refactor:

| Before (Appwrite) | After (Custom backend) |
|-------------------|------------------------|
| Appwrite Auth sessions | JWT httpOnly cookies |
| Appwrite Database collections | Mongoose models on MongoDB |
| Appwrite Storage buckets | Local disk + FileEntry model |
| Appwrite SDK in frontend | `fetch` API wrappers |

Challenges solved along the way:
- **Blank startup screen** — added explicit loading state during auth check
- **TinyMCE cloud key** — switched to self-hosted TinyMCE npm package
- **401 console noise** — `getCurrentUser()` silently returns `null` for logged-out users
- **Author attribution** — `authorName` denormalized onto posts at creation time
- **Like system** — `likedBy` arrays with toggle endpoint and UI feedback

This migration pattern — preserve frontend contracts, swap the backend — is a common real-world approach when outgrowing a BaaS or needing more control.

---

## 12. UI components worth highlighting

| Component | Purpose |
|-----------|---------|
| `PostCard` | Feed card with image, title, author, animated like button |
| `IconActionButton` | Reusable icon+label button (like, comment, edit, delete, reply) with hover/active animations |
| `CommentsPanel` | Full comment thread with forms, replies, and nested rendering |
| `PostForm` | Shared create/edit form with slug auto-generation |
| `RTE` | TinyMCE wrapper for rich content |
| `AuthLayout` | Route guard wrapper for protected pages |
| `Header` / `Footer` | Global navigation shell |

---

## 13. Running the project locally

```bash
# Terminal 1 — backend
npm run server

# Terminal 2 — frontend
npm run dev
```

Backend needs a `.env` with at least `MONGODB_URI` and ideally a strong `JWT_SECRET`. Frontend talks to `http://localhost:4000` by default (`VITE_API_BASE_URL`).

Verification checklist:
1. `GET http://localhost:4000/api/health` returns `{ ok: true }`
2. Signup creates a user and lands on Home
3. Add Post uploads image and saves content
4. Post detail shows author name, likes, and comments
5. Logout clears session and redirects to Login

---

## 14. Known limitations & future improvements

These are honest gaps — useful to mention in a technical interview or README:

- Home empty state always says “Login to read posts” even when logged in with zero posts.
- Email validation is basic (no OTP or verification flow).
- Posts on Home remain visible briefly after logout (client-side state not cleared).
- `vercel.json` supports frontend-only SPA deploy; backend must run separately.
- No admin panel, search, tags, or pagination yet.
- Comment updates/deletes are not implemented — only create and like.

---

## 15. Summary

**MOOI** is a local full-stack blog with:

- **User auth** (register, login, logout, JWT cookies)
- **Post management** (CRUD, rich text, featured images, active/inactive status)
- **Social features** (post likes, threaded comments, comment likes)
- **Modern React UI** (dark theme, animated actions, responsive cards)
- **Custom Express API** backed by **MongoDB** and **local file storage**

It demonstrates end-to-end web development — from database schema design and REST API auth to Redux session hydration and polished frontend interactions — in a single cohesive project you can run entirely on your own machine.

---

*For a step-by-step video demo script with sample posts and narration, see [walkthrough.md](./walkthrough.md).*
