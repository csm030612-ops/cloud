-- ✅ Supabase SQL Editor에 이 전체 내용을 붙여넣고 실행하세요
-- (기존 테이블이 있다면 먼저 DROP 후 재실행하거나, 아래 ALTER 섹션만 실행하세요)

-- ══════════════════════════════════════════
-- 1. profiles 테이블 (닉네임 저장)
-- ══════════════════════════════════════════
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nickname   text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- 누구나 닉네임 조회 가능
create policy "profiles_select_all"
  on profiles for select using (true);

-- 본인 프로필만 생성
create policy "profiles_insert_own"
  on profiles for insert with check (auth.uid() = id);

-- 본인 프로필만 수정
create policy "profiles_update_own"
  on profiles for update using (auth.uid() = id);

-- ══════════════════════════════════════════
-- 2. portfolios 테이블
-- ══════════════════════════════════════════
create table if not exists portfolios (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text not null,
  tech_stack       text[] not null default '{}',
  project_url      text,
  github_url       text,
  thumbnail_emoji  text not null default '🚀',
  user_id          uuid not null references auth.users(id) on delete cascade,
  nickname         text not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- updated_at 자동 갱신 트리거
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger portfolios_updated_at
  before update on portfolios
  for each row execute function update_updated_at();

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

alter table portfolios enable row level security;

create policy "portfolios_select_all"
  on portfolios for select using (true);

create policy "portfolios_insert_own"
  on portfolios for insert with check (auth.uid() = user_id);

create policy "portfolios_delete_own"
  on portfolios for delete using (auth.uid() = user_id);

create policy "portfolios_update_own"
  on portfolios for update using (auth.uid() = user_id);

-- ══════════════════════════════════════════
-- 완료 ✅
-- ══════════════════════════════════════════
select 'Setup complete! profiles + portfolios 테이블이 생성되었어요.' as message;
