# Cloudflare hosting — preview only

Preview: https://bot-setup-guide.ai-wizards-previews.workers.dev

The public domain is NOT migrated. `botsetupguide.com` uses Porkbun authoritative DNS and is not an active Humanity Labs Cloudflare zone. Before production cutover, obtain authorization/access to move DNS, export the complete registrar DNS zone (including email records), check DNSSEC, onboard that unchanged zone to Humanity Labs Cloudflare, then attach exact apex/www Worker routes or Custom Domains. Do not infer the full zone from public DNS lookups. Keep the domain registration at Porkbun. `oscarhenrycollins.com` is a separate Vercel alias and is not included in this cutover.

## Contents and deployment

Only the unchanged root `index.html` and `humanity-labs-logo.png` enter `cloudflare/dist`. The frontend and old Vercel function/config remain untouched. The Worker serves the home page, explicit index.html and exact /upgrade rewrite; unknown paths remain 404. Apex redirects to www with 307 and preserves the query.

Use Node 22+, `npm --prefix cloudflare ci`, `npm --prefix cloudflare test`, then `npm --prefix cloudflare run deploy`. Supply the approved Humanity Labs token through CLOUDFLARE_API_TOKEN and set CLOUDFLARE_ACCOUNT_ID to the Humanity Labs account in wrangler.json; never commit credentials. Do not use the personal account. Deployments are manual, not GitHub-triggered.

The same-origin Hostinger relay accepts user-supplied credentials transiently, forwards them only to developers.hostinger.com, disables response caching and does not log/persist them. Redirects are handled manually and rejected without forwarding keys elsewhere. Successful/error/array response wrapping matches the existing relay. Missing inputs, malformed JSON and wrong methods are rejected. No company provider key is installed.

## Verification and limits

Unit tests compare legacy and Worker behavior using synthetic upstream responses, including provisioning request shapes. Live preview checks compare asset hashes and routes, reject sensitive file paths, and exercise real Hostinger GET with an intentionally invalid key (401). No server is created/recreated and authenticated provisioning has NOT been tested.

Desktop/mobile UI was checked through cloud/local selection and upgrade navigation. The existing HTML references a logo and app on retired usemyclaw.com; the logo is already broken on Vercel. This pre-existing issue was intentionally not mixed into the hosting change.

## Rollback

Vercel remains live and unchanged. No DNS/registrar modifications or plan changes were made. Source baseline: 8a749492c99bf615f8aa9de7a013336e9f7221bf. Before any future cutover, record exact DNS rows and a record-specific restoration procedure. Do not cancel Vercel until both primary and legacy alias domains have an explicit disposition.
