-- Per-form-type email/SMTP configuration.
-- Documents the schema you already created in Supabase so it's versioned
-- alongside the rest of the schema. Safe to re-run: uses IF NOT EXISTS /
-- OR REPLACE everywhere, so it won't touch existing rows.
--
-- form_types.code must match the FormType string used by the app
-- ("membership" | "address" | "feedback" | "complaint" | "enquiry").
--
-- form_emails is lenient by design: form_type_id is not unique on its own,
-- so a form type can later have more than one row (e.g. multiple notification
-- recipients, or a history of past configs). The partial unique index below
-- only guarantees at most one ACTIVE row per form type today.

create table if not exists public.form_types (
  id serial primary key,
  code character varying not null unique,
  name character varying not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.form_emails (
  id serial primary key,
  form_type_id integer not null references public.form_types(id) on delete cascade,
  smtp_host character varying not null,
  smtp_port integer not null default 587,
  smtp_user character varying not null,
  smtp_pass character varying not null,
  notification_email character varying not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists form_emails_form_type_id_idx
  on public.form_emails (form_type_id);

-- At most one active email config per form type. Drop this if a future
-- requirement needs several simultaneously-active recipients per type.
create unique index if not exists form_emails_one_active_per_type_idx
  on public.form_emails (form_type_id)
  where is_active;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists form_types_touch_updated_at on public.form_types;
create trigger form_types_touch_updated_at
  before update on public.form_types
  for each row
  execute function public.touch_updated_at();

drop trigger if exists form_emails_touch_updated_at on public.form_emails;
create trigger form_emails_touch_updated_at
  before update on public.form_emails
  for each row
  execute function public.touch_updated_at();

-- form_emails holds SMTP passwords (same sensitivity as SMTP_PASS in
-- .env.local). Lock both tables down like site_settings: only the server's
-- service-role client (getAdminClient) may read them; no browser role gets
-- any access, and the admin dashboard must go through its own service-role
-- backend, never a client-side Supabase call.
alter table public.form_types enable row level security;
alter table public.form_emails enable row level security;

revoke all on public.form_types from anon, authenticated;
revoke all on public.form_emails from anon, authenticated;
