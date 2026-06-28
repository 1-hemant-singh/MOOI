# Comment Feature Implementation Journey

## Goal

Add a native comment system for blog posts without depending on Appwrite. A logged-in user can open comments on a post, read existing comments, write a new comment, reply to another comment, and like or unlike any comment.

## Problem Breakdown

The feature needed both backend and frontend work:

- Store comments permanently in MongoDB.
- Connect comments to posts and users.
- Support nested replies without making the UI too complex.
- Track likes per comment per user.
- Keep protected actions secure with cookie-based JWT auth.
- Keep read access aligned with post visibility.

## Backend Design

I added a dedicated MongoDB collection for comments instead of embedding comments inside posts. This keeps posts lightweight and lets comments grow independently.

The comment document stores:

- `postId`: the blog post the comment belongs to.
- `parentId`: `null` for top-level comments, or another comment id for replies.
- `authorId` and `authorName`: who wrote the comment.
- `content`: the comment text.
- `likedBy`: user ids that liked the comment.
- timestamps from Mongoose.

This design supports normal comments and replies using one model. A reply is just a comment with a `parentId`.

## API Design

The backend exposes three native endpoints:

- `GET /api/posts/:id/comments`: returns comments for a post as a nested tree.
- `POST /api/posts/:id/comments`: creates a top-level comment or reply.
- `POST /api/comments/:id/like`: toggles like/unlike for a comment.

The create and like endpoints require authentication. Reading comments follows the same visibility rule as reading a post, so inactive private posts are not exposed to random users.

## Important Backend Details

I kept the API response simple and frontend-friendly:

- Each comment response includes `id`, `authorName`, `content`, `likesCount`, `isLiked`, `createdAt`, and `replies`.
- `isLiked` is calculated from the current logged-in user.
- `likesCount` is calculated from the `likedBy` array.
- Invalid parent comment ids and invalid like ids are handled cleanly.
- When a post is deleted, its comments are deleted too.

## Frontend Design

I added a `CommentsPanel` component that is shown from the post page only after clicking the `Comments` button.

The panel handles:

- Loading comments for the current post.
- Creating new top-level comments.
- Opening a reply form under any comment.
- Creating replies.
- Toggling comment likes.
- Redirecting logged-out users to `/login` before protected actions.

The UI intentionally refetches comments after create/reply/like actions. This is simpler and reliable for a first implementation because the backend remains the source of truth for nested replies, like counts, and user-specific `isLiked`.

## Tradeoffs

I chose a separate `Comment` collection instead of embedding comments in the `Post` document. Embedded comments are simpler at first, but they become harder to manage as comments grow, replies get nested, and likes update frequently.

I also chose refetch-after-mutation instead of complex optimistic local updates. Optimistic updates can feel faster, but nested comments make local state updates error-prone. Refetching keeps correctness high and is acceptable for this stage of the project.

## Challenges Solved

- Replies: solved by using `parentId` and building a comment tree on the server.
- Likes: solved by storing user ids in `likedBy` and toggling membership.
- Auth: solved by using the existing `requireAuth` middleware.
- Visibility: solved by checking the parent post before returning or creating comments.
- Cleanup: solved by deleting comments when their post is deleted.

## Interview Explanation

I implemented comments as a full-stack feature. On the backend I created a separate Mongoose comment model, added REST endpoints for reading, creating, replying, and liking comments, and reused the existing JWT cookie auth middleware for protected actions. On the frontend I built a comments panel that opens from the post page, loads the nested comment tree, lets users add comments and replies, and refreshes after mutations so the UI always matches the database.

The main design decision was storing comments separately from posts. That made the system more scalable and easier to query. Replies are represented by a `parentId`, so both comments and replies use the same schema. Likes are stored as a list of user ids, which makes toggling likes straightforward and lets the API return both `likesCount` and whether the current user liked the comment.

## Files Changed

- `server/src/models/comment.model.js`
- `server/src/index.js`
- `src/services/comments.js`
- `src/components/CommentsPanel.jsx`
- `src/pages/Post.jsx`
