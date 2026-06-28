# Deploy MOOI (Vercel + Render)

Deploy the **frontend** to Vercel and the **backend** to Render. MongoDB stays on Atlas.

**Order:** Backend first → Frontend second → Link them together.

---

## Prerequisites

- GitHub repo pushed: `https://github.com/1-hemant-singh/MOOI`
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster with a connection string
- Free accounts on [Render](https://render.com) and [Vercel](https://vercel.com)

### MongoDB Atlas (one-time)

1. Atlas → **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
2. Atlas → **Database** → **Connect** → copy your `mongodb+srv://...` URI
3. Replace `<password>` with your real database user password

---

## Part 1 — Deploy backend (Render)

### 1. Create the web service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. **New +** → **Web Service**
3. Connect GitHub → select **MOOI** repo
4. Settings:

| Field | Value |
|-------|-------|
| **Name** | `mooi-api` (or any name) |
| **Region** | closest to you |
| **Branch** | `main` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### 2. Environment variables (Render dashboard → Environment)

Add these **before** clicking Deploy:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...` (your Atlas URI) |
| `MONGODB_DB_NAME` | `mooi` |
| `JWT_SECRET` | long random string (run `openssl rand -base64 32`) |
| `CLIENT_ORIGIN` | `https://placeholder.vercel.app` *(update after Part 2)* |

> `PORT` is set automatically by Render — do not add it.

### 3. Deploy and test

Click **Create Web Service**. Wait for deploy to finish.

Your API URL will look like:

```
https://mooi-api.onrender.com
```

Test in browser or terminal:

```
https://mooi-api.onrender.com/api/health
```

Expected: `{"ok":true}`

> **Free tier note:** Render sleeps after ~15 min idle. First request after sleep may take 30–60 seconds.

---

## Part 2 — Deploy frontend (Vercel)

### 1. Import project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import **MOOI** from GitHub
3. Framework Preset: **Vite** (auto-detected)

### 2. Build settings

| Field | Value |
|-------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3. Environment variable

Add **before** deploy:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://mooi-api.onrender.com` *(your Render URL, no trailing slash)* |

### 4. Deploy

Click **Deploy**. When done, Vercel gives you a URL like:

```
https://mooi-xxxxx.vercel.app
```

---

## Part 3 — Link frontend and backend

### 1. Update Render `CLIENT_ORIGIN`

Render dashboard → your service → **Environment**:

```
CLIENT_ORIGIN=https://mooi-xxxxx.vercel.app
```

Use your **exact** Vercel URL — no trailing slash.

Save → Render will redeploy automatically.

### 2. Verify cookies

After redeploy, check Render logs for:

```
CORS allowed origin: https://mooi-xxxxx.vercel.app
Cookie settings: secure=true, sameSite=none
```

---

## Part 4 — Test the live app

1. Open your Vercel URL
2. **Sign up** a new account
3. **Create a post** with a featured image
4. **Like** a post and open **Comments**
5. Check **My Posts** and **Edit/Delete**

### If login does not work

| Check | Fix |
|-------|-----|
| `CLIENT_ORIGIN` on Render | Must exactly match Vercel URL |
| `VITE_API_BASE_URL` on Vercel | Must be Render https URL |
| Browser DevTools → Network | API calls should go to `onrender.com`, not `localhost` |
| After changing Vercel env | **Redeploy** frontend (env vars are baked in at build time) |

---

## Environment variables cheat sheet

### Render (backend)

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=mooi
JWT_SECRET=<long-random-string>
CLIENT_ORIGIN=https://your-app.vercel.app
```

### Vercel (frontend)

```env
VITE_API_BASE_URL=https://mooi-api.onrender.com
```

### Local `.env` (your laptop)

Copy from `.env.example` — keep using `localhost` URLs for local dev.

---

## Known limitations (free tier)

| Item | Note |
|------|------|
| **Render sleep** | API slow on first request after idle |
| **Uploaded images** | Stored on Render disk — may be lost on redeploy |
| **Custom domain** | Optional on Vercel later |

For a portfolio demo, free tier is usually enough. For production, consider Render paid plan or Cloudinary for images.

---

## Redeploy after code changes

```bash
git add .
git commit -m "your message"
git push origin main
```

Both Render and Vercel auto-redeploy from `main`.

**Remember:** If you change `VITE_API_BASE_URL`, trigger a **manual redeploy** on Vercel.

---

## Architecture

```
https://your-app.vercel.app     ← React (Vercel)
         │
         │  API + cookies
         ▼
https://mooi-api.onrender.com   ← Express (Render)
         │
         ▼
MongoDB Atlas                   ← Database
```

---

## Troubleshooting

### `Failed to fetch` on signup/login
- Render service running? Check `/api/health`
- `VITE_API_BASE_URL` correct on Vercel?
- Redeploy Vercel after env change

### MongoDB connection failed (Render logs)
- Check `MONGODB_URI` password and username
- Atlas Network Access allows `0.0.0.0/0`

### Images upload but disappear later
- Expected on free Render — disk is ephemeral
- Future fix: Cloudinary or S3

### CORS error in browser console
- `CLIENT_ORIGIN` must match Vercel URL exactly (including `https://`)
