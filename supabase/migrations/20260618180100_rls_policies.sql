-- Row-level security policies

alter table public.profiles enable row level security;
alter table public.registrations enable row level security;
alter table public.schedule_events enable row level security;
alter table public.announcements enable row level security;
alter table public.email_campaigns enable row level security;

-- Profiles
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "Admins can insert profiles"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

-- Registrations
create policy "Registrants can view own registrations"
on public.registrations
for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

create policy "Registrants can insert own registrations"
on public.registrations
for insert
to authenticated
with check (auth.uid() = user_id or public.is_admin());

create policy "Registrants can update own registrations"
on public.registrations
for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "Registrants can delete own registrations"
on public.registrations
for delete
to authenticated
using (auth.uid() = user_id or public.is_admin());

-- Schedule events
create policy "Public can view published schedule events"
on public.schedule_events
for select
to anon, authenticated
using (is_published = true or public.is_admin());

create policy "Admins manage schedule events"
on public.schedule_events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Announcements
create policy "Public can view published announcements"
on public.announcements
for select
to anon, authenticated
using (is_published = true or public.is_admin());

create policy "Admins manage announcements"
on public.announcements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Email campaigns (admin only)
create policy "Admins manage email campaigns"
on public.email_campaigns
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
