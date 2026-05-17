# Resonance

> AI-powered voice synthesis platform — a modern ElevenLabs alternative.

Multi-tenant SaaS for creating, managing, and playing high-quality text-to-speech generations with enterprise-grade authentication and organization management.

---

## Architecture

```mermaid
flowchart TB
    subgraph Client["Browser (React 19)"]
        UI["App Router Pages\nshadcn/ui Components"]
    end

    subgraph Edge["Next.js Server"]
        MW["Clerk Middleware\n(proxy.ts)"]
        SA["Server Actions"]
    end

    subgraph Auth["Clerk"]
        AUTH["Auth + Organizations\nJWT / Sessions"]
    end

    subgraph Data["PostgreSQL"]
        PRISMA["Prisma ORM\nVoice · Generation"]
    end

    UI --> MW
    MW -->|authenticated| SA
    MW -->|unauthenticated| AUTH
    AUTH -->|redirect| UI
    SA --> PRISMA
    PRISMA --> Data
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant App as Next.js App
    participant Clerk
    participant Dashboard

    User->>App: Visit any route
    App->>Clerk: Check session
    alt No session
        Clerk-->>App: Unauthenticated
        App-->>User: Redirect to /sign-in
    else Has session, no org
        Clerk-->>App: userId ✓, orgId ✗
        App-->>User: Redirect to /org-selection
    else Fully authenticated
        Clerk-->>App: userId ✓, orgId ✓
        App-->>User: Access (dashboard)
    end
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.2 |
| UI Library | React | 19.2.5 |
| Language | TypeScript | 5.9.3 |
| Authentication | Clerk | 7.2.8 |
| Database | PostgreSQL | 12+ |
| ORM | Prisma | 7.8.0 |
| Styling | Tailwind CSS | 4.2.4 |
| Components | shadcn/ui + Base UI | — |
| Validation | Zod | 4.4.1 |
| Forms | React Hook Form | 7.74.0 |
| Notifications | Sonner | 2.0.7 |

---

## Project Status

| Feature | Status |
|---|---|
| Authentication (Clerk) | ✅ Complete |
| Multi-tenancy (Organizations) | ✅ Complete |
| Route Protection (Middleware) | ✅ Complete |
| Dashboard Layout + Sidebar | ✅ Complete |
| Data Model (Voice, Generation) | ✅ Complete |
| Text-to-Speech Flow | 🚧 Planned |
| Voice Management | 🚧 Planned |
| Audio Playback | 🚧 Planned |
| Analytics Dashboard | 🚧 Planned |

---

## Quick Start

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 12+
- **Clerk account** ([clerk.com](https://clerk.com))

### 1. Clone & Install

```bash
git clone <repository-url>
cd Complete-ElevenLabs-Clone
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:5432/resonance"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/org-selection"
```

### 3. Initialize Database

```bash
npx prisma migrate dev
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Serve production build |
| `npm run lint` | Lint with auto-fix |
| `npm run format` | Format with Prettier |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Run dev migrations |
| `npx prisma migrate deploy` | Apply migrations in production |

---

## Data Model

### Voice

| Field | Type | Description |
|---|---|---|
| `id` | `String @cuid` | Unique identifier |
| `orgId` | `String?` | Owning organization |
| `name` | `String` | Display name |
| `description` | `String?` | Voice description |
| `category` | `VoiceCategory` | Classification (General, Audiobook, Podcast, etc.) |
| `language` | `String` | Locale code (default: `en-US`) |
| `variant` | `VoiceVariant` | `SYSTEM` or `CUSTOM` |
| `r2ObjectKey` | `String?` | Cloudflare R2 storage reference |
| `createdAt` | `DateTime` | Creation timestamp |
| `updatedAt` | `DateTime` | Last update timestamp |

### Generation

| Field | Type | Description |
|---|---|---|
| `id` | `String @cuid` | Unique identifier |
| `orgId` | `String` | Owning organization |
| `voiceId` | `String?` | Reference to Voice |
| `text` | `String` | Input text for synthesis |
| `voiceName` | `String` | Persisted voice name |
| `temperature` | `Float` | Inference randomness |
| `topP` | `Float` | Nucleus sampling threshold |
| `topK` | `Float` | Top-k filtering |
| `repetitionPenalty` | `Float` | Repetition penalty factor |
| `r2ObjectKey` | `String?` | Generated audio in R2 |
| `createdAt` | `DateTime` | Creation timestamp |
| `updatedAt` | `DateTime` | Last update timestamp |

### Schema Relationships

```mermaid
erDiagram
    Voice ||--o{ Generation : "has many"
    Voice {
        string id PK
        string orgId
        string name
        string description
        VoiceCategory category
        string language
        VoiceVariant variant
        string r2ObjectKey
        datetime createdAt
        datetime updatedAt
    }
    Generation {
        string id PK
        string orgId
        string voiceId FK
        string text
        string voiceName
        float temperature
        float topP
        float topK
        float repetitionPenalty
        string r2ObjectKey
        datetime createdAt
        datetime updatedAt
    }
```

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (dashboard)/            # Protected dashboard routes
│   ├── sign-in/                # Public: sign-in
│   ├── sign-up/                # Public: sign-up
│   ├── org-selection/          # Organization selection
│   ├── layout.tsx              # Root layout (Clerk, providers)
│   └── globals.css             # Global styles + theme
├── components/
│   ├── ui/                     # 57 shadcn/ui components
│   └── page-header.tsx         # Shared page header
├── features/
│   └── dashboard/              # Dashboard feature module
│       ├── components/         # Sidebar, hero pattern
│       └── views/              # Page-level views
├── generated/
│   └── prisma/                 # Generated Prisma client
├── hooks/                      # Custom React hooks
├── lib/
│   ├── db.ts                   # Prisma client (singleton)
│   ├── env.ts                  # Typed env validation (t3-env)
│   └── utils.ts                # cn() utility
├── types/                      # TypeScript type declarations
└── proxy.ts                    # Clerk middleware
```

---

## Security

- **Authentication**: Clerk handles sessions, JWT, and identity verification
- **Authorization**: Middleware enforces `userId` + `orgId` on protected routes
- **Data Isolation**: All Prisma queries scoped by `orgId` for multi-tenant safety
- **Environment Variables**: Validated at startup via `@t3-oss/env-nextjs`
- **HTTPS Required**: Production requires secure cookies for Clerk sessions

---

## License

Proprietary. All rights reserved.
