create schema if not exists adventskalender;

create table adventskalender.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  join_code text not null unique check (length(join_code) >= 10),
  final_message text,
  final_media_url text,
  created_at timestamptz not null default now()
);

create table adventskalender.players (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references adventskalender.families on delete cascade,
  nickname text not null check (length(trim(nickname)) between 1 and 30),
  created_at timestamptz not null default now(),
  unique (family_id, nickname)
);

create table adventskalender.solves (
  player_id uuid not null references adventskalender.players on delete cascade,
  day smallint not null check (day between 1 and 24),
  solved_at timestamptz not null default now(),
  primary key (player_id, day)
);

create table adventskalender.hints_taken (
  player_id uuid not null references adventskalender.players on delete cascade,
  day smallint not null check (day between 1 and 24),
  level smallint not null check (level between 1 and 3),
  updated_at timestamptz not null default now(),
  primary key (player_id, day)
);

create table adventskalender.board_marks (
  player_id uuid not null references adventskalender.players on delete cascade,
  item text not null,
  crossed boolean not null,
  updated_at timestamptz not null default now(),
  primary key (player_id, item)
);

alter table adventskalender.families enable row level security;
alter table adventskalender.players enable row level security;
alter table adventskalender.solves enable row level security;
alter table adventskalender.hints_taken enable row level security;
alter table adventskalender.board_marks enable row level security;

revoke all on schema adventskalender from anon, authenticated;
revoke all on all tables in schema adventskalender from anon, authenticated;
grant usage on schema adventskalender to service_role;
grant all on all tables in schema adventskalender to service_role;
