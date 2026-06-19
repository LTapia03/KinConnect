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
with check (
  public.is_admin()
  or (
    auth.uid() = id
    and role = (
      select p.role
      from public.profiles p
      where p.id = auth.uid()
    )
  )
);

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

-- PostgREST/API grants (RLS still enforces row-level access)
grant usage on schema public to postgres, anon, authenticated, service_role;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.registrations to authenticated;
grant select on table public.schedule_events to anon, authenticated;
grant insert, update, delete on table public.schedule_events to authenticated;
grant select on table public.announcements to anon, authenticated;
grant insert, update, delete on table public.announcements to authenticated;
grant select, insert, update, delete on table public.email_campaigns to authenticated;

grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
