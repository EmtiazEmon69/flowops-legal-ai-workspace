# Free Deployment Guide

## Current Best No-Cost Setup

- Frontend: Vercel Hobby, from the GitHub repo
- Alternate frontend: Netlify Free, from the GitHub repo
- Database: Supabase Free
- AI/API cost control: keep mock/local mode until you want paid API calls

## Vercel

1. Open Vercel and import the GitHub repo.
2. Set root directory to `apps/web`.
3. Keep framework as `Next.js`.
4. Deploy.

Vercel will give you a public URL you can open anytime without running a terminal.

## Netlify

The repo includes `netlify.toml`.

Build settings:

```text
Base directory: apps/web
Build command: npm run build
Publish directory: .next
```

## Supabase

1. Create a free Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Later, add Supabase environment variables to Vercel/Netlify:

```text
NEXT_PUBLIC_SUPABASE_URL=<your project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
```

The current app works with browser local storage. Supabase schema is ready for the next step: making the same data available across devices and users.

