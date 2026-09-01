# CHARAN MOBILES

Premium matte-black mobile shop website.

## What is included
- Next.js frontend
- Responsive premium matte black / white / gold design
- Uploaded logo integrated
- Uploaded payment QR integrated
- Uploaded E-Bill template integrated
- WhatsApp enquiry flow
- Google Maps navigation
- Offers popup preview
- Products / side-business sections
- Owner Corner UI
- Supabase database schema
- Secure authentication architecture

## Run locally

1. Install Node.js 20+
2. Open the project folder
3. Run:

```bash
npm install
npm run dev
```

Open the local address shown by Next.js.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Copy `.env.example` to `.env.local`.
4. Add the Supabase URL and anonymous key.
5. Create the owner account in Supabase Auth.

## Security

Do not hardcode the owner password in:
- GitHub
- HTML
- JavaScript
- public environment variables

Use Supabase Auth for the owner login.

## Important deployment note

GitHub is suitable for storing the source code. The Next.js app itself should be deployed to a compatible host after the Supabase environment variables are configured.
