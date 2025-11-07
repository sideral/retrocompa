-- Create families table
create table families (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create guests table
create table guests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  family_id uuid references families(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create votes table
create table votes (
  id uuid default gen_random_uuid() primary key,
  voter_id uuid references guests(id) on delete cascade unique,
  costume_vote_1 uuid references guests(id) on delete cascade,
  costume_vote_2 uuid references guests(id) on delete cascade,
  costume_vote_3 uuid references guests(id) on delete cascade,
  karaoke_vote uuid references families(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (optional, adjust as needed)
alter table families enable row level security;
alter table guests enable row level security;
alter table votes enable row level security;

-- Create policies to allow public read access (adjust as needed for your security requirements)
create policy "Allow public read access on families" on families for select using (true);
create policy "Allow public read access on guests" on guests for select using (true);
create policy "Allow public insert on votes" on votes for insert with check (true);
create policy "Allow public read access on votes" on votes for select using (true);

