-- Von Rosenberg reunion platform: core schema

create extension if not exists "pgcrypto";

create type public.user_role as enum ('registrant', 'admin');
create type public.branch as enum (
  'branch_1',
  'branch_2',
  'branch_3',
  'branch_4',
  'branch_5',
  'branch_7',
  'branch_8',
  'unknown'
);
create type public.registration_status as enum ('draft', 'submitted');
create type public.night as enum ('thursday', 'friday', 'saturday', 'sunday');
create type public.volunteer_interest as enum (
  'setup',
  'cleanup',
  'registration_desk',
  'meals',
  'activities',
  'photography',
  'other'
);
create type public.email_campaign_status as enum ('draft', 'sent');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'registrant',
  first_name text not null,
  last_name text not null,
  phone text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.registration_status not null default 'draft',
  contact_first_name text not null,
  contact_last_name text not null,
  contact_email text not null,
  contact_phone text not null,
  street_address text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  adults_count integer not null check (adults_count >= 0),
  children_count integer not null check (children_count >= 0),
  day_only_visitors_count integer not null check (day_only_visitors_count >= 0),
  nights_staying public.night[] not null default '{}',
  nights_other text,
  room_preference text not null,
  arrival_notes text,
  member_name_1 text not null,
  member_name_2 text,
  member_name_3 text,
  member_name_4 text,
  member_name_5 text,
  member_name_6 text,
  dietary_notes text,
  friday_dinner_count integer not null check (friday_dinner_count between 0 and 6),
  saturday_breakfast_count integer not null check (saturday_breakfast_count between 0 and 6),
  saturday_lunch_count integer not null check (saturday_lunch_count between 0 and 6),
  saturday_dinner_count integer not null check (saturday_dinner_count between 0 and 6),
  sunday_breakfast_count integer not null check (sunday_breakfast_count between 0 and 6),
  branch public.branch not null,
  looking_forward text,
  volunteer_interests public.volunteer_interest[] not null default '{}',
  volunteer_other text,
  suggestions text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint registrations_nights_present check (
    cardinality(nights_staying) > 0 or nights_other is not null
  )
);

create table public.schedule_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text not null,
  is_published boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint schedule_events_valid_range check (ends_at >= starts_at)
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body text not null,
  status public.email_campaign_status not null default 'draft',
  sent_at timestamptz,
  sent_by uuid references public.profiles (id) on delete set null,
  recipient_count integer check (recipient_count is null or recipient_count >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index idx_registrations_user_id on public.registrations (user_id);
create index idx_registrations_branch on public.registrations (branch);
create index idx_registrations_status on public.registrations (status);
create index idx_schedule_events_published on public.schedule_events (is_published, sort_order);
create index idx_announcements_published on public.announcements (is_published, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger registrations_set_updated_at
before update on public.registrations
for each row execute function public.set_updated_at();

create trigger schedule_events_set_updated_at
before update on public.schedule_events
for each row execute function public.set_updated_at();

create trigger announcements_set_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

create trigger email_campaigns_set_updated_at
before update on public.email_campaigns
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
