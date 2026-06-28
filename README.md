# MOOI

Local full-stack blog app built with React, Vite, Express, MongoDB, and Mongoose.

The project started as an Appwrite-backed app. During this work session, the backend was replaced with a custom Express API and MongoDB storage so the app can run fully from your machine.

## What Was Done

### Backend migration

- Replaced Appwrite auth, database, and storage usage with a local Express backend.
- Added MongoDB integration through Mongoose.
- Added JWT cookie-based authentication.
- Added local file upload support for featured images.
- Preserved the existing frontend data shape as much as possible so the UI did not need a full rewrite.

### Frontend migration

- Replaced the Appwrite client wrappers with fetch-based API wrappers.
- Kept the React app mostly intact and redirected it to `http://localhost:4000`.
- Made the home feed require login.
- Added author name display on posts.
- Added like and unlike functionality.
- Removed the Tiny Cloud dependency so the rich text editor works without an external API key.

## Current Architecture

### Frontend

- React
- Vite
- Redux Toolkit
- React Router
- React Hook Form
- TinyMCE for rich text editing

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- bcryptjs for password hashing
- jsonwebtoken for session tokens
- multer for file uploads
- cookie-parser and cors for browser session handling

### Storage

- Users: MongoDB
- Posts: MongoDB
- File metadata: MongoDB
- Uploaded image files: local disk in `server/uploads/`

## Important Files

- [src/main.jsx](/home/hemant/cp/mooi1/MOOI/src/main.jsx)
- [src/App.jsx](/home/hemant/cp/mooi1/MOOI/src/App.jsx)
- [src/appwrite/auth.js](/home/hemant/cp/mooi1/MOOI/src/appwrite/auth.js)
- [src/appwrite/config.js](/home/hemant/cp/mooi1/MOOI/src/appwrite/config.js)
- [src/pages/Home.jsx](/home/hemant/cp/mooi1/MOOI/src/pages/Home.jsx)
- [src/pages/Post.jsx](/home/hemant/cp/mooi1/MOOI/src/pages/Post.jsx)
- [src/components/PostCard.jsx](/home/hemant/cp/mooi1/MOOI/src/components/PostCard.jsx)
- [src/components/RTE.jsx](/home/hemant/cp/mooi1/MOOI/src/components/RTE.jsx)
- [server/src/index.js](/home/hemant/cp/mooi1/MOOI/server/src/index.js)
- [server/src/config.js](/home/hemant/cp/mooi1/MOOI/server/src/config.js)
- [server/src/lib/mongoose.js](/home/hemant/cp/mooi1/MOOI/server/src/lib/mongoose.js)
- [server/src/models/user.model.js](/home/hemant/cp/mooi1/MOOI/server/src/models/user.model.js)
- [server/src/models/post.model.js](/home/hemant/cp/mooi1/MOOI/server/src/models/post.model.js)
- [server/src/models/file.model.js](/home/hemant/cp/mooi1/MOOI/server/src/models/file.model.js)

## What Broke During Migration

### 1. Blank screen on app startup

At first the React app showed a blank screen for a couple of seconds before the login page appeared. The root cause was the app waiting on the initial auth check before rendering.

Fix:

- Added a visible loading state in `App.jsx`.
- Made `getCurrentUser()` return `null` cleanly when the user is not logged in.
- Added a timeout around API calls so the UI does not hang forever if the backend stalls.

### 2. TinyMCE cloud API key error

The editor was loading from Tiny Cloud and required an API key. That caused the editor to show read-only warnings and invalid key messages.

Fix:

- Switched TinyMCE to the local `tinymce` npm package.
- Removed the `apiKey` requirement from `RTE.jsx`.

### 3. Backend health endpoint hanging

`http://localhost:4000/api/health` initially hung because the backend was waiting on MongoDB connection startup without clear logging.

Fix:

- Added MongoDB connection logging.
- Added timeouts for MongoDB server selection and socket connections.
- Verified Atlas connectivity from the local machine.

### 4. 401 noise for logged-out users

When the user was not logged in, `/api/auth/me` returned `401 Unauthorized`. That caused noisy console errors and made the startup flow feel broken.

Fix:

- Changed the auth check so the frontend treats logged-out users as `null`.
- Kept the backend route returning a normal JSON response with `user: null`.

### 5. Logged-out users could still see posts

The home feed was visible even when the user was logged out.

Fix:

- Protected the home route with the existing auth guard.
- Redirected logged-out users to `/login`.

### 6. Posts had no author names

Posts showed content but did not clearly show who created them.

Fix:

- Added `authorName` to the post schema and API responses.
- Rendered the author name in the feed and individual post view.

### 7. No like feature

The app had no post like/unlike action.

Fix:

- Added a `likedBy` array to the post schema.
- Added `POST /api/posts/:id/like`.
- Added like/unlike controls in `Home` and `Post`.

## Debugging Notes

- Browser console messages like `Unchecked runtime.lastError: The message port closed before a response was received` were not caused by the app. That is usually a browser extension issue.
- The real app-side issue was the backend request flow and initial auth loading behavior.
- Once the backend and frontend were both started properly, the app became usable.

## Environment

Create a local `.env` file from `.env.example`.

Expected values:

```env
VITE_API_BASE_URL=http://localhost:4000
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-long-random-secret
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=mooi
```

## How To Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start backend

```bash
npm run server
```

Expected terminal output:

```text
Connecting to MongoDB...
MongoDB connected
MOOI backend listening on http://localhost:4000
```

### 3. Start frontend

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## How To Verify It Works

- Visit `http://localhost:4000/api/health`
- Sign up a new user
- Log in
- Create a post with a featured image
- Confirm the author name is shown
- Confirm like/unlike works
- Confirm logged-out users get redirected to login

## Current Behavior

- Logged-out users are redirected to `/login`
- Logged-in users can access the home feed
- Posts are stored in MongoDB
- Featured images are stored locally
- Posts show the author name and like count
- Users can like/unlike posts

## Notes For Future Work

- Add comments
- Add profile pages
- Add an admin view if needed
- Backfill old MongoDB posts so they all have `authorName`
- Optionally move uploaded files to cloud storage later if local disk is not enough

## Important Reminder

Do not commit secrets to git.

- `.env` stays local only
- MongoDB credentials should remain in your local environment
- Uploaded assets remain ignored by git
