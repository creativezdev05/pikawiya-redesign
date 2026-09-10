-- Pika Wiya encrypted online form storage
-- Run this migration in the Supabase SQL editor.

create table if not exists public.encrypted_form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (
    form_type in ('membership', 'address', 'feedback', 'complaint')
  ),
  payload_ciphertext text not null,
  lookup_hash text,
  status text not null default 'received',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists encrypted_form_submissions_type_created_idx
  on public.encrypted_form_submissions (form_type, created_at desc);

create unique index if not exists encrypted_form_submissions_membership_lookup_idx
  on public.encrypted_form_submissions (lookup_hash)
  where form_type = 'membership' and lookup_hash is not null;

alter table public.encrypted_form_submissions enable row level security;

-- No browser role receives access. The server route uses the service role key.
revoke all on public.encrypted_form_submissions from anon, authenticated;

create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  access_frequency text not null check (
    access_frequency in (
      'Once a month',
      'Once every 3 months',
      'Once every 6 months',
      'More than 12 months'
    )
  ),
  what_like text not null,
  how_improve text not null,
  what_dislike text not null,
  suggestions text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.complaint_submissions (
  id uuid primary key default gen_random_uuid(),
  complainant_name text not null,
  complainant_address text not null,
  daytime_contact text not null,
  complainant_date date not null,
  email text not null,
  incident_date date,
  incident_time time,
  incident_location text not null,
  complaint_subject text not null,
  complaint_summary text not null,
  witness_name text,
  witness_address text,
  witness_contact text,
  desired_outcome boolean not null,
  outcome_details text,
  signature text not null,
  date_submitted date not null,
  status text not null default 'received' check (
    status in ('received', 'acknowledged', 'investigating', 'resolved', 'closed')
  ),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists feedback_submissions_created_at_idx
  on public.feedback_submissions (created_at desc);

create index if not exists complaint_submissions_created_at_idx
  on public.complaint_submissions (created_at desc);

alter table public.feedback_submissions enable row level security;
alter table public.complaint_submissions enable row level security;

-- Public forms need insert access through the anon client. No public read,
-- update, or delete policy is created here.
drop policy if exists "Public can submit feedback" on public.feedback_submissions;
create policy "Public can submit feedback"
  on public.feedback_submissions
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can submit complaints" on public.complaint_submissions;
create policy "Public can submit complaints"
  on public.complaint_submissions
  for insert
  to anon, authenticated
  with check (true);

-- New feedback and complaint submissions must use the encrypted server route.
drop policy if exists "Public can submit feedback" on public.feedback_submissions;
drop policy if exists "Public can submit complaints" on public.complaint_submissions;
revoke insert on public.feedback_submissions from anon, authenticated;
revoke insert on public.complaint_submissions from anon, authenticated;
