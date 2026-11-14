CREATE TABLE IF NOT EXISTS public.admin_login_attempts (
    client_key TEXT PRIMARY KEY
        CHECK (client_key ~ '^[0-9a-f]{64}$'),
    failed_attempts INTEGER NOT NULL DEFAULT 0
        CHECK (failed_attempts BETWEEN 0 AND 2),
    strike_level INTEGER NOT NULL DEFAULT 0
        CHECK (strike_level >= 0),
    last_failure_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    locked_until TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.admin_login_attempts FROM PUBLIC, anon, authenticated;

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

CREATE OR REPLACE FUNCTION public.record_admin_login_failure(p_client_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    now_at TIMESTAMPTZ := clock_timestamp();
    current_row public.admin_login_attempts%ROWTYPE;
    is_recent BOOLEAN;
    next_attempts INTEGER;
    next_strike INTEGER;
    lock_seconds INTEGER;
    new_lock TIMESTAMPTZ;
BEGIN
    IF p_client_key !~ '^[0-9a-f]{64}$' THEN
        RAISE EXCEPTION 'Invalid admin login client key';
    END IF;

    DELETE FROM public.admin_login_attempts
     WHERE updated_at < now_at - INTERVAL '24 hours'
       AND client_key <> p_client_key;

    INSERT INTO public.admin_login_attempts (client_key)
    VALUES (p_client_key)
    ON CONFLICT (client_key) DO NOTHING;

    SELECT *
      INTO current_row
      FROM public.admin_login_attempts
     WHERE client_key = p_client_key
     FOR UPDATE;

    IF current_row.locked_until IS NOT NULL AND current_row.locked_until > now_at THEN
        RETURN jsonb_build_object(
            'locked', TRUE,
            'lockedUntil', floor(extract(epoch FROM current_row.locked_until) * 1000)::BIGINT,
            'lockDurationSeconds', CASE
                WHEN current_row.strike_level = 1 THEN 30
                WHEN current_row.strike_level = 2 THEN 60
                WHEN current_row.strike_level = 3 THEN 300
                ELSE 900
            END,
            'attemptsLeft', 0,
            'strikeLevel', current_row.strike_level
        );
    END IF;

    is_recent := current_row.last_failure_at > now_at - INTERVAL '1 hour';
    next_attempts := CASE
        WHEN is_recent THEN current_row.failed_attempts + 1
        ELSE 1
    END;

    IF next_attempts >= 3 THEN
        next_strike := CASE
            WHEN is_recent THEN current_row.strike_level + 1
            ELSE 1
        END;
        lock_seconds := CASE
            WHEN next_strike = 1 THEN 30
            WHEN next_strike = 2 THEN 60
            WHEN next_strike = 3 THEN 300
            ELSE 900
        END;
        new_lock := now_at + make_interval(secs => lock_seconds);

        UPDATE public.admin_login_attempts
           SET failed_attempts = 0,
               strike_level = next_strike,
               last_failure_at = now_at,
               locked_until = new_lock,
               updated_at = now_at
         WHERE client_key = p_client_key;

        RETURN jsonb_build_object(
            'locked', TRUE,
            'lockedUntil', floor(extract(epoch FROM new_lock) * 1000)::BIGINT,
            'lockDurationSeconds', lock_seconds,
            'attemptsLeft', 0,
            'strikeLevel', next_strike
        );
    END IF;

    UPDATE public.admin_login_attempts
       SET failed_attempts = next_attempts,
           strike_level = CASE
               WHEN is_recent THEN current_row.strike_level
               ELSE 0
           END,
           last_failure_at = now_at,
           locked_until = NULL,
           updated_at = now_at
     WHERE client_key = p_client_key;

    RETURN jsonb_build_object(
        'locked', FALSE,
        'lockedUntil', NULL,
        'lockDurationSeconds', NULL,
        'attemptsLeft', 3 - next_attempts,
        'strikeLevel', CASE
            WHEN is_recent THEN current_row.strike_level
            ELSE 0
        END
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.clear_admin_login_attempts(p_client_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_client_key !~ '^[0-9a-f]{64}$' THEN
        RAISE EXCEPTION 'Invalid admin login client key';
    END IF;

    DELETE FROM public.admin_login_attempts
     WHERE client_key = p_client_key;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_login_status(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_admin_login_failure(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.clear_admin_login_attempts(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_login_status(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_admin_login_failure(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.clear_admin_login_attempts(TEXT) TO service_role;
