# 🧬 Helix AI

A premium AI assistant web app built with React + Vite, powered by free AI models via [Pollinations AI](https://pollinations.ai/).

**🌐 Live Demo:** [https://nisamcm.netlify.app](https://nisamcm.netlify.app)

## ✨ Features

- 💬 **Multi-Model Support** — Switch between OpenAI, Mistral, Llama, and DeepSeek models
- 🧠 **Conversation Memory** — Full chat history maintained across messages
- 🌙 **Dark & Light Themes** — Beautiful UI with smooth transitions
- 📱 **Fully Responsive** — Works great on desktop, tablet, and mobile
- ✍️ **Markdown Rendering** — Rich formatted AI responses with syntax highlighting
- 📋 **Code Blocks** — Syntax-highlighted code with one-click copy
- 🔄 **Streaming Effect** — Smooth token-by-token text reveal animation
- 🆓 **100% Free** — No API keys needed, uses Pollinations AI

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏗️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Vanilla CSS with CSS Variables
- **AI Backend:** Pollinations AI (free, no API key)
- **Serverless:** Netlify Functions
- **Deployment:** Netlify

## 📁 Project Structure

```
helix/
├── src/
│   ├── App.jsx          # Main application component
│   ├── Sidebar.jsx      # Chat history sidebar
│   ├── Panels.jsx       # Settings, About, Contact panels
│   ├── icons.jsx        # SVG icon components
│   ├── index.css        # Complete styling
│   └── main.jsx         # Entry point
├── netlify/
│   └── functions/
│       └── chat.js      # Serverless function for AI API
├── netlify.toml         # Netlify configuration
└── package.json
```

## 🌐 Deployment (Netlify)

1. Push this repo to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect your GitHub repo
5. Build settings are auto-configured via `netlify.toml`
6. Deploy! Your AI agent is live 🎉

## 👨‍💻 Created By

**Zam (Muhammed Nisam CM)** — Developer & Visual Designer from Kerala, India

- 🌐 [muhammednisam.com](https://muhammednisam.com)
