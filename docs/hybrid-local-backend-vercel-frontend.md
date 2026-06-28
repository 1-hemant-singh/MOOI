# Test: Local Backend + Hosted Frontend (Vercel)

Use this setup to keep the Express API on your laptop while the React app runs on Vercel.

## Why you need a tunnel

Vercel runs in the cloud. It **cannot** reach `http://localhost:4000` on your laptop.

You must expose your local backend with a public HTTPS URL using a tunnel:

| Tool | Install | Command |
|------|---------|---------|
| **ngrok** (easiest) | [ngrok.com/download](https://ngrok.com/download) | `ngrok http 4000` |
| Cloudflare Tunnel | cloudflared CLI | `cloudflared tunnel --url http://localhost:4000` |
| localtunnel | `npm i -g localtunnel` | `lt --port 4000` |

ngrok gives a URL like: `https://abc123.ngrok-free.app`

---

## What you need

| Item | Where | Notes |
|------|-------|-------|
| MongoDB Atlas | Cloud | Already works from your laptop |
| Express backend | Your laptop | `npm run server` |
| Tunnel | Your laptop | Forwards internet → port 4000 |
| React frontend | Vercel | `npm run build` deployed from GitHub |

---

## Step 1 — Backend `.env` on your laptop

```env
PORT=4000
HOST=127.0.0.1

# Your Vercel URL (set after first deploy, no trailing slash)
CLIENT_ORIGIN=https://your-mooi-app.vercel.app

JWT_SECRET=your-long-random-secret
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=mooi
```

When `CLIENT_ORIGIN` is `https://...`, cookies automatically use `secure: true` and `sameSite: none` (required for cross-site login).

---

## Step 2 — Start backend + tunnel

```bash
# Terminal 1
npm run server

# Terminal 2
ngrok http 4000
```

Copy the **https** ngrok URL (e.g. `https://abc123.ngrok-free.app`).

Test it:

```bash
curl https://abc123.ngrok-free.app/api/health
# → {"ok":true}
```

---

## Step 3 — Deploy frontend to Vercel

1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Framework: **Vite**
4. Build: `npm run build` · Output: `dist`
5. Add environment variable:

```env
VITE_API_BASE_URL=https://abc123.ngrok-free.app
```

6. Deploy

**Important:** ngrok free URLs change every restart. Update `VITE_API_BASE_URL` on Vercel and redeploy when the URL changes. (Paid ngrok gives a fixed subdomain.)

---

## Step 4 — Link frontend and backend

1. Note your Vercel URL: `https://your-mooi-app.vercel.app`
2. Update laptop `.env`:

```env
CLIENT_ORIGIN=https://your-mooi-app.vercel.app
```

3. Restart `npm run server`

---

## Step 5 — Verify

1. Open your Vercel URL in the browser
2. Sign up / log in
3. Create a post with an image
4. Like a post, open comments

If login fails, check:
- `CLIENT_ORIGIN` exactly matches Vercel URL (no trailing slash)
- `VITE_API_BASE_URL` is the ngrok **https** URL
- Backend and ngrok are both running
- Browser DevTools → Network: API calls go to ngrok, not localhost

---

## Limitations of this test setup

- Your **laptop must stay on** with backend + tunnel running
- **ngrok URL changes** on free tier after restart
- Uploaded images live on your laptop (`server/uploads/`)
- Anyone with the ngrok URL can hit your API while the tunnel is open

This is great for **testing**. For a real public app, deploy the backend to Render/Railway too.

---

## Quick checklist

- [ ] MongoDB Atlas connection works locally
- [ ] `npm run server` running
- [ ] ngrok tunnel to port 4000
- [ ] Vercel `VITE_API_BASE_URL` = ngrok https URL
- [ ] Laptop `.env` `CLIENT_ORIGIN` = Vercel https URL
- [ ] Backend restarted after `.env` change
