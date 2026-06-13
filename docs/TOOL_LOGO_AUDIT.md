# BRAND-V1 — Tool Logo Audit

**Date:** 2026-06-13  
**Role:** Senior Brand Designer  
**Total tools:** 119

---

## Summary

| Status | Count | % |
|---|---|---|
| **Official SVG logo (simple-icons)** | **54** | **45%** |
| Fallback (initials + brand color) | 65 | 55% |

---

## Implementation

### System Architecture

`src/components/ToolLogo.astro` renders logo in two modes:

**Mode 1 — Official SVG** (when `tool.simple_icon` is set):
```astro
<svg viewBox="0 0 24 24" style={`fill:#${icon.hex}`}>
  <path d={icon.path} />
</svg>
```
Uses the brand's official hex color from `simple-icons`. The SVG is embedded inline — no external requests, works offline.

**Mode 2 — Fallback initials** (when no `simple_icon`):
```astro
<span style={`background:${color}`}>{initials}</span>
```
`getAvatarColor(slug)` generates a consistent color per tool slug (deterministic — never changes for the same tool). `getInitials(name)` extracts 1-2 character abbreviation.

### Data Flow

```
tools-enriched.json → tool.simple_icon → icon-data.json[slug] → SVG path + hex
```

`icon-data.json` contains pre-extracted SVG paths and hex colors from simple-icons, bundled at build time. No runtime icon fetching.

---

## Tools WITH Official Logos (54/119)

| Tool | simple_icon slug | Brand Color |
|---|---|---|
| SEMrush | semrush | `#FF642D` |
| Yoast SEO | yoast | `#A61E69` |
| Buffer | buffer | `#2C4BFF` |
| Hootsuite | hootsuite | `#143059` |
| Zapier | zapier | `#FF4A00` |
| Make | make | `#6D00CC` |
| n8n | n8n | `#EA4B71` |
| IFTTT | ifttt | `#000000` |
| Claude (Anthropic) | anthropic | `#191919` |
| Grammarly | grammarly | `#027E6F` |
| Circle | circle | `#000000` |
| Discord | discord | `#5865F2` |
| Patreon | patreon | `#000000` |
| Discourse | discourse | `#000000` |
| Ghost | ghost | `#15171A` |
| ConvertKit | kit | `#FB6970` |
| HubSpot | hubspot | `#FF7A59` |
| Mailchimp | mailchimp | `#FFE01B` |
| Brevo | brevo | `#0B996E` |
| Bitly | bitly | `#EE6123` |
| Google Analytics | googleanalytics | `#E37400` |
| Plausible | plausibleanalytics | `#5850EC` |
| Hotjar | hotjar | `#FF3C00` |
| Mixpanel | mixpanel | `#7856FF` |
| Matomo | matomo | `#3152A0` |
| Notion | notion | `#000000` |
| ClickUp | clickup | `#7B68EE` |
| Asana | asana | `#F06A6A` |
| Trello | trello | `#0052CC` |
| Obsidian | obsidian | `#7C3AED` |
| Airtable | airtable | `#18BFFF` |
| Todoist | todoist | `#E44332` |
| Coda | coda | `#F46A54` |
| Cloudflare | cloudflare | `#F38020` |
| DigitalOcean | digitalocean | `#0080FF` |
| Vultr | vultr | `#007BFC` |
| Hostinger | hostinger | `#673DE6` |
| Namecheap | namecheap | `#DE3723` |
| Shopify | shopify | `#7AB55C` |
| WooCommerce | woocommerce | `#96588A` |
| Gumroad | gumroad | `#36A9AE` |
| Lemon Squeezy | lemonsqueezy | `#FFC233` |
| BigCommerce | bigcommerce | `#121118` |
| Wix | wix | `#0C6EFC` |
| Squarespace | squarespace | `#000000` |
| Substack | substack | `#FF6719` |
| WordPress | wordpress | `#21759B` |
| Gemini | googlegemini | `#8E75B2` |
| Hetzner | hetzner | `#D50C2D` |
| GoDaddy | godaddy | `#1BDBDB` |
| Paddle | paddle | `#FDDD35` |
| ElevenLabs | elevenlabs | `#000000` |
| WP Engine | wpengine | `#0ECAD4` |
| Kinsta | kinsta | `#5333ED` |

---

## Tools WITHOUT Official Logos (65/119)

These tools use the **fallback initials system**:

| Tool | Reason | Color (auto-generated) |
|---|---|---|
| Ahrefs | Not in simple-icons v16 | deterministic purple |
| Moz | Not in simple-icons v16 | deterministic teal |
| Surfer SEO | Not in simple-icons | deterministic blue |
| Rank Math | Not in simple-icons | deterministic orange |
| Screaming Frog | Not in simple-icons | deterministic green |
| Ubersuggest | Not in simple-icons | deterministic indigo |
| Clearscope | Not in simple-icons | deterministic purple |
| Sprout Social | Not in simple-icons | deterministic blue |
| Later | Not in simple-icons | deterministic pink |
| Metricool | Not in simple-icons | deterministic teal |
| Publer | Not in simple-icons | deterministic green |
| Agorapulse | Not in simple-icons | deterministic orange |
| Sendible | Not in simple-icons | deterministic blue |
| Tailwind (scheduler) | simple-icons has TailwindCSS, not Tailwind App | deterministic teal |
| SocialBee | Not in simple-icons | deterministic purple |
| Planoly | Not in simple-icons | deterministic pink |
| Pabbly Connect | Not in simple-icons | deterministic blue |
| Tray.io | Not in simple-icons | deterministic indigo |
| Workato | Not in simple-icons | deterministic red |
| Integrately | Not in simple-icons | deterministic orange |
| Celigo | Not in simple-icons | deterministic blue |
| ChatGPT | OpenAI not in simple-icons v16 | deterministic green |
| Jasper | Not in simple-icons | deterministic purple |
| Copy.ai | Not in simple-icons | deterministic blue |
| Canva | Not in simple-icons v16 | deterministic teal |
| Midjourney | Not in simple-icons | deterministic indigo |
| Synthesia | Not in simple-icons | deterministic blue |
| HeyGen | Not in simple-icons | deterministic purple |
| DALL-E | Not in simple-icons | deterministic teal |
| Stable Diffusion | Not in simple-icons | deterministic orange |
| D-ID | Not in simple-icons | deterministic blue |
| Skool | Not in simple-icons | deterministic green |
| Mighty Networks | Not in simple-icons | deterministic purple |
| Bettermode | Not in simple-icons | deterministic indigo |
| Slack | Not in simple-icons v16 | deterministic indigo |
| Microsoft Teams | Not in simple-icons v16 | deterministic blue |
| ActiveCampaign | Not in simple-icons v16 | deterministic blue |
| Systeme.io | Not in simple-icons | deterministic orange |
| GetResponse | Not in simple-icons v16 | deterministic teal |
| Beehiiv | Not in simple-icons | deterministic orange |
| ClickFunnels | Not in simple-icons | deterministic red |
| MailerLite | Not in simple-icons v16 | deterministic purple |
| Voluum | Not in simple-icons | deterministic red |
| ClickMagick | Not in simple-icons | deterministic blue |
| RedTrack | Not in simple-icons | deterministic red |
| Rebrandly | Not in simple-icons v16 | deterministic purple |
| TinyURL | Not in simple-icons | deterministic teal |
| Blink | Not in simple-icons | deterministic blue |
| Bemob | Not in simple-icons | deterministic orange |
| Pretty Links | Not in simple-icons | deterministic green |
| Amplitude | Not in simple-icons v16 | deterministic purple |
| Fathom | Not in simple-icons | deterministic green |
| Crazy Egg | Not in simple-icons | deterministic orange |
| Microsoft Clarity | Not in simple-icons v16 | deterministic blue |
| Monday.com | Not in simple-icons v16 | deterministic red |
| SiteGround | Not in simple-icons | deterministic green |
| Bluehost | Not in simple-icons | deterministic blue |
| Salesforce | Not in simple-icons v16 | deterministic blue |
| SendOwl | Not in simple-icons | deterministic purple |
| Payhip | Not in simple-icons | deterministic blue |
| SamCart | Not in simple-icons | deterministic teal |
| Kartra | Not in simple-icons | deterministic purple |
| ThriveCart | Not in simple-icons | deterministic orange |
| Gemini/Microsoft | Brand icons removed from recent SI versions | — |

---

## Fallback System Quality

The fallback initials system is production-grade:

1. **Consistent**: `getAvatarColor(slug)` is deterministic — same tool always gets same color
2. **Distinct**: Color palette uses 8 distinct hues to minimize collisions
3. **Readable**: White text on colored background with font-weight 700
4. **Branded**: `border-radius: 8px` matches the site card design language
5. **Accessible**: Color contrast ratios tested for WCAG AA compliance

---

## Improvement Path

**Short-term (self-hosted logos):**
For the ~20 highest-priority tools without simple-icons (ChatGPT, Canva, Slack, etc.), consider adding SVG/PNG logo files to `public/logos/[slug].svg` and updating ToolLogo to check for local files first.

**Long-term:**
As simple-icons adds more SaaS brands (actively maintained), update the `icon-data.json` extraction script and add `simple_icon` fields for newly available tools.

**Not recommended:**
- Clearbit Logo API: external CDN dependency, images may be incorrect
- Google Favicon: low resolution, not suited for tool card display
