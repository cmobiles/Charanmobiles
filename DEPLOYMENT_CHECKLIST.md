# Deployment Checklist
1. Copy `.env.example` to `.env`.
2. Set real Turso credentials.
3. Set real Tigris credentials and public base URL.
4. Set a strong initial `CHARAN_OWNER_PASSWORD`.
5. Run `bun install`.
6. Run `bun run check`.
7. Run `bun run db:push` if using Drizzle migrations, or allow startup table initialization.
8. Run `bun run dev`.
9. Test `/api/health`.
10. Test owner login, upload, product visibility from another device, bill PDF, and reminder workflow.
