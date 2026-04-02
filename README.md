# ⚡ Forge — Terminal AI Coding Assistant

A terminal-first, production-quality AI coding assistant with a polished web dashboard. Supports streaming responses, multi-session chat history, a file explorer, execution log panel, and a provider-agnostic API layer that works with OpenRouter, Hugging Face, and Cloudflare Workers AI.

![Forge Screenshot](docs/screenshot.png)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Streaming responses** | Real-time SSE streaming from any supported provider |
| **Multi-session history** | All sessions saved to `localStorage`, searchable |
| **Markdown + code rendering** | Full GFM support with syntax highlighting |
| **Copy code button** | One-click copy on every code block |
| **File explorer** | Collapsible tree with file type icons |
| **Execution log** | Mini terminal panel with demo shell |
| **Provider-agnostic** | OpenRouter · Hugging Face · Cloudflare Workers AI |
| **Model selector** | Switch models mid-session from the toolbar |
| **Settings panel** | Theme, font size, layout, reset — all persisted |
| **Responsive** | Collapsible sidebar and right panel |
| **Server health** | Live/offline badge in the toolbar |
| **Export session** | Download full session as `.txt` |
| **No secrets in client** | All API keys stay in the server `.env` |

---

## 🗂 Repository Structure

```
forge/
├── client/                      # React + Vite + Tailwind frontend
│   ├── public/
│   │   └── forge-icon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatPanel.jsx    # Toolbar, error banner, layout
│   │   │   │   ├── Message.jsx      # Markdown renderer, copy button
│   │   │   │   ├── MessageList.jsx  # Auto-scroll, empty state
│   │   │   │   └── PromptBox.jsx    # Textarea, send/stop buttons
│   │   │   ├── RightPanel/
│   │   │   │   ├── RightPanel.jsx   # Tab container
│   │   │   │   ├── FileTree.jsx     # Collapsible file explorer
│   │   │   │   ├── CodeViewer.jsx   # Line-numbered code viewer
│   │   │   │   └── ExecutionLog.jsx # Terminal output + mini shell
│   │   │   ├── Settings/
│   │   │   │   └── SettingsModal.jsx
│   │   │   ├── Sidebar/
│   │   │   │   └── Sidebar.jsx      # Session list + search
│   │   │   └── UI/
│   │   │       ├── Button.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── Select.jsx
│   │   ├── lib/
│   │   │   ├── api.js           # Streaming fetch client
│   │   │   ├── models.js        # Provider + model registry
│   │   │   ├── storage.js       # localStorage helpers
│   │   │   └── useChat.js       # Core chat hook
│   │   ├── pages/               # (reserved for routing expansion)
│   │   ├── styles/
│   │   │   └── globals.css      # Tailwind base + custom styles
│   │   ├── App.jsx              # Root layout + session management
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                      # Node.js + Express API proxy
│   ├── src/
│   │   ├── lib/
│   │   │   ├── providers.js     # OpenRouter / HF / Cloudflare callers
│   │   │   └── stream.js        # SSE pipe utility
│   │   ├── routes/
│   │   │   └── chat.js          # POST /api/chat
│   │   └── index.js             # Express app, CORS, health endpoint
│   └── package.json
│
├── .env.example                 # Copy to server/.env and fill in keys
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- An API key from one of the supported providers (see below)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-handle/forge.git
cd forge
```

### 2. Configure environment variables

```bash
cp .env.example server/.env
```

Open `server/.env` and add at least one API key:

```env
# Free tier available — recommended for getting started
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxxxx
```

> **Tip:** Get a free OpenRouter key at [openrouter.ai/keys](https://openrouter.ai/keys). The free models (Mistral 7B, Llama 3) require no credit card.

### 3. Install dependencies

```bash
# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 4. Start the development servers

Open **two terminal tabs**:

**Tab 1 — Backend:**
```bash
cd server
npm run dev
```
You should see:
```
  ⚡ Forge server running on http://localhost:3001
     Health: http://localhost:3001/api/health
```

**Tab 2 — Frontend:**
```bash
cd client
npm run dev
```
You should see:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## 🔑 API Providers

### OpenRouter *(recommended — free tier available)*

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Generate a key at [openrouter.ai/keys](https://openrouter.ai/keys)
3. Set `OPENROUTER_API_KEY` in `server/.env`

Free models available: `mistralai/mistral-7b-instruct:free`, `meta-llama/llama-3-8b-instruct:free`, and more.

### Hugging Face

1. Sign up at [huggingface.co](https://huggingface.co)
2. Create a token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. Set `HUGGINGFACE_API_KEY` in `server/.env`

### Cloudflare Workers AI

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com)
2. Go to **AI → Workers AI**
3. Copy your Account ID and create an API token
4. Set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in `server/.env`

---

## 🏗 Building for Production

### Build the frontend

```bash
cd client
npm run build
# Output in client/dist/
```

### Start the production server

```bash
cd server
NODE_ENV=production node src/index.js
```

The server will serve only the API; serve `client/dist/` via a static host (Nginx, Vercel, GitHub Pages, etc.).

---

## 🌐 Deployment

### Frontend → GitHub Pages

```bash
# client/vite.config.js — set base if deploying to a subdirectory:
# base: '/forge/',

cd client
npm run build

# Using gh-pages package:
npm install -g gh-pages
gh-pages -d dist
```

Set `VITE_API_BASE` in the client build to point to your deployed server:

```bash
VITE_API_BASE=https://your-server.fly.dev/api npm run build
```

### Backend → Fly.io (example)

```bash
cd server
fly launch       # follow prompts
fly secrets set OPENROUTER_API_KEY=sk-or-xxxx
fly deploy
```

### Backend → Railway / Render

1. Connect your GitHub repository
2. Set the root directory to `server`
3. Set environment variables in the dashboard
4. Deploy — the `npm start` command runs `node src/index.js`

---

## ⚙️ Configuration Reference

### Client environment variables (`client/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE` | `/api` | API base URL (change for production) |

### Server environment variables (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (3001) | Port to listen on |
| `OPENROUTER_API_KEY` | One of these | OpenRouter API key |
| `HUGGINGFACE_API_KEY` | One of these | Hugging Face API token |
| `CLOUDFLARE_ACCOUNT_ID` | One of these | Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | One of these | Cloudflare API token |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins |

---

## 🧩 Adding a New Provider

1. Add the provider definition to `client/src/lib/models.js` (`PROVIDERS` and `MODELS` objects)
2. Add a caller function to `server/src/lib/providers.js`
3. Register it in the `callProvider` switch statement in the same file
4. That's it — the UI will pick it up automatically

---

## 🛠 Scripts Reference

| Directory | Command | Description |
|---|---|---|
| `server` | `npm run dev` | Start server with `--watch` (auto-reload) |
| `server` | `npm start` | Start server in production mode |
| `client` | `npm run dev` | Start Vite dev server |
| `client` | `npm run build` | Build for production |
| `client` | `npm run preview` | Preview production build locally |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built with React, Vite, Tailwind CSS, Express, and a lot of dark themes.*

