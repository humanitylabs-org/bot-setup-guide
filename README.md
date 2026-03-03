# Bot Setup Guide v2

Ultra-minimal setup wizard for normies to get an OpenClaw AI assistant running in 10 minutes.

## Features

- **Two paths:** Cloud (Hostinger VPS) or Local (own computer)
- **Completely client-side:** All config generation happens in browser
- **Privacy-first:** API keys never leave the browser except to make authenticated calls
- **Normie-friendly:** Explains every technical term, hand-holds through each step
- **Client-agnostic:** Shows Obsidian plugin, Telegram bot, web UI, and custom app options

## Architecture

- `index.html` - Single-page wizard (pure HTML/CSS/JS, no build step)
- `api/hostinger.js` - Vercel serverless function to proxy Hostinger API (avoids CORS)

## Deploy

```bash
cd /tmp/bot-setup-guide-v2
vercel --prod
```

Domain: botsetupguide.com

## Hostinger API Integration

The wizard uses Hostinger's API to provision VPS automatically:

1. User creates Hostinger account
2. User generates API token in Hostinger dashboard
3. User pastes token into wizard (stays in browser)
4. Wizard calls `/api/hostinger` proxy with user's token
5. Proxy forwards to `api.hostinger.com` with auth
6. Server is created with post_install_script that installs OpenClaw + Tailscale

## Privacy Model

- All API calls from browser use user's own credentials
- We never store or log API keys
- Server is billed to user's Hostinger account
- User has full SSH access to their server
- Open source proxy code (user can verify we don't log)

## Revenue

- Hostinger affiliate link: 20-40% commission
- Affiliate code: XLSMIGUELN7E
- Link: https://www.hostinger.com?REFERRALCODE=XLSMIGUELN7E

## TODO

- [ ] Test Hostinger API endpoints (VPS creation, polling)
- [ ] Add proper data center IDs / plan IDs from Hostinger API
- [ ] Add Tailscale authkey generation instructions
- [ ] Test full flow end-to-end
- [ ] Add error handling for API failures
- [ ] Add "skip cloud setup" option if API fails
- [ ] Add manual SSH instructions as fallback
