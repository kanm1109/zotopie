import { readFileSync, writeFileSync } from "fs";

const enrichment = {
  "wix": {
    startingPrice: "Free / $17/mo",
    overview: "Wix is a cloud-based website builder with 900+ templates, AI site generation (Wix ADI), and an integrated app market. It targets small businesses, restaurants, and service providers needing a no-code website. Light plan ($17/mo) removes Wix branding; Core ($29/mo) adds ecommerce; Business ($36/mo) enables full online store with abandoned cart recovery.",
    pros: [
      "Drag-and-drop editor with pixel-perfect control over element positioning on the canvas",
      "900+ professional templates across industries with one-click demo content population",
      "Wix App Market includes 300+ apps for booking, events, forms, and membership management",
      "AI website builder (Wix ADI) generates a starter site from a brief in minutes",
      "Free plan suitable for prototyping and portfolio projects before committing to paid"
    ],
    cons: [
      "Cannot switch templates after launch without rebuilding all page content from scratch",
      "URL structure less clean than WordPress for SEO — subfolder paths and blog routes are limited",
      "Once launched, migrating to a different platform requires complete rebuild"
    ],
    verdict: { summary: "Wix delivers the most design flexibility among no-code builders, making it strong for visual businesses like photographers, restaurants, and service providers. The template lock-in is a real long-term risk — choose the design direction before publishing. WordPress or Squarespace better serve content-heavy or ecommerce-first sites." }
  },
  "bigcommerce": {
    startingPrice: "$29/mo",
    overview: "BigCommerce is a hosted ecommerce platform targeting mid-market and enterprise merchants who need more built-in functionality than Shopify without Magento's development overhead. Native features include multi-currency, faceted search, B2B pricing groups, and headless commerce support. Standard ($29/mo) has no transaction fees; Plus ($79/mo) adds abandoned cart recovery and customer groups.",
    pros: [
      "No transaction fees on any plan — unlike Shopify's 0.5-2% fee on non-Shopify Payments",
      "Headless commerce support connects BigCommerce backend to custom Next.js or Gatsby frontends",
      "B2B features (price lists, purchase orders, net payment terms) included on Enterprise plan",
      "Native multi-currency with local payment method support for international merchants",
      "Open-source Stencil themes provide full front-end customization access without platform restrictions"
    ],
    cons: [
      "Revenue-based plan upgrades force tier change when annual GMV exceeds plan threshold",
      "Fewer app integrations than Shopify — 1,500 vs 8,000+ available apps",
      "Learning curve steeper than Shopify for merchants without prior ecommerce platform experience"
    ],
    verdict: { summary: "BigCommerce is the strongest Shopify alternative when transaction fees or B2B complexity drive the evaluation. The no-fee pricing model and headless commerce support are genuine advantages for mid-market merchants. Shopify's app ecosystem and simpler onboarding make it a better fit for first-time ecommerce builders." }
  },
  "gumroad": {
    startingPrice: "Free (10% fee)",
    overview: "Gumroad is a digital product marketplace and storefront builder for creators selling ebooks, courses, software, and memberships. It requires no monthly subscription — instead charging a 10% transaction fee. Creators get a hosted storefront, checkout, license key delivery, and built-in discovery through Gumroad's marketplace. Premium ($10/mo) reduces the fee to 7%.",
    pros: [
      "Zero monthly cost — only pay 10% when you actually sell, reducing risk for new products",
      "Setup in under 10 minutes — create a product, set a price, share the link immediately",
      "Gumroad Discover marketplace provides organic buyer traffic from platform browsing",
      "Handles EU VAT and US sales tax automatically for digital product sales",
      "License key generation for software products built into checkout without configuration"
    ],
    cons: [
      "10% fee becomes expensive at volume — $10,000 MRR costs $1,000/mo in platform fees",
      "Product page design customization is limited compared to Lemon Squeezy or Payhip",
      "No subscription dunning or advanced payment retry logic for failed recurring payments"
    ],
    verdict: { summary: "Gumroad is the fastest path from idea to first sale for indie creators and developers. The fee model eliminates monthly cost risk before product-market fit is confirmed. At meaningful revenue volume ($3,000+/mo), the 10% fee economics shift in favor of Lemon Squeezy or direct Stripe integration." }
  },
  "getresponse": {
    startingPrice: "$15.58/mo",
    overview: "GetResponse is an email marketing and automation platform with a particular strength in webinar hosting, landing pages, and ecommerce integrations. It combines email campaigns, autoresponders, automation workflows, webinar software, and conversion funnels. Email Marketing plan ($15.58/mo for 1,000 contacts) covers basic campaigns; Marketing Automation ($48.38/mo) adds behavioral triggers and lead scoring.",
    pros: [
      "Built-in webinar hosting on paid plans replaces a separate Zoom or Demio subscription for up to 1,000 attendees",
      "Conversion funnel builder covers opt-in, email nurture, webinar, and sales page in one workflow",
      "Ecommerce integrations with Shopify, WooCommerce, and Magento enable abandoned cart email campaigns",
      "Unlimited autoresponder follow-up sequences on all paid plans",
      "AI email generator speeds up campaign creation from topic brief to draft"
    ],
    cons: [
      "Email Marketing plan lacks behavioral automation — most advanced features require Marketing Automation tier",
      "Deliverability performance inconsistent at high volume compared to ActiveCampaign or Klaviyo",
      "Landing page template library feels dated compared to dedicated builders like Unbounce"
    ],
    verdict: { summary: "GetResponse is the strongest choice when webinar integration is a core part of the lead generation process. The all-in-one funnel builder is genuinely useful for course creators and consultants. Businesses focused purely on email automation get better results from ActiveCampaign at comparable price." }
  },
  "brevo": {
    startingPrice: "Free / $25/mo",
    overview: "Brevo (formerly Sendinblue) is a marketing platform offering email, SMS, WhatsApp, and transactional messaging with volume-based pricing rather than contact-based pricing. Unlike competitors charging by list size, Brevo charges by emails sent per month — making it cost-effective for large lists with low send frequency. Free plan allows unlimited contacts with 300 emails/day; Starter ($25/mo) removes daily limits.",
    pros: [
      "Email volume pricing — a 100K contact list sending once monthly costs far less than Mailchimp",
      "Multi-channel in one platform — email, SMS, WhatsApp, push notifications, and live chat",
      "Transactional email via SMTP/API for developers integrating email into SaaS products",
      "CRM included at no extra cost — tracks contacts, deals, and interaction history",
      "Dedicated IP option on Business plan boosts deliverability for high-volume senders"
    ],
    cons: [
      "Automation workflows less visual and powerful than ActiveCampaign's multi-branch builder",
      "Brevo branding appears on free and Starter plan emails without a paid upgrade",
      "WhatsApp and SMS usage costs are variable — can spike unexpectedly with high send volumes"
    ],
    verdict: { summary: "Brevo's volume-based pricing is its core competitive advantage — businesses with large inactive lists or infrequent send schedules save significantly versus Mailchimp or ConvertKit. Multi-channel capabilities (SMS, WhatsApp) in one platform are valuable for international marketing. Automation depth lags dedicated tools like ActiveCampaign." }
  },
  "clickfunnels": {
    startingPrice: "$97/mo",
    overview: "ClickFunnels is a funnel-building platform designed to convert visitors into leads and customers through sequential landing pages, order forms, and upsell sequences. Its visual funnel builder, proven templates, and affiliate management make it the dominant tool in the online business and course creator market. Basic ($97/mo) supports 20 funnels; Pro ($297/mo) removes limits and adds Backpack affiliate management.",
    pros: [
      "Step-by-step funnel sequences with one-click upsells and order bumps increase average order value",
      "Template library built from converting funnels with documented revenue benchmarks",
      "Built-in email marketing and A/B split testing at the funnel level",
      "Membership site capability built into the platform for course delivery",
      "Active community and FunnelFlix training library support implementation from day one"
    ],
    cons: [
      "$97/mo starting price is high for unproven businesses still finding product-market fit",
      "Page builder and template designs feel visually dated compared to modern alternatives",
      "Basic reporting tracks revenue but lacks attribution depth for multi-channel campaigns"
    ],
    verdict: { summary: "ClickFunnels remains the default platform for coaches, consultants, and info-product creators who need proven funnel templates and built-in order bumps. The high entry price is only justified once the funnel concept is validated with some traffic. Systeme.io or Kartra offer comparable features at lower cost for early-stage creators." }
  },
  "matomo": {
    startingPrice: "Free (self-hosted)",
    overview: "Matomo (formerly Piwik) is an open-source web analytics platform offering a self-hosted alternative to Google Analytics with full data ownership. Teams requiring GDPR compliance without consent banners, privacy-sensitive data handling, or complete raw log access choose Matomo. Self-hosted version is free; Matomo Cloud starts at $23/mo for 50K pageviews/mo.",
    pros: [
      "100% data ownership — raw data stored in your own database with no third-party data processing",
      "GDPR-compliant without a consent banner when using cookieless tracking configuration",
      "Feature parity with Google Analytics including goals, funnels, ecommerce, and custom dimensions",
      "Heatmaps, session recordings, and A/B testing available as optional paid plugins",
      "Import historical Google Analytics data during migration for continuity"
    ],
    cons: [
      "Self-hosted setup requires MySQL and PHP server administration — not suitable for non-technical teams",
      "Cloud version ($23/mo) is less cost-effective than Plausible or Fathom for simple pageview tracking",
      "UI feels dated compared to GA4 and modern analytics dashboards"
    ],
    verdict: { summary: "Matomo is the right choice when data sovereignty is non-negotiable — healthcare, government, or enterprise teams that cannot send visitor data to Google or Cloudflare. The self-hosted option is genuinely powerful and free. For teams that just want simple GDPR-compliant analytics without data ownership concerns, Fathom or Plausible are simpler." }
  },
  "crazy-egg": {
    startingPrice: "$29/mo",
    overview: "Crazy Egg is a web analytics tool focused on visual behavior data — heatmaps, scrollmaps, click confetti, A/B tests, and session recordings. Marketing and UX teams use it to optimize landing pages and product pages by understanding exactly where visitors click and how far they scroll. Basic ($29/mo) tracks up to 30K pageviews/mo; Standard ($49/mo) scales to 75K tracked pageviews.",
    pros: [
      "Snapshots (heatmaps) generate from a JavaScript snippet with no back-end changes — data visible in 30 days",
      "Confetti view segments individual clicks by traffic source, device, or user attribute for deeper analysis",
      "A/B testing built into the platform without subscribing to a separate tool",
      "Session recordings capture full user journeys from arrival to exit",
      "Traffic Analysis shows which pages generate the most scroll depth and engagement"
    ],
    cons: [
      "Pageview limits on lower plans restrict tracking to key pages only — cannot track full site",
      "A/B testing is page-level only — not suitable for multi-page funnel experiments",
      "Data retention is 1 month on Basic — historical comparison requires plan upgrade"
    ],
    verdict: { summary: "Crazy Egg is a solid mid-tier behavioral analytics tool for teams that want heatmaps and A/B testing in one platform at a lower price than Optimizely or VWO. The pageview limits and short data retention on basic plans are the main friction points. Microsoft Clarity is a free alternative for pure heatmap and session recording needs." }
  },
  "microsoft-clarity": {
    startingPrice: "Free",
    overview: "Microsoft Clarity is a free behavioral analytics tool offering session recordings, heatmaps, and frustration signal detection (rage clicks, dead clicks, excessive scrolling). It integrates natively with Google Analytics 4 to combine quantitative and qualitative data in one view. Clarity has no pageview limits, no session recording caps, and no paid tiers — making it the most cost-effective behavioral analytics option available.",
    pros: [
      "Completely free — unlimited sessions, unlimited heatmaps, no paid tier or pageview cap",
      "Native GA4 integration brings behavioral context to traffic data without additional setup",
      "Frustration signals (rage clicks, dead clicks, excessive scrolling) automatically flagged without manual configuration",
      "Copilot AI in Clarity summarizes session patterns in natural language for quick insights",
      "Deploys in 5 minutes via Google Tag Manager with no back-end changes"
    ],
    cons: [
      "No A/B testing or user cohort segmentation — purely observational behavioral data",
      "24-48 hour data processing delay — not suitable for real-time monitoring",
      "Sending behavioral data to Microsoft servers may raise privacy concerns for some organizations"
    ],
    verdict: { summary: "Microsoft Clarity is the obvious first choice for any team that wants behavioral analytics without budget — the free tier is genuinely unlimited and the GA4 integration is seamless. The lack of A/B testing and real-time data mean it pairs with rather than replaces tools like Optimizely or Mixpanel for teams running active experiments." }
  },
  "patreon": {
    startingPrice: "Free (8% platform fee)",
    overview: "Patreon is a membership platform enabling creators — artists, podcasters, writers, and YouTubers — to receive recurring support from fans. Creators set up monthly tiers with perks, and Patreon handles payments, tier management, and payouts. Platform fee is 8% on Pro, 12% on Premium; Lite charges 5% with limited features. Additional 2.9% + $0.30 payment processing applies on all plans.",
    pros: [
      "Built-in creator discovery exposes memberships to Patreon's existing audience of active patrons",
      "Native Discord integration automatically assigns roles based on membership tier without manual management",
      "Merchandise fulfillment partnerships with Printful and Squarespace available for physical rewards",
      "Native iOS and Android apps provide a polished patron experience across devices",
      "Established billing infrastructure handles failed payment recovery automatically"
    ],
    cons: [
      "8-12% platform fee plus 2.9% + $0.30 payment processing creates combined 11-15% total cost",
      "Creator pages are heavily Patreon-branded — white-labeling is not available",
      "Patreon controls the patron relationship — migrating subscribers to another platform risks significant churn"
    ],
    verdict: { summary: "Patreon is the right starting point for creators with an existing audience who want to monetize quickly without platform setup. Discovery is a real advantage for new membership launches. The combined fee rate and platform dependency become meaningful concerns as monthly revenue grows — creators over $5K/mo often evaluate Skool or Circle for better economics and ownership." }
  }
};

let tools = JSON.parse(readFileSync("./src/data/tools.json","utf8"));
let updated = 0;
tools = tools.map(t => {
  if (enrichment[t.slug]) {
    updated++;
    return { ...t, ...enrichment[t.slug] };
  }
  return t;
});
writeFileSync("./src/data/tools.json", JSON.stringify(tools, null, 2) + "\n");
console.log("Updated:", updated, "tools");
