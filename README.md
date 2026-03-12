# Helix AI — Deployment Guide

## What was fixed

1. **AI not responding** — The original code called the Anthropic API directly from the browser, which is blocked by CORS. A Netlify serverless function (`netlify/functions/chat.js`) now acts as a secure backend proxy.
2. **Cursor background hover effect** — Removed completely.
3. **Responsiveness** — Full responsive support added for all screen sizes (mobile, tablet, desktop).
4. **`netlify.toml`** — Added for proper build, routing, and function configuration.

---

## How to deploy on Netlify

### Step 1 — Push to GitHub
Upload this entire project folder to a GitHub repository.

### Step 2 — Connect to Netlify
1. Go to [netlify.com](https://netlify.com) and log in.
2. Click **"Add new site" → "Import an existing project"**.
3. Connect your GitHub account and select the repository.

### Step 3 — Configure build settings
Netlify will auto-detect these from `netlify.toml`, but verify:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Step 4 — Add your Anthropic API key ⚠️ REQUIRED
This is the most important step. Without this, the AI will not work.

1. In your Netlify dashboard, go to **Site configuration → Environment variables**.
2. Click **"Add a variable"**.
3. Set:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** Your Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))
4. Click **Save**.

### Step 5 — Deploy
Click **"Deploy site"**. Netlify will build and deploy your project.

### Step 6 — Done!
Your Helix AI will be live at your Netlify domain (e.g., `helix-ai.netlify.app`).

---

## Local development

```bash
npm install
npm run dev
```

> For local dev with the AI working, you need the [Netlify CLI](https://docs.netlify.com/cli/get-started/):
> ```bash
> npm install -g netlify-cli
> netlify dev
> ```
> Then set `ANTHROPIC_API_KEY` in a `.env` file.

---

## File structure

```
helix-ai/
├── netlify/
│   └── functions/
│       └── chat.js          ← Secure API proxy (backend)
├── src/
│   ├── App.jsx              ← Main app
│   ├── Sidebar.jsx
│   ├── Panels.jsx
│   ├── Toast.jsx
│   ├── icons.jsx
│   └── index.css
├── netlify.toml             ← Netlify build config
├── vite.config.js
└── package.json
```
