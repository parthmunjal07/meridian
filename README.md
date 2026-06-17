# Meridian ✦

**The fastest email and calendar experience ever made. Now with an agentic mind.**

[View the Live Demo](https://meridian.parthmunjal.in)

Meridian is a premium, AI-first email client portfolio project built with a "Linear / Superhuman" neo-minimalist aesthetic. It transcends a simple email wrapper by integrating a fully autonomous AI agent that leverages the Model Context Protocol (MCP) to read context, draft emails, and schedule meetings on your behalf. 

---

## 🚀 Features

- **The Autonomous Agent**: A conversational interface powered by Mistral and the Vercel AI SDK. It doesn't just draft emails—it executes them.
- **Corsair MCP Integration**: Seamlessly connects to your Google Workspace to fetch unread emails, send messages, and create calendar events (with Google Meet links automatically injected).
- **The Morning Digest**: A daily AI-generated synthesis of what actually matters. We extract the signal from the noise before you even open your laptop.
- **Keyboard-Centric Design**: Keep your hands on the keys. Navigate everything in milliseconds without touching a mouse.
- **Neo-Minimalist UI**: High whitespace, strict monochrome palettes, soft diffused shadows, and subtle glassmorphism built entirely with pure Tailwind CSS.
- **Rate Limiting & Security**: JWT-based authentication and Redis-backed rate limiting to protect API routes and AI usage quotas.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks (`useState`, `useEffect`, `useRef`)

### Backend & AI
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **AI Framework**: [Vercel AI SDK](https://sdk.vercel.ai/docs) (`streamText`, MCP Tooling)
- **Model**: Mistral
- **Integrations Engine**: [Corsair](https://corsair.dev) (Managing OAuth & Google Workspace APIs)
- **Caching & Rate Limiting**: [Redis](https://redis.io/)

---

## 📁 Folder Structure

```text
meridian/
├── app/                      # Next.js App Router root
│   ├── (app)/                # Authenticated routes (Inbox, Calendar, Agent)
│   ├── api/                  # API endpoints
│   │   ├── auth/             # JWT Authentication & Corsair OAuth callbacks
│   │   ├── chat/             # Vercel AI SDK streaming endpoint
│   │   ├── cron/             # Background jobs (Morning Digest)
│   │   └── ...
│   ├── layout.tsx            # Global HTML wrapper & Metadata
│   └── page.tsx              # Long-form Landing Page
├── components/               # Reusable React components
│   ├── AgentChatUI.tsx       # The core Agent chat interface
│   ├── AgentDockWrapper.tsx  # Floating agent dock
│   └── ...
├── lib/                      # Core utilities and SDK initializations
│   ├── ai.ts                 # AI model setup
│   ├── corsair.ts            # Corsair client and plugin configurations
│   ├── prisma.ts             # Prisma client singleton
│   ├── redis.ts              # Redis client for rate limiting
│   └── digest.ts             # Logic for generating the Morning Digest
├── services/                 # Business logic abstractions
│   ├── calendar.service.ts   # Google Calendar API wrappers (via Corsair)
│   └── email.service.ts      # Gmail API wrappers (via Corsair)
├── prisma/                   # Database schema and migrations
│   └── schema.prisma         # User models and connection states
└── ...
```

---

## 🧠 How the Agent Works (MCP)

Meridian's AI is built on the **Model Context Protocol (MCP)**. Instead of relying on rigid, pre-programmed flows, the Vercel AI SDK is provided with a suite of strictly typed `zod` tools (e.g., `send_email`, `create_event`, `get_calendar_events`).

When you ask the agent to "Cancel my 3pm meeting and let Sarah know," the AI:
1. Calls `get_calendar_events` to find the 3 PM meeting ID.
2. Calls `delete_event` using that ID.
3. Calls `send_email` to Sarah with a contextual apology.
4. Synthesizes the results of all tool calls and replies to you in natural language.

---

## 🏃‍♂️ Getting Started Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis instance
- Corsair Account / Self-Hosted Engine
- Google Cloud Console Project (for OAuth Client ID/Secret)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/meridian.git
   cd meridian
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root and add the required keys:
   ```env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your_jwt_secret"
   MISTRAL_API_KEY="your_mistral_key"
   REDIS_URL="redis://..."
   
   # Corsair & Google OAuth
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   CORSAIR_KEK="..."
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Server:**
   ```bash
   npm run dev
   ```
   *The app will be available at [http://localhost:3000](http://localhost:3000).*

---

## 📜 License

This project is licensed under the MIT License.
