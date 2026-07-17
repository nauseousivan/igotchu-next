-- iGotchu — Postgres schema for Supabase
-- Run this in the Supabase SQL editor once, on a fresh project.

create table if not exists uploads (
  id bigint generated always as identity primary key,
  share_code varchar(10) unique,
  title varchar(255),
  subject varchar(100),
  college varchar(10),
  course varchar(100),
  visibility varchar(10) not null default 'public',
  description text,
  uploader varchar(100),
  tags varchar(255),
  file_name varchar(255),
  file_path varchar(255),
  link_url varchar(500),
  file_size integer,
  downloads integer default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists download_log (
  id bigint generated always as identity primary key,
  upload_id bigint not null references uploads(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

create table if not exists feedback (
  id bigint generated always as identity primary key,
  name varchar(100),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_uploads_subject on uploads(subject);
create index if not exists idx_uploads_created on uploads(created_at);
create index if not exists idx_log_date on download_log(downloaded_at);

-- RLS stays disabled: all access goes through server-side API routes using
-- the service-role key, never through a browser-side Supabase client.

-- Atomic download counter (avoids a read-then-write race).
create or replace function increment_downloads(upload_id bigint)
returns void
language sql
as $$
  update uploads set downloads = downloads + 1 where id = upload_id;
$$;
