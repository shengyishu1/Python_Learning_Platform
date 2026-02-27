# 🐍 PyLingo — Interactive Python Learning Platform

A comprehensive, single-file Python learning platform with 5 courses, 39 topics, 92 lessons, and 107 hands-on exercises. Built as a pure static HTML file — no server required.

**[🚀 Live Demo → shengyishu1.github.io/Python_Learning_Platform](https://shengyishu1.github.io/Python_Learning_Platform/)**

---

## ✨ Features

- **5 Full Courses** — From zero to building real projects
- **107 Interactive Exercises** — Write and run Python code in-browser
- **22 Animated Diagrams** — Visual explanations of key concepts
- **Built-in Code Evaluator** — Instant feedback without any server
- **8 Languages** — English, 中文, Español, Français, 日本語, 한국어, Português, Deutsch
- **AI Tutor** — Ask questions and get guided hints (optional, requires API key)
- **Progress Tracking** — Streak counter, completion badges, saved progress
- **100% Static** — Single HTML file, deploy anywhere for free

## 📚 Course Overview

| # | Course | Topics | Exercises | Level |
|---|--------|--------|-----------|-------|
| 0 | **Getting Started with Python** | 6 | 16 | 🟢 Beginner |
| 1 | **Python Fundamentals** | 11 | 34 | 🟢 Beginner |
| 2 | **Python for Web Scraping** | 6 | 18 | 🟡 Intermediate |
| 3 | **Python for SQL & Databases** | 7 | 20 | 🟡 Intermediate |
| 4 | **Practice Projects** | 9 | 17 | 🟡🔴 Mixed |

### Practice Projects Include:
- 🎲 Number Guessing Game
- 🔐 Password Generator
- 📐 Unit Converter
- 💰 Expense Tracker
- 📚 Book Price Scraper
- ✅ Todo App with Database
- 🌤️ Weather Dashboard
- 📈 Portfolio Tracker

## 🚀 Deploy Your Own

### Option 1: GitHub Pages (Recommended)

1. Fork this repository
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → **main** → **/ (root)**
4. Your site is live at `https://yourusername.github.io/Python_Learning_Platform/`

### Option 2: Any Static Hosting

Just upload `index.html` to Netlify, Vercel, Cloudflare Pages, or any web server. It's a single file with no dependencies.

## 🔑 AI Features (Optional)

The platform works fully without any API key. AI-powered features are optional enhancements:

| Feature | Without Key | With Key |
|---------|-------------|----------|
| Lessons & Content | ✅ Full access | ✅ Full access |
| Exercises & Code Eval | ✅ Works offline | ✅ + AI-powered evaluation |
| Course Navigation | ✅ Pre-translated titles | ✅ Pre-translated titles |
| Content Translation | ❌ English only | ✅ All 8 languages |
| AI Tutor Chat | ❌ Not available | ✅ Interactive Q&A |

### Supported AI Providers

| Provider | How to Get Key | Payment | Cost |
|----------|---------------|---------|------|
| **Google Gemini** ⭐ | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Google 账号 | 免费（10次/分钟，250次/天）|
| **OpenRouter** 🔥 | [openrouter.ai](https://openrouter.ai/settings/keys) | 支付宝 / 微信 / 信用卡 | 按量付费，极低价格 |
| **OpenAI (GPT)** | [platform.openai.com](https://platform.openai.com/api-keys) | Visa/Mastercard (USD) | 按量付费 |
| **Claude (Anthropic)** | [console.anthropic.com](https://console.anthropic.com/) | Visa/Mastercard (US only) | 按量付费 |

> **推荐：** Gemini 免费适合大多数学习者。如果超出免费限额或需要支付宝/微信付款，推荐 OpenRouter。

### Setting Up AI Features

1. Click the ⚙️ button in the platform
2. Choose your AI provider (Gemini recommended — it's free!)
3. Paste your API key — it's stored locally in your browser only

> **Privacy:** Your API key never leaves your browser. It is stored in `localStorage` and sent directly to the API proxy. No server-side storage.

### CORS Proxy Setup

Browsers block direct API calls due to CORS. A Cloudflare Worker proxy is needed:

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Compute → Workers**
2. Create a new Worker with the code from `cloudflare-worker.js`
3. Update `PROXY_URL` in `index.html` to point to your Worker

## 🛠️ Tech Stack

- **Frontend:** React 18 + Babel (in-browser transpilation)
- **Code Execution:** Custom Python simulator (no server needed)
- **Diagrams:** React components with CSS animations
- **AI:** Anthropic Claude API (Sonnet) via Cloudflare Worker proxy
- **Storage:** Browser `localStorage` for progress and settings

## 📁 Repository Structure

```
├── index.html              # The entire platform (single file)
├── cloudflare-worker.js    # API proxy for AI features (optional)
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Some ideas:

- Add more exercises to existing topics
- Create new practice projects
- Improve the Python simulator
- Add pre-translations for more content
- Fix bugs or improve UI/UX

## 📄 License

© 2026 shengyishu1. All Rights Reserved.

---

<p align="center">
  Built with ❤️ for Python learners everywhere
</p>
