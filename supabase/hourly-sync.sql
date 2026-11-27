-- Nepali Tools — HOURLY DATA SYNC via Supabase pg_cron + pg_net
-- ✅ APPLIED to the live project (2026-11-12, verified end-to-end: HTTP 200 with real data).
-- Why: Vercel Hobby allows cron jobs at most ONCE PER DAY, so the website's
-- hourly sync is triggered from Supabase instead. The Vercel cron
-- (02:00 UTC daily) stays as a fallback, and the newsletter cron (02:45 UTC)
-- still re-syncs right before sending, so the daily email always carries the
-- freshest data available.
--
-- NOTE on pg_net API (this project's version):
--   headers is a plain JSON OBJECT ({"Authorization": "Bearer ..."}),
--   and the timeout argument is named timeout_milliseconds (NOT timeout_msec,
--   NOT an array-of-arrays headers form). The response lands in
--   net._http_response (status_code/content). To verify:
--     select jobname, schedule, active from cron.job;
--     select status_code, left(content, 200) from net._http_response order by id desc limit 1;
-- To unschedule: select cron.unschedule('nepalitools-hourly-sync');

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'nepalitools-hourly-sync',
  '0 * * * *',  -- every hour on the hour (UTC); sources publish at different NPT times of day
  $$
  select net.http_post(
    url := 'https://allnepalitools.com/api/data/sync',
    body := '{}'::jsonb,
    headers := '{"Authorization": "Bearer <SYNC_SECRET_PLACEHOLDER>", "Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 120000
  );
  $$
);
