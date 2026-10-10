# Our Quran Institute — Multi-App Workspace

This repository houses two completely self-contained, decoupled applications designed following industry standards for modular separation:

1. **`landing/`** — The public marketing and admissions website (Next.js 14, default port 3000).
2. **`portal/`** — The full-stack student, faculty, and parent portal containing both frontend UI and backend API routes in Next.js 14 (port 3001).

---

## 🏗 Repository Structure & Independence

```
our-quran-institute/
├── landing/                # Public Institute Website & Course Showcase
│   ├── app/                # Next.js App Router
│   ├── src/                # UI components & interactive 3D flipbook
│   ├── public/             # Marketing assets & typography
│   ├── package.json        # Port 3000
│   └── .gitignore
│
└── portal/                 # Full-Stack Sanctuary Portal (Frontend + Backend)
    ├── app/                # Next.js App Router
    │   ├── (auth)/         # Login & Register pages
    │   ├── dashboard/      # LMS Classroom & Progress Dashboard
    │   └── api/auth/       # Backend API Route Handlers (login, register, me, logout)
    ├── components/         # Role selectors, registration forms, luxury UI
    ├── lib/                # Database layer & Session authentication
    ├── public/             # Branding & font assets
    ├── .env.example        # Environment variables template
    ├── package.json        # Port 3001
    └── .gitignore
```

Each folder (`landing` and `portal`) is **100% self-contained**:
- Separate `package.json` and dependencies
- Separate `.gitignore` files
- Separate `public/` assets
- **Zero relative cross-folder imports** (`portal` never imports from `../landing` and vice versa)
- Cross-application communication is strictly done via standard URL links and environment variables (`NEXT_PUBLIC_LANDING_URL` and `NEXT_PUBLIC_PORTAL_URL`).

---

## 🚀 Quick Start (Running Both Locally)

### 1. Run the Landing Page (Port 3000)
```bash
cd landing
npm install
npm run dev
# Accessible at: http://localhost:3000
```

### 2. Run the Portal (Port 3001)
```bash
cd portal
npm install
npm run dev
# Accessible at: http://localhost:3001/login
```

---

## 📦 Splitting Into Separate Repositories

When you are ready to separate `landing` and `portal` into distinct GitHub repositories, you can do so immediately without any code refactoring:

### To extract `portal` into a new repository:
```bash
cd portal
git init
git add .
git commit -m "feat: initial commit for Quran Institute Portal"
git remote add origin https://github.com/<your-username>/our-quran-institute-portal.git
git branch -M main
git push -u origin main
```

### To extract `landing` into a new repository:
```bash
cd landing
git init
git add .
git commit -m "feat: initial commit for Quran Institute Landing"
git remote add origin https://github.com/<your-username>/our-quran-institute-landing.git
git branch -M main
git push -u origin main
```
