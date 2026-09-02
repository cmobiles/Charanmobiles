# Deploy Charan Mobiles on Render (Free)

This project is a full-stack Bun + Hono application. Do not use GitHub Pages.

## 1. Upload this entire project to GitHub
Upload all files and folders except `.env` and `node_modules`.

## 2. Create the cloud services
- Turso: create a database and obtain `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
- Tigris: create an S3-compatible bucket, configure public access/CDN for uploaded images, and obtain endpoint, bucket, access key, secret, and public base URL.

## 3. Deploy on Render
1. Create a Render account.
2. New -> Blueprint, then connect the GitHub repository. Render reads `render.yaml`.
3. Enter all values marked `sync: false` as environment variables.
4. Set a strong initial `CHARAN_OWNER_PASSWORD`. It is used only for first database initialization and is never shipped to the browser.
5. Deploy.

## 4. Your public URL
Render assigns a free URL similar to:
`https://charan-mobiles.onrender.com`
No custom domain is required.

## Important free-tier behavior
A free Render web service may spin down after inactivity and can take time to wake up on the next visit.

## First test after deployment
- `/api/health` returns `{ "ok": true }`
- public homepage loads
- owner login works
- add a product and open the site from another device
- upload an image
- generate/download a PDF bill

## Do not upload secrets
Never commit `.env`, Turso tokens, Tigris secrets, or WhatsApp tokens to GitHub.
