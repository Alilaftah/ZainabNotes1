# AGENTS.md

## Project Overview
A Vite + React 19 + TypeScript single-page app — an interactive showcase/simulator for an Android (Kotlin/Jetpack Compose) notes app called "زينب مسلم - مذكرة احترافية". Arabic RTL UI with Tailwind CSS v4.

## Running the App
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Vite dev server on port 3000 (HMR enabled).
- Node 22-slim base image; source bind-mounted at `/app`; `node_modules` in a named volume.
- `npm install` runs at container startup before `npm run dev`.

## Key Notes
- **No backend, no database.** All state is in `localStorage` (`zainab_muslem_notes_app_v1`).
- **Gemini API is NOT used at runtime.** `@google/genai` is listed in `package.json` and `GEMINI_API_KEY` appears in `.env.example`, but no source file imports or references it. The app renders fully without any API key.
- Vite 6.x: `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed via compose environment to allow the preview's external hostname.
- The `vite.config.ts` disables HMR/file-watching when `DISABLE_HMR=true` (an AI Studio artifact); in Base44 we leave it enabled for live reload.
- Tailwind v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed).
