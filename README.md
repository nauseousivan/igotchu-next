<p align="center">
  <img src="public/ig2.png" alt="iGotchu" width="360" />
</p>

<p align="center">
  <b>Share reviewers in seconds.</b><br>
  From your seniors, for you. No account needed.
</p>

---

iGotchu is a little file-sharing hub built for MCNP and ISAP students to pass down reviewers, notes, and cheat sheets without the group-chat chaos. Drop a file (or a Google Drive link), get a 6-character code, send it to the freshies. That's it. ⚡

## What it does

- **Upload** a file (PDF, DOCX, PPTX, JPG, PNG, ZIP — up to 50MB) or paste a link instead
- **Get a code** like `A9K2XQ` — share the code or the link, whichever's easier
- **Hub** page lists everything public, searchable and filterable by school/course, with a "Trending this week" strip
- **Public or Private** — private uploads are unlisted, code-only
- **Expiration** — 1 day, 7 days, or never; expired files clean themselves up
- **Admin dashboard** — stats, feedback inbox, and a delete button for when someone shares something they shouldn't 🐱
- A coffee button with an X that really doesn't want to be caught

## Stack

Started life as plain PHP + MySQL, rewritten to actually deploy for free:

- [Next.js](https://nextjs.org) (App Router) — pages, API routes, server actions
- [Supabase](https://supabase.com) — Postgres for data, Storage for files
- [Vercel](https://vercel.com) — hosting + cron for expired-file cleanup
- Plain CSS (no component library) — the neobrutalist "squish" look is hand-rolled

## Running it locally

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase project's URL + service_role key
npm run dev
```

You'll also need to:
1. Run `supabase/schema.sql` in your Supabase project's SQL editor.
2. Create a public Storage bucket named `upload`.
3. Generate an admin password: `node scripts/gen-admin-secrets.js "your-password"` → paste the output into `.env.local`.

## Deploying

Push to Vercel, set the same env vars from `.env.local.example` in the project settings, done. `vercel.json` already wires up the daily cleanup cron.

---

<p align="center">made by your ates &amp; kuyas — iGotchu</p>
