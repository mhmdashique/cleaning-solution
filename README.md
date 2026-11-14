# PLAN C Cleaning Solutions - Production Web Application

> **"You leave it, we clean it"**  
> Professional cleaning and pest control services in Kerala, based in Thrikannapuram, Thiruvananthapuram.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

---

## 1. Project Overview & Brand Identity

PLAN C Cleaning Solutions is a leading professional cleaning and pest control company with 5+ years of experience across Kerala. This web application is engineered for high performance, mobile-first responsiveness, WCAG AA accessibility, and search engine dominance for South Kerala local queries (Thiruvananthapuram, Kowdiar, Pattom, Kazhakkoottam, Technopark, Attingal, Neyyattinkara, etc.).

### Brand Specifications
- **Company Name:** PLAN C Cleaning Solutions (offers PLAN C Pest Control Solution)
- **Tagline:** "You leave it, we clean it"
- **Headquarters:** Thrikannapuram, Thiruvananthapuram, Kerala - 695032
- **Direct Helpline:** `7994342372`
- **WhatsApp Direct:** `+91 79943 42372`
- **Brand Colors:**
  - Deep Forest Green (`#15803D` / `#166534`)
  - Fresh Light Green Accent (`#22C55E` / `#4ADE80`)
  - Warm Highlight Yellow (`#FACC15`)
  - Slate Backgrounds (`#F8FAFC`, `#F1F5F9`)

---

## 2. Key Pages & Features

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Hero with conversion CTAs, trust stats (5+ yrs, 2500+ happy clients), 3 customer segment cards, 6 featured services, 6 "Why Choose Us" pillars, 3-step workflow, real South Kerala customer reviews, latest 3 blog posts, and interactive footer. |
| `/services` | **Services Directory** | Grouped by 4 categories (*Cleaning, Pest Control, Commercial, Specialised*) with real-time filter pills, instant live keyword search, and direct "Book this service" pre-fill buttons. |
| `/services/[slug]` | **Service Detail** | Dedicated SEO landing page per service with custom meta tags, JSON-LD `Service` schema, process overview tailored to Kerala's climate, FAQs,ushu and a sticky booking CTA card. |
| `/about` | **About Us** | Official company narrative, Mission & Vision statements, 6 core principle cards, and service area footprint. |
| `/reviews` | **Reviews & Ratings** | 14+ South Kerala seeded reviews, average rating score (4.9/5), star breakdown distribution, rating filter, and an interactive "Write a Review" form (`approved: false` until admin approved). |
| `/contact` | **Book / Contact** | Zod + React Hook Form booking submission with anti-spam honeypot, auto-generated unique booking codes (e.g. `PC-2025-XXXX`), interactive Google Maps embed for Thrikannapuram, directions button, and click-to-call. |
| `/track` | **Live Order Tracking** | **Zero login needed.** Customers enter their Booking ID + Phone number to inspect status (*Pending, Confirmed, In progress, Completed, Cancelled*), assigned team, address, reschedule, or write a post-service review. |
| `/admin` | **Admin Operations Hub** | **Passcode-protected server-side gate** (`ADMIN_PASSCODE` env var, HTTP-only signed session cookie). No user signup flow. Metrics dashboard, live booking status editor, CSV export, service catalog, review approval moderation, and blog publisher. |
| `/blog` | **Knowledge Base** | SEO blog with search, category filtering, reading times, tags, and rich articles targeting Trivandrum keywords. |
| `/blog/[slug]` | **Article Detail** | Full Markdown article reader, dynamic Table of Contents, social share buttons (WhatsApp, Twitter, Copy Link), JSON-LD `BlogPosting` schema, and related guides. |

---

## 3. Technology Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS with custom brand extension and shadow tokens
- **Icons:** Lucide React
- **Animations:** Framer Motion & Canvas Confetti
- **Validation:** Zod & React Hook Form
- **Database:** Supabase (PostgreSQL with Row Level Security policies)
- **Deployment:** Vercel ready with Edge optimization

---

## 4. Setup & Running Locally

### Step 1: Clone and Install Dependencies
```bash
git clone <repo-url>
cd "cleaning services"
npm install
```

### Step 2: Environment Configuration
Create a `.env.local` file (or copy from `.env.example`):
```bash
cp .env.example .env.local
```

Configure the environment variables:
```env
# Admin Passcode Gate
ADMIN_PASSCODE=replace-with-a-secure-passcode

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PHONE=7994342372
NEXT_PUBLIC_WHATSAPP=917994342372

# Supabase Configuration
# (Optional: the app includes a complete offline repository fallback if keys are omitted!)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 3: Supabase Database Migration & Seeding
1. Open your Supabase Dashboard: `https://app.supabase.com`
2. Navigate to the **SQL Editor**.
3. Run the schema script located at `supabase/schema.sql` (Creates `services`, `bookings`, `reviews`, `blog_posts`, `faqs`, `site_settings` with Row Level Security).
4. Run the seed script located at `supabase/seed.sql` (Seeds all 24 services, 14 South Kerala reviews, 5 local blog guides, and sample bookings).
5. For an existing database, run `supabase/migrations/20261104_add_booking_amount.sql` to enable admin-entered booking amounts.
6. Run `supabase/migrations/20261104_add_booking_payment_status.sql` to enable persistent paid/unpaid status and invoice seals.
7. For customer reschedule requests, run `supabase/migrations/20261113_add_reschedule_requests.sql` on existing databases.

### Step 4: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Admin Portal Access

- URL: `http://localhost:3000/admin`
- Enter the value configured in `ADMIN_PASSCODE`.
- Once verified, a secure HTTP-only cookie (`planc_admin_session`) is set.
- You can manage:
  - **Live bookings:** Update status from `Pending` -> `Confirmed` -> `In progress` -> `Completed`.
  - **Export Bookings:** One-click CSV download.
  - **Customer Reviews:** Approve or reject reviews submitted by public users.
  - **Blog articles:** Write and publish articles directly using the built-in Markdown editor.

---

## 6. Live Tracking Demo

- URL: `http://localhost:3000/track`
- Enter Demo Booking ID: `PC-2025-0001`
- Enter Registered Phone: `9847123456`
- The system will load the real-time order progression, assigned team ("Unit A - Lead: Suresh"), and options to reschedule or review.

---

## 7. Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables in the Vercel dashboard:
   - `ADMIN_PASSCODE`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**. Vercel will build the project with automatic ISR caching, dynamic OG metadata, and sitemap generation.

---

## 8. Blog Section

The home page displays the **latest 3 blog posts** from the knowledge base with:

- **Cover Images**: Each blog post features a professional cover image using Next.js Image optimization
- **Category Tags**: Posts are categorized by cleaning type (e.g., "Deep Cleaning", "Pest Control")
- **Reading Time**: Estimated 4-minute read time for easy browsing
- **Action Links**: "Read Article" buttons link to full Markdown content with dynamic Table of Contents
- **SEO Optimized**: All posts target Kerala-specific keywords for local search dominance

> **Note**: While our application uses cover images for visual appeal, the underlying content model focuses on text-based knowledge sharing for maintenance and pest control insights.

---

## 9. Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables in the Vercel dashboard:
   - `ADMIN_PASSCODE`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**. Vercel will build the project with automatic ISR caching, dynamic OG metadata, and sitemap generation.