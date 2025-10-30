# Expense Tracker (Next.js + Supabase)

A small, complete full‑stack app designed for DevOps pipeline labs. It demonstrates CRUD with a visually modern, animated UI (Tailwind + Framer Motion) and uses Supabase (PostgreSQL) as the database.

- Frontend: Next.js (Pages Router) + Tailwind CSS + Framer Motion + Lucide icons + Chart.js
- Backend: Next.js API routes
- Database: Supabase (PostgreSQL)
- CRUD: Create, Read, Update, Delete expenses
- Ready for local run, Docker build, and deployment (e.g., AKS)

## Screenshots (concept)
- Animated header with gradient and icons
- Rounded, glassy cards and chart section
- Modal form with smooth transitions

## Getting Started

### 1) Prerequisites
- Node.js 18+
- A Supabase project (get URL and keys from Settings ➜ API)

### 2) Create the tables in Supabase
Run this SQL in the Supabase SQL Editor:

```sql
-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Expenses
create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  amount numeric not null,
  category text not null default 'Other',
  spent_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

-- Categories (simple)
create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text unique not null
);

-- Budget (single-row)
create table if not exists public.budgets (
  id integer primary key,
  amount numeric not null default 0,
  period text not null default 'monthly'
);

-- Option A (simple for labs): open policies
alter table public.expenses enable row level security;
create policy "Allow read to anon" on public.expenses for select using (true);
create policy "Allow insert to anon" on public.expenses for insert with check (true);
create policy "Allow update to anon" on public.expenses for update using (true);
create policy "Allow delete to anon" on public.expenses for delete using (true);

alter table public.categories enable row level security;
create policy "Allow all categories" on public.categories for all using (true) with check (true);

alter table public.budgets enable row level security;
create policy "Allow all budgets" on public.budgets for all using (true) with check (true);
```

Note: The server uses `SUPABASE_SERVICE_ROLE_KEY` (which bypasses RLS) via API routes. For labs, this is okay, but never expose service keys to browsers or public repos.

### 3) Configure environment variables
Create `.env.local` in the project root (based on `.env.example`):

```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional if you add client-only supabase usage later
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4) Install and run locally

```
npm install
npm run dev
```

Visit http://localhost:3000.

## Scripts
- `npm run dev` – Run Next.js in development
- `npm run build` – Production build
- `npm run start` – Start production server

## Docker

Build image:
```
docker build -t your-dockerhub-username/expense-tracker:latest .
```

Run container (supply envs):
```
docker run -p 3000:3000 \
  -e SUPABASE_URL=%SUPABASE_URL% \
  -e SUPABASE_SERVICE_ROLE_KEY=%SUPABASE_SERVICE_ROLE_KEY% \
  your-dockerhub-username/expense-tracker:latest
```

Push to Docker Hub:
```
docker login
docker push your-dockerhub-username/expense-tracker:latest
```

## AKS (Azure Kubernetes Service) quick notes
1. Push the Docker image to a registry (Docker Hub/Azure Container Registry).
2. Create a Deployment and Service (LoadBalancer) manifest that injects `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as env vars.
3. Apply manifests:
```
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-service.yaml
```
4. Wait for external IP and browse.

Example container env in Deployment:
```yaml
env:
  - name: SUPABASE_URL
    valueFrom:
      secretKeyRef:
        name: expense-secrets
        key: SUPABASE_URL
  - name: SUPABASE_SERVICE_ROLE_KEY
    valueFrom:
      secretKeyRef:
        name: expense-secrets
        key: SUPABASE_SERVICE_ROLE_KEY
```

## Notes
- This app focuses on simplicity for labs. Not production‑hardened.
- All CRUD goes through API routes; the browser never sees the service role key.
- UI/UX is enhanced with brighter theme, gradients, rounded cards, subtle motion, icons, and charts.
- Extra pages: Reports (charts, export), Categories (CRUD), Settings (monthly budget).
