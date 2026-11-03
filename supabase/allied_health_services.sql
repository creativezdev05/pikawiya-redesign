-- Group the visiting and allied health services under Clinical Services.
-- Run this script in the Supabase SQL Editor.

alter table public.services
  add column if not exists subcategory text;

do $$
begin
  if not exists (
    select 1
    from public.service_categories as category
    where lower(btrim(category.category_title)) = lower('Clinical Services')
  ) then
    raise exception 'Could not find the Clinical Services category.';
  end if;
end
$$;

with clinic_health as (
  select id
  from public.service_categories
  where lower(btrim(category_title)) = lower('Clinical Services')
  order by display_order nulls last
  limit 1
), parent_service as (
  select
    service.category_id,
    service.practitioner_name,
    service.practitioner_role,
    service.schedule_location,
    service.eligibility,
    service.contact_info
  from public.services as service
  join clinic_health on clinic_health.id = service.category_id
  where service.title ilike '%allied%health%'
  order by (lower(btrim(service.title)) = lower('Visiting and Allied Health Specialist')) desc,
           service.id
  limit 1
), allied_services (slug, title, short_desc, overview) as (
  values
    ('optometrist', 'Optometrist', 'Eye health assessment and optometry support.', 'Optometry service information and appointment details are coming soon.'),
    ('occupational-therapist', 'Occupational Therapist', 'Support to build skills for everyday activities and independence.', 'Occupational therapy service information and appointment details are coming soon.'),
    ('physiotherapist', 'Physiotherapist', 'Assessment and support for movement, strength and physical function.', 'Physiotherapy service information and appointment details are coming soon.'),
    ('hepatologist', 'Hepatologist', 'Specialist assessment and care for liver health.', 'Hepatology service information and appointment details are coming soon.'),
    ('cardiologist', 'Cardiologist', 'Specialist assessment and care for heart health.', 'Cardiology service information and appointment details are coming soon.'),
    ('endocrinologist', 'Endocrinologist', 'Specialist assessment and care for hormone and endocrine health.', 'Endocrinology service information and appointment details are coming soon.'),
    ('diabetes-educator', 'Diabetes Educator', 'Practical education and support for managing diabetes.', 'Diabetes education service information and appointment details are coming soon.'),
    ('ears-nose-and-throat', 'Ears Nose and Throat', 'Specialist assessment for ear, nose and throat health.', 'Ear, nose and throat service information and appointment details are coming soon.'),
    ('audiologist', 'Audiologist', 'Hearing assessment and audiology support.', 'Audiology service information and appointment details are coming soon.'),
    ('respiratory-nurse', 'Respiratory Nurse', 'Nursing support for respiratory health and care plans.', 'Respiratory nursing service information and appointment details are coming soon.'),
    ('respiratory-and-sleep-physician', 'Respiratory and Sleep Physician', 'Specialist assessment for respiratory and sleep health.', 'Respiratory and sleep physician service information and appointment details are coming soon.'),
    ('podiatrist', 'Podiatrist', 'Assessment and care for foot and lower limb health.', 'Podiatry service information and appointment details are coming soon.'),
    ('dietitian', 'Dietitian', 'Nutrition advice and support tailored to individual health needs.', 'Dietitian service information and appointment details are coming soon.')
)
-- The practitioner_role column is the role/field displayed by the service detail page.
insert into public.services (
  category_id,
  subcategory,
  slug,
  title,
  short_desc,
  overview,
  practitioner_name,
  practitioner_role,
  schedule_location,
  eligibility,
  contact_info
)
select
  clinic_health.id,
  'Visiting and Allied Health Specialist',
  allied_services.slug,
  allied_services.title,
  allied_services.short_desc,
  allied_services.overview,
  parent_service.practitioner_name,
  parent_service.practitioner_role,
  parent_service.schedule_location,
  parent_service.eligibility,
  parent_service.contact_info
from clinic_health
cross join allied_services
left join parent_service on parent_service.category_id = clinic_health.id
on conflict (slug) do update set
  category_id = excluded.category_id,
  subcategory = excluded.subcategory,
  title = excluded.title,
  short_desc = excluded.short_desc,
  overview = excluded.overview,
  practitioner_name = coalesce(excluded.practitioner_name, services.practitioner_name),
  practitioner_role = coalesce(excluded.practitioner_role, services.practitioner_role),
  schedule_location = coalesce(excluded.schedule_location, services.schedule_location),
  eligibility = coalesce(excluded.eligibility, services.eligibility),
  contact_info = coalesce(excluded.contact_info, services.contact_info);
