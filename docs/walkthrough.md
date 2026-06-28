# MOOI — Video Demo Walkthrough Script

> **Target video length:** 10–12 minutes  
> **Format:** Screen recording + voiceover  
> **Prerequisites:** Backend (`npm run server`) and frontend (`npm run dev`) running locally

---

## Before you record

### 1. Start both servers

```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

Open `http://localhost:5173` in a clean browser window (incognito works well — no leftover cookies).

### 2. Create two demo accounts

You will use **two accounts** to show author vs. reader interactions and comments from different users.

| Account | Name | Email | Password | Role in demo |
|---------|------|-------|----------|--------------|
| **Account A** | Alex Rivera | `alex@mooi.demo` | `demo1234` | Main presenter — creates most posts |
| **Account B** | Jordan Lee | `jordan@mooi.demo` | `demo1234` | Second user — likes and comments |

### 3. Pre-create 4 posts as Alex (or create them live)

Use the dummy content below. Create **4 active posts** and optionally **1 inactive draft** for the My Posts section.

Have a featured image ready for each post (any JPG/PNG under 5 MB — screenshots, stock photos, or placeholders).

---

## Dummy post content (copy-paste ready)

### Post 1 — `getting-started-with-react-hooks`

**Title:** Getting Started with React Hooks  
**Status:** Active  
**Featured image:** Any code editor or React logo screenshot  

**Content (paste into TinyMCE):**

```
React Hooks changed how we write components. Instead of class-based lifecycle methods, we get simple functions like useState and useEffect.

Here are three hooks every React developer should know:

1. useState — manages local component state
2. useEffect — runs side effects after render
3. useCallback — memoizes functions to avoid unnecessary re-renders

The best part? Hooks work in functional components, which are easier to read and test.

If you are migrating from class components, start with useState and useEffect. Master those first before reaching for useReducer or custom hooks.
```

---

### Post 2 — `weekend-in-jaipur`

**Title:** A Weekend in Jaipur  
**Status:** Active  
**Featured image:** Travel/street/architecture photo  

**Content:**

```
Last month I spent two days in Jaipur — the Pink City — and it was everything I hoped for.

Day 1: Amer Fort in the morning (go early to beat the heat), then lunch at a rooftop café overlooking the old city. The mirror work inside the fort is unreal.

Day 2: Hawa Mahal, Johari Bazaar for block-print textiles, and sunset at Nahargarh Fort. Best view of the city.

Travel tip: hire a local guide at Amer Fort. The stories behind the architecture make the visit ten times better.

Total budget for two days: roughly ₹4,500 including food, entry tickets, and transport. Absolutely worth it.
```

---

### Post 3 — `perfect-masala-chai`

**Title:** The Perfect Masala Chai at Home  
**Status:** Active  
**Featured image:** Cup of chai or kitchen photo  

**Content:**

```
You do not need a café to make great chai. Here is my everyday recipe.

Ingredients:
- 1 cup water
- ½ cup milk
- 1 tsp loose black tea (Assam works best)
- 2 cardamom pods, lightly crushed
- 1 small piece of ginger, grated
- Sugar to taste

Steps:
1. Boil water with ginger and cardamom for 2 minutes.
2. Add tea leaves. Simmer 1 minute — do not overcook or it turns bitter.
3. Pour in milk. Bring to a rolling boil once, then turn off the heat.
4. Strain into a cup. Add sugar. Done.

The secret is the boil after adding milk. That one rolling boil brings everything together.
```

---

### Post 4 — `why-i-built-mooi`

**Title:** Why I Built MOOI  
**Status:** Active  
**Featured image:** Screenshot of your MOOI homepage or logo  

**Content:**

```
Every developer hits a point where tutorials are not enough — you need to build something real.

MOOI started as a blog backed by Appwrite. I wanted auth, file uploads, and a database without wiring everything from scratch. It worked, but I wanted more control.

So I migrated the entire backend to Express and MongoDB. Same React frontend. Same user experience. Completely different infrastructure under the hood.

What I learned:
- Preserve your API response shape during migrations — it saves weeks of frontend rewrites.
- JWT cookies beat localStorage tokens for browser security.
- Features like likes and threaded comments are simple in concept but touch every layer: schema, API, and UI state.

MOOI is my sandbox for full-stack ideas. This post is proof it works.
```

---

### Post 5 (optional draft) — `draft-post-on-typescript`

**Title:** Draft: TypeScript Tips I Keep Forgetting  
**Status:** **Inactive** (draft)  
**Featured image:** Any dev-related image  

**Content:**

```
This is a draft post — work in progress.

Planned sections:
- keyof vs typeof
- Generics in React component props
- Utility types: Partial, Pick, Omit

Stay tuned. This will be published soon.
```

> Keep this as **inactive** so it only appears in My Posts, not the public Home feed.

---

## Recording script

Use the **[ACTION]** tags for what to do on screen and **[SAY]** tags for what to speak.  
Pause 1–2 seconds between sections so edits are easier.

---

### Scene 1 — Introduction (0:00 – 1:00)

**[ACTION]** Show the MOOI login page. Slowly pan across the header logo and the Login / Signup buttons.

**[SAY]**
> "Hi, I'm [your name], and this is **MOOI** — a full-stack blogging platform I built with React, Express, and MongoDB.
>
> MOOI lets users sign up, write rich-text posts with images, browse a shared feed, like content, and have threaded comment discussions — all running locally on my machine.
>
> In this demo I'll walk you through signup, creating posts, social interactions, and author tools. Let's get started."

---

### Scene 2 — Signup & first login (1:00 – 2:00)

**[ACTION]** Click **Signup**. Fill in Alex's details (`Alex Rivera`, `alex@mooi.demo`, `demo1234`). Submit.

**[SAY]**
> "New users start at the signup page. I enter my name, email, and password. The backend hashes the password with bcrypt, creates a MongoDB user record, and sets a secure JWT session cookie — so I stay logged in without storing tokens in JavaScript.
>
> After signup I'm redirected straight to the Home feed."

**[ACTION]** Land on Home (may be empty). Point at the welcome message and header nav: **My Posts**, **Add Post**, **Logout**.

**[SAY]**
> "The header adapts once I'm authenticated. I can jump to My Posts, create a new post, or log out. Redux tracks my session on the frontend, while the real security lives in the API middleware on the backend."

---

### Scene 3 — Creating the first post (2:00 – 4:00)

**[ACTION]** Click **Add Post**. Type the title: **Getting Started with React Hooks**. Show the slug auto-generating.

**[SAY]**
> "Let's create our first post. The title automatically becomes a URL-friendly slug — that slug is actually the post's ID in the database.
>
> The content editor is TinyMCE, running locally without any cloud API key. I get full rich-text formatting for headings, lists, and paragraphs."

**[ACTION]** Paste Post 1 content into the editor. Upload a featured image. Keep status as **Active**. Click submit.

**[SAY]**
> "I upload a featured image — the server stores it on disk and saves the metadata in MongoDB. When I hit submit, the post is created and I land on the detail page.
>
> Notice the layout: hero image on top, title and author, action buttons for like and comments, and the rendered HTML content below."

**[ACTION]** Hover over the **Like** heart icon (show scale animation). Click **Comments** to open the panel.

**[SAY]**
> "The action buttons use animated SVG icons — the heart scales on hover and fills red when liked. Comments load on demand in a panel below the article, so the page stays fast when you just want to read."

---

### Scene 4 — Home feed & liking from cards (4:00 – 5:00)

**[ACTION]** Click the MOOI logo to go Home. If only one post shows, quickly create Post 2 (*A Weekend in Jaipur*) — or show the feed if you pre-created posts.

**[SAY]**
> "The Home feed shows every active post from all authors on the platform. Each card displays the featured image, title, author name, and like count.
>
> I can like a post directly from the feed without opening it — the heart button toggles instantly and the count updates."

**[ACTION]** Like a post from the card. Click a post card to open the detail page.

**[SAY]**
> "Clicking a card opens the full post. Post detail pages are actually public — anyone with the link can read an active post, even without an account. Liking and commenting require login."

---

### Scene 5 — Second user & comments (5:00 – 7:00)

**[ACTION]** Click **Logout**. Sign up or log in as **Jordan Lee** (`jordan@mooi.demo`).

**[SAY]**
> "To show social features properly, let me switch to a second account — Jordan. This simulates a real reader engaging with Alex's content."

**[ACTION]** Open Alex's React Hooks post. Click **Like**. Open **Comments**. Write a comment:

> "Great breakdown! useCallback is the one I always forget until performance issues show up."

Submit the comment.

**[SAY]**
> "Jordan likes the post and leaves a comment. Comments support up to two thousand characters, and the form shows a live character count.
>
> Now let me reply to simulate a threaded conversation."

**[ACTION]** Log out. Log back in as **Alex**. Open the same post → Comments. Click **Reply** on Jordan's comment. Write:

> "Same here — useCallback saves me every time I pass handlers to memoized child components."

Submit. Like Jordan's comment.

**[SAY]**
> "Replies nest under the parent comment, creating a thread. Both posts and comments have their own like system. The backend stores likes as arrays of user IDs and toggles membership on each click."

---

### Scene 6 — My Posts & draft status (7:00 – 8:30)

**[ACTION]** Still as Alex, click **My Posts** in the header.

**[SAY]**
> "My Posts is the author dashboard. Unlike the Home feed, this page shows only posts I wrote — including inactive drafts that are hidden from everyone else."

**[ACTION]** If you created the TypeScript draft (Post 5, inactive), point it out. Also show the published posts.

**[SAY]**
> "See this draft? It's marked inactive, so it never appears on the public feed. But I can still see and manage it here. This is useful for work-in-progress articles."

**[ACTION]** Click into one of your posts. Point at **Edit** and **Delete** in the top-right corner.

**[SAY]**
> "On my own posts, Edit and Delete appear aligned with the title. Only the author sees these — the API enforces ownership on the backend too, not just the UI."

---

### Scene 7 — Editing a post (8:30 – 9:30)

**[ACTION]** Click **Edit**. Change the title slightly (e.g., add "— A Quick Guide" to the React Hooks post). Optionally swap the featured image. Save.

**[SAY]**
> "The edit form is the same component as create, pre-filled with existing data. If I upload a new image, the old file is deleted from storage automatically.
>
> After saving, I'm redirected back to the updated post. The slug stays the same since it's the database ID."

---

### Scene 8 — Architecture overview (9:30 – 10:30)

**[ACTION]** Optionally show a split screen: browser on the left, VS Code on the right with `server/src/index.js` or the project folder tree. Or stay on the UI and use a simple diagram slide.

**[SAY]**
> "Under the hood, MOOI is a React and Vite frontend talking to an Express API on port 4000. MongoDB Atlas stores users, posts, comments, and file metadata. Uploaded images live on local disk.
>
> The project actually started on Appwrite and was migrated to this custom backend — the frontend API wrappers still live in a folder called appwrite, but everything goes through fetch calls with cookie-based auth now.
>
> Redux handles session state. Posts and comments use local component state and refetch after each action."

---

### Scene 9 — Closing (10:30 – 11:00)

**[ACTION]** Return to the Home feed showing multiple posts. Slowly scroll through the cards. End on the MOOI logo or post detail page.

**[SAY]**
> "That was MOOI — a full-stack blog with authentication, rich-text publishing, image uploads, likes, and threaded comments.
>
> It runs entirely on my local machine with MongoDB and Express, and the UI is built with React, Tailwind, and animated interactions for a polished reading experience.
>
> Thanks for watching. The full technical breakdown is in explain.md, and the source code is in the repository. See you in the next one."

**[ACTION]** Fade out or stop recording.

---

## Quick-reference shot list

| # | Shot | Duration |
|---|------|----------|
| 1 | Login page + intro | ~1 min |
| 2 | Signup → Home | ~1 min |
| 3 | Add Post form → post detail | ~2 min |
| 4 | Home feed + card likes | ~1 min |
| 5 | Second user comments + reply thread | ~2 min |
| 6 | My Posts + draft + edit/delete buttons | ~1.5 min |
| 7 | Edit post flow | ~1 min |
| 8 | Architecture mention (code or diagram) | ~1 min |
| 9 | Closing on feed | ~30 sec |

**Total: ~11 minutes**

---

## Tips for a polished recording

1. **Use incognito** between account switches so cookies do not clash.
2. **Pre-create posts 2–4** before recording if you want Scene 4–5 to flow without live typing.
3. **Zoom browser to 110%** so text and buttons are readable on video.
4. **Hide bookmarks bar** and close unrelated tabs.
5. **Move mouse deliberately** — pause on buttons before clicking so viewers can follow.
6. If a request is slow, **keep talking** about what is happening (e.g., "the image is uploading to the server...").
7. Record at **1080p** if possible. OBS, Loom, or QuickTime all work fine.

---

## Troubleshooting during recording

| Problem | Fix |
|---------|-----|
| Blank screen on load | Wait for auth check; ensure backend is running |
| "Failed to fetch" on signup | Start `npm run server`; check `MONGODB_URI` in `.env` |
| Image not showing | Verify file uploaded; check `server/uploads/` exists |
| Comments not loading | Confirm backend comment routes are running (same server process) |
| Edit/Delete not visible | You must be logged in as the post's author |

---

*For the full technical explanation of MOOI, see [explain.md](./explain.md).*
