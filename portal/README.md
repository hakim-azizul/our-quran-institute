# Our Quran Institute — Sanctuary Portal (Full-Stack Next.js)

A standalone, industry-standard full-stack Next.js web application encompassing **Frontend UI** and **Backend API Route Handlers** in a unified architecture. Designed specifically with complete repository isolation so it can live in this monorepo or be extracted directly into its own independent GitHub repository at any time.

---

## 🏛 Architecture & Folder Structure

```
portal/
├── app/                          # Next.js 14 App Router (Frontend + Backend)
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/
│   │   │   └── page.jsx          # Sanctuary Login (Student & Teacher + Admin fast sign-in)
│   │   └── register/
│   │       └── page.jsx          # Role-tailored Registration (Student & Teacher ONLY)
│   ├── dashboard/
│   │   └── page.jsx              # Student & Teacher Live Classroom & Hifz Dashboard
│   ├── admin/
│   │   └── page.jsx              # Executive Database Admin Dashboard (Protected)
│   ├── api/                      # Backend API Route Handlers
│   │   ├── admin/
│   │   │   └── users/route.js    # GET/PATCH: Direct database user records & stats
│   │   └── auth/
│   │       ├── login/route.js    # POST: Verify credentials & role-based redirect
│   │       ├── register/route.js # POST: Role validation & Admin creation block
│   │       ├── me/route.js       # GET: Session verification
│   │       └── logout/route.js   # POST: Invalidate session
│   ├── layout.jsx                # Root HTML, Google Fonts (Cormorant, Amiri, DM Sans)
│   ├── globals.css               # Solid White, Golden, and Emerald Green theme system
│   └── page.jsx                  # Root redirect to /login
├── components/                   # Modular React UI Components
│   ├── AuthNavbar.jsx            # Top banner with configurable landing link
│   ├── RoleSelector.jsx          # Student / Teacher 2-column switcher
│   ├── TeacherRegisterFields.jsx # Sanad authority, Qira'at Riwayah, experience
│   └── Icons.jsx                 # Custom luxury SVG icons
├── lib/                          # Backend Services & Data Layer
│   ├── auth.js                   # Session encoding, cookies & token utilities
│   └── db.js                     # Direct database mock store with admin seed & guard
├── public/                       # Standalone static assets & typography
│   ├── assets/                   # Institute logos, badges, and trellis motifs
│   └── fonts/                    # Font families
├── .env.example                  # Environment configuration template
├── .gitignore                    # Standalone git ignore rules
├── next.config.mjs               # Next.js configuration
└── package.json                  # Isolated dependencies & scripts
```

---

## 🔒 Security Policy: Admin Database Provisioning

- **Strict API Block**: The public `/api/auth/register` route enforces an explicit server-level validation block. Any request attempting `role: 'admin'` is rejected with **HTTP 403 Forbidden** (`ADMIN_REGISTRATION_FORBIDDEN`).
- **Database-Tier Exclusivity**: Admin accounts can **only be added or changed directly in `portal/lib/db.js`**.
- **Admin Dashboard**: Accessible at `/admin` for users authenticated with the provisioned administrator credentials.

---

## 🔑 Demo Credentials

| Role | Email / Institute ID | Password | Destination |
| :--- | :--- | :--- | :--- |
| **Student** | `tariq.student@quraninstitute.org` | `password123` | `/dashboard` |
| **Teacher / Scholar** | `dr.ahmad@quraninstitute.org` | `password123` | `/dashboard` |
| **System Admin** | `admin@quraninstitute.org` | `admin123` | `/admin` |

*(Quick 1-click test fill buttons for all three accounts are built right into the Login page)*

---

## 🎨 Solid Color Combination & Modern Aesthetics

- **Foundations**: Solid Crisp Pure White (`#FFFFFF`), Clean Canvas Porcelain (`#F8FAF7`)
- **Solid Emerald Green**: Primary Green (`#0D4A38`), Deep Islamic Green (`#062A1F`), Accent Green (`#15664F`)
- **Regal Solid Gold**: Warm Antique Gold (`#C5A45A`), Bright Gold (`#D4AF37`), Light Gold Accent Surface (`#FDF9EE`)
- **Typography**: Cormorant Garamond (Serif Display), Amiri (Arabic motifs), DM Sans (High-contrast, clean UI text)

---

## 🚀 Running Locally

```bash
# Navigate to portal directory
cd portal

# Start development server on port 3001
npm run dev

# Build for production
npm run build
```

Default local URL: [http://localhost:3001](http://localhost:3001)
