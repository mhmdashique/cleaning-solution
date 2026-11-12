-- ==============================================================================
-- PLAN C Cleaning Solutions — Full Database Setup (Safe to run on fresh DB)
-- Run this entire file in Supabase SQL Editor if starting from scratch.
-- It is idempotent: safe to re-run (uses IF NOT EXISTS / IF NOT EXISTS checks).
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. SERVICES TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('cleaning', 'pest_control', 'commercial', 'specialised')),
    short_desc TEXT NOT NULL,
    long_desc TEXT NOT NULL,
    image_url TEXT NOT NULL,
    icon TEXT,
    duration TEXT DEFAULT '2–3 hours',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE services ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '2–3 hours';
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. BOOKINGS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name TEXT,
    address TEXT NOT NULL,
    preferred_date DATE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'In progress', 'Completed', 'Cancelled')),
    amount NUMERIC(12, 2),
    is_paid BOOLEAN NOT NULL DEFAULT false,
    assigned_team TEXT DEFAULT 'PLAN C Quick Response Unit',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. REVIEWS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name TEXT,
    comment TEXT NOT NULL,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. BLOG POSTS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author TEXT DEFAULT 'PLAN C Editorial Team',
    published BOOLEAN DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published, published_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4b. CLIENT NOTES TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_notes (
    booking_code TEXT PRIMARY KEY,
    handled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_notes_handled ON client_notes(handled);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. FAQS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_service ON faqs(service_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. SITE SETTINGS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Services
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='services' AND policyname='Public services read') THEN
    CREATE POLICY "Public services read" ON services FOR SELECT USING (true);
  END IF;
END $$;

-- Bookings
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='bookings' AND policyname='Public booking insert') THEN
    CREATE POLICY "Public booking insert" ON bookings FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='bookings' AND policyname='Public tracking read') THEN
    CREATE POLICY "Public tracking read" ON bookings FOR SELECT USING (true);
  END IF;
END $$;

-- Reviews
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='Public approved reviews read') THEN
    CREATE POLICY "Public approved reviews read" ON reviews FOR SELECT USING (approved = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='Public review insert') THEN
    CREATE POLICY "Public review insert" ON reviews FOR INSERT WITH CHECK (approved = false);
  END IF;
END $$;

-- Blog
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='Public blog read') THEN
    CREATE POLICY "Public blog read" ON blog_posts FOR SELECT USING (published = true);
  END IF;
END $$;

-- FAQs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='faqs' AND policyname='Public faqs read') THEN
    CREATE POLICY "Public faqs read" ON faqs FOR SELECT USING (true);
  END IF;
END $$;

-- Client notes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='client_notes' AND policyname='Public client notes read') THEN
    CREATE POLICY "Public client notes read" ON client_notes FOR SELECT USING (true);
  END IF;
END $$;

-- Site settings
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Public site_settings read') THEN
    CREATE POLICY "Public site_settings read" ON site_settings FOR SELECT USING (true);
  END IF;
END $$;

-- Service Role key (SUPABASE_SERVICE_ROLE_KEY) automatically bypasses RLS for admin writes.

