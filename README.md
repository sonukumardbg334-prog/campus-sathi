# CampusSaathi — Multi-College Smart Campus Management Platform
> **Tagline:** *"One Campus. Every Connection."*

CampusSaathi is an enterprise-grade, multi-institution smart campus management and verified grievance dispatch web application designed for universities, autonomous colleges, hostels, students, parents, faculty, wardens, and maintenance crews across India.

---

## 🌟 Key Features & Portals

### 1. Unified 9-Role Multi-Tenant Architecture
One unified web application supporting distinct, secure portals sharing a cohesive SaaS design system:
- **Student Portal:** Mobile-first grievance reporting with camera capture, real-time status progression, ERP-synced attendance, mid-term academic scores, class schedules, and daily mess feedback.
- **Hostel Warden Operational Console:** Live grievance review queue, urgency indicators, staff delegation, side-by-side photographic verification (Problem Photo vs. Staff Resolution Proof), and duplicate issue clustering.
- **Maintenance & Facility Staff:** Work orders queue, task status updates (`IN_PROGRESS`, `AWAITING_VERIFICATION`), repair progress notes, and camera/gallery resolution proof uploads.
- **Parent / Guardian Portal:** Anti-enumeration student linking with secret institution-issued PIN, attendance percentages with automated low-attendance warnings, mid-term assessment scores, and faculty remarks.
- **Faculty / Teacher Portal:** 1-click batch attendance recording with duplicate session prevention, formula-based percentage tracking `(Present Sessions / Total Sessions) * 100`, gradebook, and campus announcements.
- **Institution Administrator:** Multi-department governance, staff directories, parent-student link approvals, student registries, institutional settings, and CSV/PDF compliance reports.
- **Platform Super Administrator:** Review and approve/reject new college affiliation applications, manage campus tenant statuses (`APPROVED`, `PENDING_APPROVAL`, `SUSPENDED`), and inspect immutable security audit logs.
- **Mess & Dining Manager:** 4-meal daily menu scheduling (Breakfast, Lunch, Evening Snacks, Dinner), student food satisfaction tracking, and taste/hygiene grievance management.
- **Campus Welfare Staff:** Grievance triage and student support.

### 2. Verified Grievance Lifecycle
- **Status Machine:** `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `AWAITING_VERIFICATION` ➔ `RESOLVED` (or `REOPENED` / `REJECTED`).
- **Photographic Accountability:** Mandatory visual proof captured at submission and repair completion.
- **Smart AI & Rule Classifier:** Automatically suggests grievance categories and priority levels based on NLP keyword detection (e.g., electrical sparks, plumbing leaks, Wi-Fi outages).
- **Duplicate Detection Engine:** Clustered alerts prevent redundant technician dispatches for the same building, floor, and category.

### 3. Zero-Trust PostgreSQL Row Level Security (RLS)
- Fully isolated multi-tenant data model using `institution_id`.
- Tenant A cannot read, query, or infer records belonging to Tenant B.
- Parents can only access records for approved, PIN-verified relationships.
- Private object storage policies for sensitive evidence photos.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons, React Router 7
- **Forms & Validation:** React Hook Form, Zod validation
- **Data Visualization:** Recharts (Analytics and resolution charts)
- **Notifications & UI Polish:** Sonner toast notifications, Canvas Confetti
- **Backend & Database:** Supabase PostgreSQL, Supabase Auth, Supabase Storage, PostgreSQL Row Level Security (RLS)
- **Testing:** Vitest automated test suite

---

## 📁 Project Structure

```
campus-saathi/
├── .env.example                     # Environment template
├── .env                             # Active environment configuration
├── index.html                       # Application HTML entry point
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # SaaS brand colors & theme configuration
├── postcss.config.js                # PostCSS plugins
├── tsconfig.json                    # TypeScript compiler configuration
├── supabase/
│   ├── migrations/
│   │   └── 20261029000000_campus_saathi_schema.sql # Complete 34-table SQL schema & RLS policies
│   └── seed.sql                     # Seed dataset (Khalsa College, LPU, IIT Delhi)
├── tests/
│   └── campussaathi.test.ts         # Automated test suite (14 passing tests)
└── src/
    ├── types/                       # Domain TypeScript interfaces
    ├── context/
    │   └── AuthContext.tsx          # Multi-role authentication & fast demo switcher
    ├── lib/
    │   ├── supabase.ts              # Supabase client wrapper & live connection detector
    │   ├── store.ts                 # Interactive state engine, NLP classifier & duplicate detector
    │   └── mockData.ts              # Pre-seeded test personas and data
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.tsx        # Authenticated portal shell with sidebar & topbar
    │   │   └── PublicLayout.tsx     # Public marketing site layout
    │   └── ui/
    │       ├── Button.tsx           # Reusable accessible button
    │       ├── Card.tsx             # Card, Header, Title, Content
    │       ├── Input.tsx            # Form inputs, select fields, and textareas
    │       ├── Modal.tsx            # Accessible modal dialog
    │       ├── Badge.tsx            # Status and priority badges
    │       ├── PhotoUpload.tsx      # Camera & gallery image uploader with live preview
    │       ├── RoleSwitcher.tsx     # 1-Click fast role switcher for evaluators
    │       └── NotificationDrawer.tsx # In-app notification slide-over drawer
    └── pages/
        ├── public/                  # Home, Features, Institutions, Register, Login, Legal
        ├── student/                 # Dashboard, New Complaint, Tracker, Attendance, Academics, Mess
        ├── warden/                  # Warden Operational Console & Verification
        ├── maintenance/             # Work orders & resolution photo proof
        ├── parent/                  # Guardian dashboard & PIN linking
        ├── teacher/                 # Class attendance register & academics
        ├── admin/                   # Institution admin, metrics & parent approvals
        ├── superadmin/              # Master tenant manager & audit ledger
        └── mess/                    # Dining menus & meal reviews
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js (v18.x or newer, v24 recommended)
- npm or pnpm

### 1. Installation
Clone or navigate to the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```

To connect to a live Supabase project, supply your credentials in `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME=CampusSaathi
VITE_APP_TAGLINE=One Campus. Every Connection.
```

> **Hackathon Ready:** If live Supabase credentials are not configured, CampusSaathi automatically activates its built-in, persistent browser client engine with realistic test personas for Khalsa College, LPU, and IIT Delhi. Every workflow—photo uploads, warden assignment, resolution verification, and attendance marking—runs smoothly offline or online.

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run Automated Test Suite
```bash
npm test
```
Executes the Vitest suite covering the complaint lifecycle, duplicate detection, parent verification, and RLS tenancy logic.

### 5. Production Build
```bash
npm run build
```
Creates a minified, type-checked production bundle in `dist/`.

---

## 🗄️ Database & Supabase Migrations

The database migration file is located at `supabase/migrations/20261029000000_campus_saathi_schema.sql`.

### Applying Migrations via Supabase Dashboard
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project and navigate to the **SQL Editor**.
3. Copy the contents of `supabase/migrations/20261029000000_campus_saathi_schema.sql` and run the script.
4. (Optional) Run `supabase/seed.sql` to populate sample colleges, hostel blocks, mess menus, and demo records.

### Storage Buckets Setup
The migration script automatically provisions the following buckets:
- `complaint-evidence`: Private bucket for student problem photographs.
- `resolution-evidence`: Private bucket for maintenance repair proof photographs.
- `profile-images`: Public bucket for user avatars.
- `institution-assets`: Public bucket for college crests and banners.

---

## 🎭 1-Click Demo Evaluation Personas

During hackathon judging and live demonstrations, use the **Persona Switcher** in the top navigation bar or the 1-click tiles on the `/login` page:

| Role | Demo Persona Name | Email | Primary Journey |
| :--- | :--- | :--- | :--- |
| **Student** | Amanpreet Kaur | `amanpreet.cse@khalsa.edu.in` | File complaint with photo, track progress, review attendance |
| **Hostel Warden** | Col. Balwinder Singh | `warden.boys@khalsa.edu.in` | Urgent queue, assign technician, verify repair proof |
| **Maintenance** | Ramesh Kumar | `ramesh.maint@khalsa.edu.in` | Accept order, upload resolution photo, submit for review |
| **Parent** | S. Harjit Singh | `harjit.singh@gmail.com` | Link ward with PIN, monitor attendance & exam scores |
| **Teacher** | Dr. Neha Verma | `neha.cse@khalsa.edu.in` | Batch mark class attendance, post announcements |
| **Campus Admin** | Prof. Gurpreet Singh | `admin@khalsa.edu.in` | Approve parent links, view campus metrics & workload |
| **Super Admin** | Dr. Rajesh Sharma | `superadmin@campussaathi.in` | Approve new college registrations, inspect audit logs |
| **Mess Manager** | Chef Surinder Gill | `mess.manager@khalsa.edu.in` | Update daily menus, review student food ratings |

---

## 🔒 Security & Privacy Highlights

1. **Multi-Tenant Row Level Security:** Every query evaluates `institution_id = current_user_institution()`.
2. **Anti-Enumeration Guardrails:** Parent-student linking prevents brute-forcing student records through mandatory offline PIN verification.
3. **Restricted Storage Access:** Problem and resolution evidence is protected via signed URL mechanisms.
4. **No Plaintext Passwords:** Supabase Auth manages cryptographic password hashing (bcrypt/Argon2).
5. **No Privileged Secrets in Frontend:** Server secrets (`service_role` keys, AI API keys) are strictly isolated from client bundles.

---

## 📄 License & Attribution
CampusSaathi is developed as a showcase smart campus management platform for college hackathons. Fictional institution names (Khalsa College, LPU, IIT Delhi, GNDU) are used solely for realistic testing and demonstration purposes.
