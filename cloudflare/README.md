# Bot Setup Guide on Cloudflare

Production target: https://www.botsetupguide.com/ in **Miguel Personal** Cloudflare account `89b0e4ee68c1b33f1f5fc3c8db11c9f5`, Worker `bot-setup-guide`. The apex redirects to www. Domain registration stays at Porkbun; assigned nameservers are `janet.ns.cloudflare.com` and `otto.ns.cloudflare.com`. The older Humanity Labs workers.dev deployment is a preview only, not the production target.

## Deployment

Use Node 22+, `npm --prefix cloudflare ci`, `npm --prefix cloudflare test`, then `npm --prefix cloudflare run deploy`. Supply the approved personal-account token through `CLOUDFLARE_API_TOKEN` and set `CLOUDFLARE_ACCOUNT_ID` to the account above. Never commit credentials. GitHub runs tests; Worker deployments are manual.

Only unchanged root `index.html` and `humanity-labs-logo.png` enter `cloudflare/dist`. Root dependencies, frontend, legacy Vercel function and configuration remain untouched. The Worker preserves home, explicit index.html, exact /upgrade rewrite, missing-path 404s, and apex 307 redirects including query strings.

The same-origin Hostinger relay handles caller credentials transiently, forwards only to developers.hostinger.com, disables caching/logging, and rejects redirects without forwarding credentials elsewhere. No operator Hostinger keys are deployed. Arrays, objects and upstream error statuses retain the existing response contract; malformed JSON and invalid destinations are rejected safely.

## DNS cutover and rollback

The complete Porkbun zone was exported before delegation. Four records were copied DNS-only with existing values (A, CNAME and two TXT records); only the four old provider-owned apex NS rows were excluded. There were no MX or registry DNSSEC DS records. Registrar nameservers were changed only after the imported records matched and authoritative Cloudflare queries returned the old Vercel targets.

Hosting cutover requires an active zone, active TLS for apex/www and both exact-host Worker routes verified with failure-open disabled. Then change only the apex and www web records to proxied A `192.0.2.1`; the Worker responds without contacting an origin. Leave TXT records unchanged. **Never remove these Worker routes while placeholder DNS remains.**

To roll back hosting, restore `botsetupguide.com` to DNS-only A `216.150.1.1` and `www.botsetupguide.com` to DNS-only CNAME `bd036b68464acfa9.vercel-dns-016.com`, TTL 600. Keep Vercel project/domains active. To roll back delegation separately, the original registrar NS set is `maceio.ns.porkbun.com`, `salvador.ns.porkbun.com`, `fortaleza.ns.porkbun.com`, `curitiba.ns.porkbun.com`; Porkbun DNS records were retained. Registry and recursive caches can delay either rollback.

## Verification and boundaries

Unit tests compare legacy and Worker behavior with synthetic upstream responses and provisioning inputs. Production checks must verify both domains, asset SHA-256 equality, redirects, /upgrade, missing paths, non-public files and live Hostinger GET using an intentionally invalid key (401). Authenticated server creation/recreation is NOT tested: that would be a separate destructive operation.

Desktop/mobile navigation is tested without entering real credentials or provisioning servers. The unchanged HTML still references the retired usemyclaw.com logo and app; this pre-existing broken dependency is separate from the hosting migration.

`oscarhenrycollins.com` is a separate Vercel alias and is NOT included in this migration. No subscriptions are cancelled or upgraded. Original source baseline: `8a749492c99bf615f8aa9de7a013336e9f7221bf`.
