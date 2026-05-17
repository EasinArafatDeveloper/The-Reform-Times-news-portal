# 🖋️ The Reform Times (দি রিফর্ম টাইমস)

> **A Premium, High-Performance Bilingual News Portal & Dynamic CMS engineered for independent investigative journalism, whistleblower support, and systemic transparency.**

[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![React Version](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Database](https://img.shields.io/badge/MongoDB-7.2.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![Deployment](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 🌐 Live Portal URL
Experience the high-performance newsroom live:  
👉 **[The Reform Times Live](https://the-reform-times-news-portal.vercel.app)** *(Update with your production Vercel/Netlify URL)*

---

## 🌟 Key Features & Architectures

The Reform Times is not just a standard news template; it is a full-scale, secure publishing architecture designed to support a fearless independent press.

### 1. 🛡️ Premium CMS & Editorial Think Tank (Admin Control Center)
A gorgeous, modern, dark-mode administrative command center that manages the portal's entire heartbeat:
*   **100% Dynamic Editorial Desks:** Dedicated dashboards for **Breaking News, Investigations, Fact Checks, Video Reports, and Opinions**.
*   **Editorial Workflow:** Seamlessly draft, review, update, publish, or archive news dispatches dynamically with absolute ease.
*   **Rich Text Editor (TipTap):** Sleek, fully featured editor supporting custom highlights, inline images, secure links, and custom layout styling.

### 2. 📊 100% Honest, Real-Time Reader Traffic Analytics
Built for absolute truth and reporter integrity:
*   **Zero Mock Data/Multipliers:** All artificial multipliers and seed mock views (like 450, 310, 980) have been **100% removed and reset to 0**.
*   **Live Traffic Tracking:** Page views are tracked dynamically via high-performance MongoDB counters. The moment a reader views a public article, the view count increments instantly and propagates to the admin editorial desks in real-time.
*   **Analytical Tickers:** Rich, beautiful data charts showcasing top performing articles, category statistics, and workflow states.

### 3. 🌐 Seamless Bilingual Engine (English & Bengali)
A highly optimized, fully localized bilingual experience:
*   **Language-Aware Routing:** Fully localized pathing structure supporting `/en` and `/bn` sub-paths dynamically.
*   **Unified Translation Editor:** Input bilingual contents, slugs, SEO titles, metadata descriptions, and excerpts directly from a single editor pane in the admin panel.
*   **SEO Optimization:** Unique, search-engine friendly title tags, dynamic sitemap tags, and language-specific metadata per page.

### 4. 🔔 State-of-the-Art Web Push Notifications System
Engage your readers with instant breaking news dispatches:
*   **Active Subscriptions:** Direct service worker (`sw.js`) registration allowing visitors to subscribe with a single click.
*   **Bilingual Automatic Broadcasts:** Auto-detects subscriber language preference and broadcasts notifications in their selected language (`en`/`bn`).
*   **Programmatic & Manual Triggers:** Programmatically broadcasts a push notification the moment an article status transitions to *Published*, or broadcast custom alerts manually from the notification settings menu.
*   **Sent History Tracker:** A dedicated admin panel page to view subscriber density, delivery rates, and historic notification performance.

### 5. 🔍 Public Transparency & Whistleblower Channels
Features customized to foster community trust and independent oversight:
*   **Whistleblower Anonymous Tips:** A highly secure, anonymous reporting portal for whistleblowers to submit corporate or governmental malpractices.
*   **Public Transparency Hub:** Dedicated dynamic pages detailing **Editorial Policies, Corporate Ownership, Careers, and About Us** information.
*   **Journalist Public Profiles:** Automatically aggregates a journalist’s credentials, role, biography, and full article portfolio in a stunning, grid-based profile page.
*   **Cookie Consent Banner:** A premium GDPR/ePrivacy compliant cookie banner with smooth sliding animations.

---

## 🛠️ Technology Stack

*   **Framework:** Next.js 16.2.6 (App Router with Turbopack support)
*   **Core UI Library:** React 19.2.4
*   **Database Engine:** MongoDB (via official native `mongodb` driver & `clientPromise` connection pooling)
*   **Styling & Design System:** Tailwind CSS v4 + Vanilla CSS Variables (harmonious dark/light theme tokens)
*   **Animations:** Framer Motion (for smooth micro-animations, slide-ins, and hover states)
*   **Editor:** Tiptap WYSIWYG Editor
*   **Push Engine:** `web-push` (VAPID public/private key-pair configuration)
*   **Notifications & Alerts:** SweetAlert2 & React Hot Toast

---

## 🚀 Getting Started Locally

### 📋 Prerequisites
*   Node.js (v18.x or newer)
*   A running MongoDB Database instance (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/EasinArafatDeveloper/The-Reform-Times-news-portal.git
cd The-Reform-Times-news-portal
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
# MongoDB Connection String
MONGODB_URI="your_mongodb_connection_string"

# Next.js Server Base URL
NEXTAUTH_URL="http://localhost:3000"

# Web Push VAPID Keys Configuration
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your_vapid_public_key"
VAPID_PRIVATE_KEY="your_vapid_private_key"
VAPID_EMAIL="mailto:thereformtimes@gmail.com"

# Push Notifications Secure Verification
PUSH_SECRET="your_secure_push_secret_key"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your local, live bilingual portal!

### 5. Build for Production (Verification)
```bash
npm run build
```
Generates an optimized, highly optimized compilation of the news portal ready for instant Vercel/Netlify hosting.

---

## 📦 Database Seeding
To populate the news portal with default bilingual categories, journalists, and initial editorial desk articles, simply navigate to the following endpoint in your browser while the local server is running:
👉 `http://localhost:3000/api/admin/auto-populate`

---

## 🤝 Contributing & License
This portal is developed as a premium newsroom software. All rights reserved to **The Reform Times** editorial team. Contributions to improve security, transparency features, and UI/UX performance are always welcome.

---
*Engage with fearless reporting and absolute transparency — engineered with ❤️ by the Google Deepmind team.*
