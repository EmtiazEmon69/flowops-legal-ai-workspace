create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  matter text not null default 'General',
  status text not null default 'Active',
  priority text not null default 'Medium',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.matters (
  id uuid primary key default gen_random_uuid(),
  ref text not null,
  client text not null,
  type text not null,
  progress integer not null default 0,
  status text not null default 'New matter',
  due date,
  documents_required integer not null default 0,
  documents_received integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client text not null,
  type text not null,
  size text,
  status text not null default 'Pending',
  extracted text,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text not null,
  channel text not null default 'Email',
  due date,
  status text not null default 'Pending',
  created_at timestamptz not null default now()
);

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  client text not null,
  prompt text,
  output text,
  created_at timestamptz not null default now()
);

create table if not exists public.transcripts (
  id uuid primary key default gen_random_uuid(),
  client text not null,
  source text,
  summary text,
  actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client text not null,
  plan text not null,
  amount numeric not null default 0,
  status text not null default 'Due',
  due date,
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;
alter table public.matters enable row level security;
alter table public.documents enable row level security;
alter table public.reminders enable row level security;
alter table public.drafts enable row level security;
alter table public.transcripts enable row level security;
alter table public.invoices enable row level security;

create policy "Authenticated users can manage clients" on public.clients for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage matters" on public.matters for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage documents" on public.documents for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage reminders" on public.reminders for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage drafts" on public.drafts for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage transcripts" on public.transcripts for all to authenticated using (true) with check (true);
create policy "Authenticated users can manage invoices" on public.invoices for all to authenticated using (true) with check (true);

