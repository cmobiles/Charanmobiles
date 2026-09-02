# Final QA scope
This package was re-audited for project structure, referenced public assets, frontend JavaScript syntax, API route consistency, owner authentication design, cloud persistence architecture, upload validation, and reminder QR delivery behavior.

## Important deployment truth
No ZIP can prove runtime success against credentials that are not present in the ZIP. Before going live, run `npm install`, `npm run check`, `npm run verify`, configure `.env`, then test against real Turso/Tigris credentials. WhatsApp delivery additionally requires Meta approval and valid credentials.

## Security
The owner password is not embedded in public files. It is hashed server-side on first setup. Owner API routes require an HttpOnly session cookie.
