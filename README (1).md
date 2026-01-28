# Music-Mind

Music-Mind is a personal analytics & recommendations app that analyzes a user's Spotify listening history and surfaces insights (top genres, mood score, top tracks) alongside recommendation tooling. The repository contains a Node/Express backend, a Vite-powered React frontend, and a small data pipeline area for future Python/ML work.

Languages: JavaScript, CSS, Python, HTML

---

## Table of contents
- [Project overview](#project-overview)
- [Repository structure](#repository-structure)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Quickstart — local development](#quickstart--local-development)
  - [Prerequisites](#prerequisites)
  - [Backend setup](#backend-setup)
  - [Frontend setup](#frontend-setup)
  - [Database & cache](#database--cache)
- [Environment variables](#environment-variables)
- [Deployment notes](#deployment-notes)
- [Troubleshooting — analytics / frontend shows no data](#troubleshooting---analytics--frontend-shows-no-data)
- [Testing & debug endpoints](#testing--debug-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Project overview
- Frontend requests analytics via a small API contract and renders dashboards and insight pages.
- Backend authenticates users via Spotify OAuth, fetches user top artists/tracks, computes analytics (genres, mood score), caches results, and persists analytics to the database.
- A data pipeline folder is present for future/experimental Python work (recommendation engine integration).

---

## Repository structure
- `/frontend` — Vite + React frontend (hooks + components).
- `/backend` — Express server, services, utilities (analytics algorithm, db, cache, services).
- `/data_pipeline` — Python scripts / experiments (future).
- `/docs` — API contract and documentation.
- `render.yaml` — deployment manifest present (used by Render or similar).

---

## Key features
- OAuth-based Spotify authentication.
- API endpoint: `GET /api/analytics/dashboard` — returns genres, moodScore, topTracks and generatedAt.
- Persistent analytics save & retrieval (backend/services/analyticsService.js).
- Caching layer for dashboard responses (cacheService).
- Recommendation trigger endpoint (placeholder for ML integration).

---

## Tech stack
- Frontend: React, Vite, axios
- Backend: Node.js, Express, axios, cookie-session
- Database: PostgreSQL (assumed from SQL style), persisted analytics table
- Cache: pluggable (Redis or in-memory; referenced via `cacheService`)
- Optional: Python for data pipeline / ML

---

## Quickstart — local development

### Prerequisites
- Node.js (>= 16), npm or yarn
- PostgreSQL (if you want database persistence)
- (Optional) Redis if using a Redis-backed cache
- Spotify developer account & app credentials (Client ID / Client Secret)

### Backend setup
1. Open a terminal:
   - cd into the backend directory:
     - cd backend
   - Install dependencies:
     - npm install
2. Create a `.env` file (see the Environment variables section below).
3. Start the backend:
   - npm run dev
   - or npm start (check `package.json` scripts in `/backend` for exact commands)

Notes:
- The backend uses cookie-based sessions and expects the session cookie to be sent by the browser for authenticated endpoints.
- If running the backend behind a proxy (Render/Heroku), configure `app.set('trust proxy', 1)` (see Troubleshooting).

### Frontend setup
1. Open a terminal:
   - cd frontend
   - npm install
2. Set the build-time environment variable `VITE_BACKEND_URL` for local dev:
   - Example (.env.local or export): `VITE_BACKEND_URL=http://localhost:8888`
3. Start the Vite dev server:
   - npm run dev
4. In production, make sure `VITE_BACKEND_URL` is set in the build environment and rebuild the frontend before deploying.

---

## Environment variables
The code references and expects several environment variables. Set these in your local `.env` (backend) and in the deployment environment.

Important vars (backend)
- PORT — server port (default 8888)
- CLIENT_ID or SPOTIFY_CLIENT_ID — Spotify app client id
- SPOTIFY_CLIENT_SECRET — Spotify app client secret
- SESSION_SECRET or COOKIE_SECRET — secret used to sign cookie-session keys
- DATABASE_URL — PostgreSQL connection string (if using DB)
- FRONTEND_URL — Frontend origin used for CORS (e.g. `https://app.example.com`)
- (Optional) CACHE_URL — Redis/other cache URL if configured

Important vars (frontend / build-time)
- VITE_BACKEND_URL — full backend base URL (e.g. `https://api.example.com`) — this is baked into the frontend bundle at build time

Tip: Review `backend/server.js` for exact env variable usage and any fallback names.

---

## Deployment notes
- If deploying to a static host (Netlify/Vercel) or to Render:
  - Ensure `VITE_BACKEND_URL` is set before building the frontend. Changing environment variables after a static build will not change an already-built bundle.
  - Backend must allow CORS from your frontend origin and allow credentials (cookies) if using cookie-based sessions.
  - In the backend, use:
    - app.set('trust proxy', 1) — if behind a proxy/load balancer (Render/Heroku) and you use secure cookies
    - cookie-session config with `secure: true` and `sameSite: 'none'` in production
    - CORS config with `origin: FRONTEND_URL` and `credentials: true` (do not set origin to `*` when credentials are used)
- There is a `render.yaml` in the repo — inspect it and set matching environment variables in the Render dashboard.

---

## Troubleshooting — analytics / frontend shows no data
Common causes and checks:
1. Frontend built with the wrong backend URL
   - Check `VITE_BACKEND_URL` in the production build. If incorrect, rebuild the frontend with the correct value.
2. CORS and credentials
   - Frontend uses `axios` with `withCredentials: true`. Backend must respond with `Access-Control-Allow-Origin: <frontend-origin>` and `Access-Control-Allow-Credentials: true`.
3. Cookies / sessions not sent
   - For cross-site cookies you need:
     - secure cookies (HTTPS) in production
     - `sameSite: 'none'`
     - `app.set('trust proxy', 1)` if behind a proxy
4. checkAuth failing
   - If the session cookie isn't present or `req.session.access_token` is missing, the dashboard endpoint will return unauthorized or empty responses.
5. Server errors
   - Check backend logs for keywords: `Dashboard Error:`, `DB Save Error:`, `Audio Features warning:`, `⚡ Using Cached Dashboard`.
6. Database / cached data
   - Verify analytics rows exist for your user in the `analytics` table. If not, confirm the server is successfully calling Spotify and saving analytics.
7. Debug with test-panel
   - Visit `https://<backend>/test-panel` on your deployed backend and click "Data" to see whether the backend can produce dashboard data when a valid session exists.

If you hit failure, collect:
- Browser console errors (CORS / cookie / blocked requests)
- Network request/response for `GET /api/analytics/dashboard` (status code, response body, request/response headers, especially Cookie and Access-Control headers)
- Backend logs around the same timestamp

Share those and it will be straightforward to pinpoint the missing config.

---

## Testing & debug endpoints
- `GET /test-panel` — simple server-side debug page that can call `/api/analytics/dashboard` from the backend origin (helps isolate cookie/session issues).
- Check logs for:
  - "⚡ Using Cached Dashboard" — confirms cache hit
  - "DB Save Error" — DB persistence error
  - "Audio Features warning" — Spotify audio-features call failed (non-fatal)

---

## Contributing
Contributions welcome. Typical workflow:
- Fork the repository
- Create a feature branch
- Implement changes and add tests where applicable
- Open a PR with a clear description of the change and rationale

Please follow existing code style and update docs in `/docs` when changing API contracts.

---

## License
Specify your project license here (e.g., MIT) or add LICENSE file to the repo.