ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS reschedule_requested_date DATE;

ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS reschedule_reason TEXT;

ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS reschedule_requested_at TIMESTAMP WITH TIME ZONE;

UPDATE bookings
SET
    reschedule_requested_date = substring(
        admin_notes FROM 'RESCHEDULE REQUEST: New date → ([0-9]{4}-[0-9]{2}-[0-9]{2})'
    )::DATE,
    reschedule_reason = NULLIF(
        substring(admin_notes FROM '\. Reason: (.*)$'),
        ''
    ),
    reschedule_requested_at = created_at
WHERE admin_notes LIKE 'RESCHEDULE REQUEST:%'
  AND reschedule_requested_date IS NULL
  AND substring(
      admin_notes FROM 'RESCHEDULE REQUEST: New date → ([0-9]{4}-[0-9]{2}-[0-9]{2})'
  ) IS NOT NULL;
