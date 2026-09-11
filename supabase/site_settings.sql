-- Site settings used by the server (notification inbox, later admin-editable).
-- Run this in the Supabase SQL editor. Public roles cannot read this table.

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.touch_site_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row
  execute function public.touch_site_settings_updated_at();

insert into public.site_settings (key, value)
values ('notification_email', 'admin@pikawiyahealth.org.au')
on conflict (key) do nothing;

alter table public.site_settings enable row level security;

revoke all on public.site_settings from anon, authenticated;
