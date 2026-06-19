-- Seed data for local development.
-- Default admin: admin@example.com / localdevpassword

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('localdevpassword', gen_salt('bf')),
  timezone('utc', now()),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"first_name":"Local","last_name":"Admin","phone":"512-555-0199"}'::jsonb,
  timezone('utc', now()),
  timezone('utc', now())
);

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'admin@example.com',
  jsonb_build_object(
    'sub', '11111111-1111-1111-1111-111111111111',
    'email', 'admin@example.com'
  ),
  'email',
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
);

select public.promote_to_admin('admin@example.com');

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
