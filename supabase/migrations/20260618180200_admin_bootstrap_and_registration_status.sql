-- Admin bootstrap, registration status enforcement, and admin delete access

-- Allow controlled role changes via promote_to_admin()
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
as $$
begin
  if old.role is distinct from new.role then
    if current_setting('kinconnect.allow_role_change', true) = 'true' then
      return new;
    end if;

    if not public.is_admin() then
      raise exception 'Only admins can change profile roles';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.promote_to_admin(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users where email = target_email;

  if v_user_id is null then
    raise exception 'User not found: %', target_email;
  end if;

  perform set_config('kinconnect.allow_role_change', 'true', true);

  update public.profiles
  set role = 'admin'
  where id = v_user_id;
end;
$$;

revoke all on function public.promote_to_admin(text) from public;
grant execute on function public.promote_to_admin(text) to postgres, service_role;

-- Registrants may only create drafts; only admins may change status
drop policy if exists "Registrants can insert own registrations" on public.registrations;
drop policy if exists "Registrants can update own registrations" on public.registrations;

create policy "Registrants can insert own registrations"
on public.registrations
for insert
to authenticated
with check (
  public.is_admin()
  or (auth.uid() = user_id and status = 'draft')
);

create policy "Registrants can update own registrations"
on public.registrations
for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (
  public.is_admin()
  or (
    auth.uid() = user_id
    and status = (
      select r.status
      from public.registrations r
      where r.id = registrations.id
    )
  )
);

create policy "Admins can delete registrations"
on public.registrations
for delete
to authenticated
using (public.is_admin());

grant delete on table public.registrations to authenticated;
