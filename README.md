# NewsMania AI 📰🚀

> **AI-Powered Personalized Tech News & Daily Briefing Platform**
> 
> **🔗 Live Demo**: [https://newsmania-y0o7.onrender.com](https://newsmania-y0o7.onrender.com)

NewsMania AI is a production-grade full-stack SaaS platform designed for tech developers and enthusiasts. It aggregates live tech news, categorizes articles, scores user interests to generate personalized feeds, and leverages Google Gemini AI to provide automatic summarizations, "Explain Like I'm 10" (ELF10) simplified tech explanations, and auto-compiled daily briefings.

---

## 🛠️ Technology Stack

- **Frontend**: React (v19), Vite, TypeScript, Tailwind CSS, Recharts (visualizations), Framer Motion (micro-animations), Lucide icons.
- **Backend**: Node.js, Express.js, TypeScript, ESBuild, TSX.
- **Database**: MongoDB Atlas (via Mongoose ODM).
- **Authentication**: JSON Web Tokens (JWT), custom verification middleware, password hashing via `bcryptjs`.
- **AI Integrations**: Google Gemini API (`gemini-3.5-flash`).
- **News Data Feed**: NewsData.io API (with dynamic cursor pagination, deduplication, and caching).

---

## ✨ Core Features

- **🔐 Secure JWT Authentication**: Robust signup and login routines with hashed credentials, JWT session management, and restricted route protection.
- **📰 Category News Feed**: Segregated feeds across major tech categories (AI, Java, React, Cloud, Cyber Security, etc.) with sorting, keywords filter, and search options.
- **🔄 Load More & Infinite Scroll**: Supports performance-optimized infinite scrolling (via IntersectionObserver) and manual load-more pagination.
- **🧠 Google Gemini AI Integrations**:
  - **AI Summaries**: Provides a 2-sentence summary, key takeaways, and data facts for articles.
  - **Explain Like I'm 10 (ELF10)**: Translates complex tech news into child-friendly analogies.
  - **Daily AI Briefing**: Auto-compiles summaries of technology trends across 5 main tech domains daily.
- **⚡ Smart Mongoose Caching**: Caches AI summary outputs and simplified translations directly into MongoDB to reduce duplicate third-party API costs.
- **📊 Analytics Dashboard**: Renders interactive graphs of reading counts, bookmarks, popular categories, and trending technologies using Recharts.
- **🛡️ Rate & API Fail-safes**: Automatically falls back to high-fidelity local content generators if third-party keys are missing or rate limits (429/401) are hit.

---

## 📁 Project Structure

```
NewsMania/
├── server/                     # Backend Source Code (Express + TypeScript)
│   ├── config/                 # Mongoose connector and database configs
│   ├── controllers/            # Express controllers (Auth, News, Admin, Analytics)
│   ├── middleware/             # JWT auth validation and role checks
│   ├── models/                 # Mongoose schemas (User, Article, Bookmark)
│   ├── routes/                 # Express API endpoints definition
│   ├── services/               # Integrations (Gemini AI, NewsData.io)
│   └── utils/                  # Async seeding scripts
├── src/                        # Frontend Source Code (React + TypeScript)
│   ├── components/             # Reusable UI cards, Navbar, Footer, Skeletons
│   ├── context/                # Auth context (session, bookmarks) & Toast alerts
│   ├── pages/                  # Views (Home, Landing, Dashboards, Briefings, Admin)
│   └── types.ts                # Shared client-side typings
├── server.ts                   # Unified dev entrypoint (Vite dev server middleware)
└── package.json                # Bundler scripts and modules registry
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI="your_mongodb_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
NEWSDATA_API_KEY="your_newsdata_api_key"
JWT_SECRET="your_secure_jwt_signing_secret"
```

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Run in Development Mode
Start the application (launches the MongoDB connector, boot-seeder, and Vite client):
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 3. Build & Run in Production Mode
Compile the bundles and boot the node server:
```bash
npm run build
npm start
```

---

## 📦 Deployment Guide (Render)

Render is highly recommended because the project is pre-configured to bundle client assets and host them out of the same Express server process.

1. Create a new **Web Service** on Render and link your GitHub repository.
2. Configure settings:
   - **Language**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Add the environment variables (`NODE_ENV=production`, `MONGODB_URI`, `PORT=10000`, `GEMINI_API_KEY`, `NEWSDATA_API_KEY`, `JWT_SECRET`) in the Render environment settings.
4. Deploy!
