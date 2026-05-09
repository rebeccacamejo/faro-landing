-- Waitlist signups
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text        NOT NULL UNIQUE,
  business_name   text,
  audience        text        NOT NULL CHECK (audience IN ('owner', 'advisor')),
  referral_code   text        NOT NULL UNIQUE,
  referred_by_code text,
  referral_count  int         NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  locale          text                 DEFAULT 'en',
  ip_address      inet,
  user_agent      text
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email          ON waitlist_signups (email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code  ON waitlist_signups (referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_referred_by    ON waitlist_signups (referred_by_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_rank           ON waitlist_signups (referral_count DESC, created_at ASC);

ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;
-- Service role key bypasses RLS; anon key is completely blocked
CREATE POLICY "deny_all" ON waitlist_signups FOR ALL USING (false);

-- Analytics events
CREATE TABLE IF NOT EXISTS faro_events (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name   text        NOT NULL,
  properties   jsonb                DEFAULT '{}',
  anonymous_id text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_name    ON faro_events (event_name);
CREATE INDEX IF NOT EXISTS idx_events_created ON faro_events (created_at DESC);

ALTER TABLE faro_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_all" ON faro_events FOR ALL USING (false);

-- Atomically increment referral_count for a given code
CREATE OR REPLACE FUNCTION increment_referral_count(referrer_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE waitlist_signups
     SET referral_count = referral_count + 1
   WHERE referral_code = referrer_code;
END;
$$;

-- Compute 1-based waitlist position (higher referral_count = earlier in queue)
CREATE OR REPLACE FUNCTION get_waitlist_position(p_referral_count int, p_created_at timestamptz)
RETURNS int
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    (SELECT COUNT(*)::int FROM waitlist_signups WHERE referral_count > p_referral_count) +
    (SELECT COUNT(*)::int FROM waitlist_signups WHERE referral_count = p_referral_count AND created_at < p_created_at)
    + 1;
$$;
