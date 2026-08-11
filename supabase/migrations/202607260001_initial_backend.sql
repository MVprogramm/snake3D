create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  level_number integer not null check (level_number > 0),
  game_mode text not null default 'classic' check (game_mode in ('classic', 'training')),
  status text not null check (status in ('completed', 'game_over', 'won')),
  finish_reason text,
  score integer not null default 0,
  max_score integer not null default 0,
  apple_time_overrun_avg numeric(8, 3),
  apple_time_overrun_count integer not null default 0,
  protocol jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists game_sessions_user_created_idx
  on public.game_sessions(user_id, created_at desc);

create index if not exists game_sessions_level_idx
  on public.game_sessions(level_number);

alter table public.profiles enable row level security;
alter table public.game_sessions enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "game_sessions_select_own"
  on public.game_sessions for select
  using (auth.uid() = user_id);

create policy "game_sessions_insert_own"
  on public.game_sessions for insert
  with check (auth.uid() = user_id);

create policy "game_sessions_update_own"
  on public.game_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
