# Charan Mobiles — Production Full-Stack Website

This project replaces browser-local storage with a server-side architecture.

## What is fixed

- Secure owner authentication: bcrypt password hash stored only in Turso, never in browser code.
- HttpOnly, SameSite session cookie and server-side session validation.
- Login rate limiting / temporary lockout after repeated failures.
- Owner-only API authorization for every mutation endpoint.
- Password change is owner-authenticated and invalidates old sessions.
- Shared Turso database: products, offers, services, bills, reminders and settings are visible across devices.
- Tigris object storage for uploaded images instead of Base64/localStorage.
- Private reminders are never exposed through public API routes.
- Real PDF E-Bills generated server-side from the supplied E-Bill template.
- Public bill lookup returns a PDF download by phone number or invoice number.
- Optional WhatsApp Business Cloud API integration for server-side reminder delivery.
- Products, offers, services and settings have persistent CRUD APIs.

## Required accounts/configuration

1. Turso database.
2. Tigris bucket and public delivery URL.
3. Optional Meta WhatsApp Business Cloud API for automatic reminders.
4. Bun runtime.

Copy `.env.example` to `.env` and fill every required value. The initial owner password is read from the server environment on first startup and is never shipped to the browser.

## Run

```bash
bun install
cp .env.example .env
# Edit .env with real credentials
bun run dev
```

Open `http://localhost:3000`.

## Production deployment

GitHub Pages cannot run this application because it requires a backend. Push this repository to GitHub, then deploy the Bun service to a Bun-compatible host. Configure all environment variables in the host's secret settings, not in Git.

The frontend is served by the same Hono application, so API cookies remain same-origin and do not need CORS credentials.

## Security notes

Do not commit `.env`. Do not put owner credentials, Turso tokens, Tigris keys, or WhatsApp tokens into frontend files. Use HTTPS in production.
