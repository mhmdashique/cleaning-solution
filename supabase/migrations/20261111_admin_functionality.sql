-- ==============================================================================
-- PLAN C Cleaning Solutions - Admin functionality migration
-- Adds service duration/visibility and client note handled state.
-- ==============================================================================

-- Services: duration + active visibility flag
ALTER TABLE services
    ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '2–3 hours';

ALTER TABLE services
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Client notes: handled state keyed by booking code
CREATE TABLE IF NOT EXISTS client_notes (
    booking_code TEXT PRIMARY KEY,
    handled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_notes_handled ON client_notes(handled);

-- Row level security: admin writes use the service-role key, which bypasses RLS.
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'client_notes'
          AND policyname = 'Public client notes read'
    ) THEN
        CREATE POLICY "Public client notes read" ON client_notes
            FOR SELECT USING (true);
    END IF;
END $$;
