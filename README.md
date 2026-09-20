<div align="center">

  <img src="public/logo.svg" alt="Resonance Logo" width="64" height="64" />

  # Resonance

  **Enterprise-ready, multi-tenant AI voice synthesis & cloning platform — an open-source ElevenLabs alternative.**

  [![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

  <p align="center">
    <a href="#key-features">Key Features</a> •
    <a href="#system-architecture">System Architecture</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#data-model">Data Model</a> •
    <a href="#roadmap">Roadmap</a>
  </p>

</div>

---

## 📸 Preview

<div align="center">
  <img src="public/resources/image.png" alt="Resonance Dashboard Preview" width="100%" style="border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);" />
</div>

---

## 💡 Overview

**Resonance** is a modern, full-stack Text-to-Speech (TTS) and Voice Cloning SaaS platform built to give creators and teams full control over voice generation. Designed from the ground up with multi-tenancy, strict data isolation, and low-latency inference in mind, Resonance bridges cutting-edge AI speech synthesis with an intuitive, enterprise-grade user interface.

Whether you're generating studio-grade voiceovers, building automated audiobook narrations, or cloning custom voices for your organization, Resonance provides a scalable, self-hostable foundation.

---

## ✨ Key Features

- 🎙️ **High-Fidelity Text-to-Speech**: Generate natural, expressive speech with fine-grained inference controls (`temperature`, `top_p`, `top_k`, and `repetition_penalty`).
- 🧬 **Voice Cloning & Catalog**: Support for built-in system voices across multiple categories (Audiobook, Podcast, Conversational, Narrative, etc.) and custom cloned voices.
- 🏢 **Multi-Tenant Organizations**: Built on Clerk Organizations with role-based isolation, team member invitations, and organization-scoped voice libraries.
- 🛡️ **Zero-Trust Middleware Guarding**: Edge-level session verification (`proxy.ts`) enforcing strict user and tenant authentication before request fulfillment.
- 🗄️ **Robust Relational Data Layer**: PostgreSQL powered by Prisma 7 ORM with indexed querying, strict relations, and connection pooling.
- ☁️ **Cloud Storage Ready**: Architected for Cloudflare R2 object storage for rapid asset streaming, audio caching, and sample audio storage.
- 🎨 **Modern Design System**: Polished UI crafted with Tailwind CSS v4, Base UI / Radix primitives, collapsible sidebar navigation, and Sonner toast notifications.
- 📐 **End-to-End Type Safety**: Complete static typing from database schema to UI components with Zod validation and `@t3-oss/env-nextjs`.

---

## 🏗️ System Architecture

Resonance separates edge routing, identity management, compute, and persistent storage into isolated layers:

```mermaid
flowchart TB
    subgraph Client["Frontend Layer (Client Browser)"]
        UI["React 19 App Router UI"]
        Sidebar["Collapsible Sidebar & Org Switcher"]
        Waveform["Audio Waveform Player (Planned)"]
    end

    subgraph Security["Edge Security & Auth"]
        Proxy["Clerk Proxy Middleware (src/proxy.ts)"]
        ClerkAuth["Clerk Identity & Organization Service"]
    end

    subgraph Core["Application Layer (Next.js Server)"]
        ServerActions["Server Actions / Route Handlers"]
        EnvValidation["Type-Safe Env (@t3-oss/env-nextjs)"]
    end

    subgraph Persistence["Storage & Database Layer"]
        Prisma["Prisma ORM Client (Singleton)"]
        Postgres[(PostgreSQL Database)]
        R2[(Cloudflare R2 Audio Storage)]
    end

    UI --> Proxy
    Proxy -->|Unauthenticated| ClerkAuth
    ClerkAuth -->|Session Established| UI
    Proxy -->|Authorized (userId + orgId)| ServerActions
    ServerActions --> Prisma
    ServerActions --> R2
    Prisma --> Postgres
```

### Authentication & Tenant Resolution Flow

Every protected request passes through a two-stage verification cycle before touching business logic:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Next.js App
    participant Proxy as Edge Middleware
    participant Clerk as Clerk Auth
    participant DB as PostgreSQL

    User->>App: Request Protected Resource
    App->>Proxy: Intercept Request
    Proxy->>Clerk: Validate Session & Tokens
    alt No Active Session
        Clerk-->>Proxy: Unauthenticated
        Proxy-->>User: Redirect to /sign-in
    else Active Session, Missing Organization
        Clerk-->>Proxy: userId Present, orgId Missing
        Proxy-->>User: Redirect to /org-selection
    else Verified Tenant
        Clerk-->>Proxy: userId & orgId Validated
        Proxy->>App: Forward Request with Tenant Context
        App->>DB: Query Scoped by orgId
        DB-->>App: Return Tenant Data
        App-->>User: Render Dashboard
    end
```

---

## 💻 Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16.3](https://nextjs.org/) | App Router, Server Components & Actions |
| **Runtime & UI** | [React 19.2](https://react.dev/) | Concurrent mode, Actions, unified compiler |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) | End-to-end static typing & strict checks |
| **Authentication** | [Clerk 7.3](https://clerk.com/) | Multi-tenant auth, Organization switching, JWT |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation engine with native CSS variables |
| **Components** | [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) | Accessible, customizable primitive foundations |
| **ORM** | [Prisma 7.8](https://www.prisma.io/) | Modern ORM with `@prisma/adapter-pg` driver |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Relational database with full index support |
| **Environment** | [@t3-oss/env-nextjs](https://env.t3.gg/) | Runtime and build-time env schema validation |
| **Form Management** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Type-safe form handling and schema validation |
| **Icons & Feedback** | [Lucide React](https://lucide.dev/) + [Sonner](https://sonner.emilkowal.ski/) | Iconography and stack toast notifications |

---

## 🗄️ Data Model

The schema is built around organizational tenancy, segregating voices and generation history by `orgId`:

```mermaid
erDiagram
    Voice ||--o{ Generation : "referenced by"

    Voice {
        String id PK "cuid"
        String orgId "Indexed, nullable for SYSTEM voices"
        String name "Voice display name"
        String description "Optional voice summary"
        VoiceCategory category "GENERAL, AUDIOBOOK, PODCAST, etc."
        String language "Default: en-US"
        VoiceVariant variant "SYSTEM | CUSTOM"
        String r2ObjectKey "Reference to Cloudflare R2 file"
        DateTime createdAt "Timestamp"
        DateTime updatedAt "Timestamp"
    }

    Generation {
        String id PK "cuid"
        String orgId "Indexed, required for tenant isolation"
        String voiceId FK "Nullable on voice deletion"
        String text "Input text for synthesis"
        String voiceName "Snapshot of voice name at generation"
        String r2ObjectKey "Path to generated audio in R2"
        Float temperature "Inference randomness"
        Float topP "Nucleus sampling parameter"
        Float topK "Top-K sampling limit"
        Float repetitionPenalty "Repetition penalty factor"
        DateTime createdAt "Timestamp"
        DateTime updatedAt "Timestamp"
    }
```

### Voice Categories Supported

`AUDIOBOOK` • `CONVERSATIONAL` • `CUSTOMER_SERVICE` • `GENERAL` • `NARRATIVE` • `CHARACTERS` • `MEDITATION` • `MOTIVATIONAL` • `PODCAST` • `ADVERTISING` • `VOICEOVER` • `CORPORATE`

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** `20.x` or higher
- **PostgreSQL** `12+` (local instance or managed service like Supabase / Neon)
- A **Clerk** account ([clerk.com](https://clerk.com)) with Organizations enabled

### 1. Clone the Repository

```bash
git clone https://github.com/Lostovayne/Complete-ElevenLabs-Clone.git
cd Complete-ElevenLabs-Clone
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Setup Environment Variables

Copy `.env.example` into `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required keys in `.env.local`:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/resonance?schema=public"

# Clerk Authentication & Organization Settings
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/org-selection"

# Storage (Cloudflare R2 - Planned / In-flight)
# R2_ACCOUNT_ID=""
# R2_ACCESS_KEY_ID=""
# R2_SECRET_ACCESS_KEY=""
# R2_BUCKET_NAME="resonance-audio"
```

> [!IMPORTANT]
> In your **Clerk Dashboard**, make sure to navigate to **Configure > Organization Settings** and toggle **Enable organizations**. This is required for multi-tenant workspace routing.

### 4. Database Setup & Migrations

Run Prisma migrations to initialize your database tables:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Launch Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view your dashboard.

---

## 📁 Project Structure

```
├── public/                     # Static assets, brand logos, demo previews
├── prisma/
│   ├── schema.prisma           # Prisma data models & enums
│   └── migrations/             # SQL migration history
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Tenant dashboard pages & layouts
│   │   ├── org-selection/      # Organization picker flow
│   │   ├── sign-in/            # Clerk Sign-In route
│   │   ├── sign-up/            # Clerk Sign-Up route
│   │   ├── layout.tsx          # Root provider layout
│   │   └── globals.css         # Tailwind v4 directives & theme tokens
│   ├── components/
│   │   ├── ui/                 # 50+ accessible primitive UI components
│   │   └── page-header.tsx     # Responsive header banner
│   ├── features/
│   │   └── dashboard/          # Feature-sliced dashboard logic
│   │       ├── components/     # Sidebar, Org Switcher, User Button
│   │       └── views/          # Composable page views
│   ├── generated/              # Prisma client artifacts
│   ├── hooks/                  # Custom React hooks (useMobile, etc.)
│   ├── lib/
│   │   ├── db.ts               # Prisma singleton client instance
│   │   ├── env.ts              # Runtime type-safe env validation
│   │   └── utils.ts            # UI class merging helper (cn)
│   └── proxy.ts                # Clerk Edge authentication middleware
├── components.json             # shadcn/ui configuration
└── package.json
```

---

## 🛠️ Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts local Next.js development server with Turbopack |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Boots production server |
| `npm run lint` | Runs ESLint analysis with automatic fixes |
| `npm run format` | Formats all codebase files using Prettier |
| `npx prisma studio` | Launches interactive web GUI to inspect your database |
| `npx prisma migrate dev` | Creates and applies migrations in development |
| `npx prisma generate` | Regenerates Prisma Client based on current schema |

---

## 🗺️ Roadmap & Current Status

- [x] **Core Architecture & UI**
  - [x] Next.js 16 App Router foundation with React 19
  - [x] Responsive Dashboard shell with collapsible sidebar
  - [x] Full integration with Clerk Organizations and User profile management
- [x] **Security & Tenant Isolation**
  - [x] Edge middleware protection (`proxy.ts`)
  - [x] Auto-redirect to `/org-selection` when tenant is missing
  - [x] Type-safe environment validation (`@t3-oss/env-nextjs`)
- [x] **Database & Modeling**
  - [x] Relational schema for `Voice` and `Generation`
  - [x] Categorized voice enums and inference hyperparameters
- [ ] **Speech Synthesis Pipeline** *(In Progress)*
  - [ ] Open-source TTS model self-hosting & API bridge
  - [ ] Interactive waveform player with real-time scrub & download
  - [ ] Cloudflare R2 bucket integration for audio streaming
- [ ] **Voice Cloning Studio** *(Planned)*
  - [ ] Direct microphone audio recording in browser
  - [ ] Reference audio upload & acoustic extraction
  - [ ] Voice cloning fine-tuning settings
- [ ] **Analytics & Quota Engine** *(Planned)*
  - [ ] Character usage tracking & tier thresholds
  - [ ] Generation history export

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
