CREATE OR REPLACE FUNCTION public.get_admin_login_status(p_client_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    current_lock TIMESTAMPTZ;
    current_strike INTEGER;
BEGIN
    IF p_client_key !~ '^[0-9a-f]{64}$' THEN
        RAISE EXCEPTION 'Invalid admin login client key';
    END IF;

    SELECT attempts.locked_until, attempts.strike_level
      INTO current_lock, current_strike
      FROM public.admin_login_attempts AS attempts
     WHERE attempts.client_key = p_client_key;

    RETURN jsonb_build_object(
        'locked', current_lock IS NOT NULL AND current_lock > clock_timestamp(),
        'lockedUntil',
            CASE
                WHEN current_lock IS NOT NULL
                    AND current_lock > clock_timestamp()
                THEN floor(extract(epoch FROM current_lock) * 1000)::BIGINT
                ELSE NULL
            END,
        'lockDurationSeconds',
            CASE
                WHEN current_lock IS NULL OR current_lock <= clock_timestamp()
                    THEN NULL
                WHEN current_strike = 1 THEN 30
                WHEN current_strike = 2 THEN 60
                WHEN current_strike = 3 THEN 300
                ELSE 900
            END
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_login_status(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_login_status(TEXT) TO service_role;
