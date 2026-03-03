# Deployment Guide for BotSetupGuide v2

## What Changed

Complete rewrite from scratch. **Zero code reused** - built ground-up for normies.

### Key Improvements

1. **Ultra-minimal design** - Cleaner, less overwhelming
2. **Explains everything** - Assumes user doesn't know what an API key is
3. **Two paths** - Cloud (Hostinger auto-setup) or Local (DIY)
4. **Client-agnostic** - Shows Obsidian, Telegram, web UI, and custom app options
5. **Privacy-first** - All API calls from browser, we never see credentials

## Files

```
index.html          - Single-page wizard (pure HTML/CSS/JS)
api/hostinger.js    - Vercel serverless proxy for Hostinger API
vercel.json         - Vercel config
README.md           - Project docs
```

## Deploy to Vercel

```bash
cd /tmp/bot-setup-guide-current
vercel --prod --scope humanity-labs-b649590f
```

Domain: botsetupguide.com (already configured)

## Testing Checklist

- [ ] Local path: generates correct install command
- [ ] Cloud path: Hostinger API key validation
- [ ] Cloud path: Server creation (requires real Hostinger account)
- [ ] Progress bar updates correctly
- [ ] All links work (affiliate link, Anthropic, etc.)
- [ ] Mobile responsive
- [ ] Copy buttons work
- [ ] Final step shows all connection options

## Known TODOs

1. **Tailscale authkey** - Need to add step where user creates one at login.tailscale.com
2. **Hostinger API IDs** - Need real data center IDs and plan IDs from Hostinger docs
3. **Error handling** - Add fallback to manual SSH instructions if API fails
4. **Token extraction** - Final step needs better instructions for getting gateway token

## Revenue

Affiliate link embedded: `https://www.hostinger.com?REFERRALCODE=XLSMIGUELN7E`

Commission: 20-40% on signups

## Privacy Model

- User creates their own Hostinger account
- User generates their own API key
- We proxy API calls but never store keys
- Server is billed to their account
- They have full SSH access

Open source the proxy code so users can verify we don't log.
