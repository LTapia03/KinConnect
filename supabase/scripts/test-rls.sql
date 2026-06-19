-- Manual RLS verification script for local Supabase.
-- Run after `supabase db reset` with two test users created via Auth.

-- 1. Promote one user to admin:
-- select public.promote_to_admin('your-admin@example.com');

-- 2. As registrant (authenticated JWT), verify:
-- select * from public.registrations; -- should only return own rows
-- insert into public.registrations (...) values (...); -- should succeed for own user_id with status = 'draft'
-- update public.registrations set room_preference = 'Updated' where user_id = auth.uid();
-- insert/update with status = 'submitted' should be denied for non-admins

-- 3. As anon, verify public reads:
-- set role anon;
-- select * from public.schedule_events where is_published = true; -- should return published rows only
-- select * from public.announcements where is_published = true;

-- 4. As registrant, verify admin-only writes fail:
-- insert into public.schedule_events (...) values (...); -- should be denied
-- insert into public.email_campaigns (subject, body) values ('Test', 'Body'); -- denied

-- 5. As registrant, verify role escalation is blocked:
-- update public.profiles set role = 'admin' where id = auth.uid(); -- must fail
-- Expected: ERROR permission denied or "Only admins can change profile roles"

-- 6. As admin, verify full access:
-- select * from public.registrations;
-- insert/update/delete on schedule_events and announcements should succeed
-- delete from public.registrations where id = '<registration-id>'; -- should succeed for admins only

select 'RLS test script loaded. Execute the steps above with psql or Supabase SQL editor.' as note;
