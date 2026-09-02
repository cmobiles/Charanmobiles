# Charan Mobiles Website

## Files
- `index.html` - main website
- `style.css` - main styling
- `animation.css` - animations
- `data.js` - application data/settings
- `all.js` - public website logic
- `owner.js` - owner dashboard logic
- `assets/logo.png` - uploaded Charan Mobiles logo
- `assets/payment-qr.jpg` - uploaded UPI QR
- `assets/ebill-template.png` - uploaded E-bill template

## Run
Open `index.html` in a modern browser.

## GitHub Pages
Upload all files while preserving this exact structure. Ensure `index.html` remains in repository root.

## Important production note
This static version is a working frontend prototype. Products/offers/settings are stored in the browser using localStorage, so they do not sync between devices. For secure owner authentication and shared persistent data, replace the localStorage layer with the planned Hono + Turso + Drizzle + Tigris backend.

Do not deploy a production owner password in client-side JavaScript. Move authentication to server-side environment variables and hashed credentials.


## Fix applied
Owner Corner and all admin tabs now use the native HTML `hidden` attribute as a critical fallback. They remain invisible even if the external CSS fails to load. This fixes the public admin-content visibility issue shown in the screenshot.
