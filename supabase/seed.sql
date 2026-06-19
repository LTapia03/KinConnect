-- Seed data for local development.
-- Admin profile: sign up via Supabase Auth, then promote with:
--   update public.profiles set role = 'admin' where id = (
--     select id from auth.users where email = 'admin@example.com'
--   );

insert into public.schedule_events (
  title,
  description,
  starts_at,
  ends_at,
  location,
  is_published,
  sort_order
)
values
  (
    'Welcome Reception',
    'Meet fellow family members in the hotel lobby.',
    '2026-07-10 17:00:00+00',
    '2026-07-10 19:00:00+00',
    'Hotel Lobby',
    true,
    1
  ),
  (
    'Family Banquet',
    'Dinner, program, and branch roll call.',
    '2026-07-11 18:00:00+00',
    '2026-07-11 21:00:00+00',
    'Grand Ballroom',
    true,
    2
  ),
  (
    'Branch Photo Session',
    'Group photos by branch — unpublished draft for admin testing.',
    '2026-07-12 10:00:00+00',
    '2026-07-12 11:00:00+00',
    'Courtyard',
    false,
    3
  );

insert into public.announcements (title, body, is_published)
values (
  'Parking and Check-in',
  'Use the south parking lot. Check-in opens at 3 PM on Thursday.',
  true
);
