import { readFileSync, writeFileSync } from "fs";

const enrichment = {
  "namecheap": {
    startingPrice: "$7.98/yr (.com)",
    overview: "Namecheap is a domain registrar and web hosting provider known for low domain prices and transparent renewal rates. It offers domain registration for 400+ TLDs, EasyWP managed WordPress hosting, private email, and SSL certificates. Popular primarily as a registrar — many users register domains at Namecheap while hosting elsewhere. .com domains from $7.98/yr; EasyWP WordPress hosting from $1.44/mo.",
    pros: [
      "Domain renewal prices are among the lowest and most transparent — no hidden renewal fee inflation",
      "Free WhoisGuard privacy protection included on most domain registrations",
      "EasyWP provides managed WordPress hosting at a lower price point than Kinsta or WP Engine",
      "Intuitive domain management dashboard for managing multiple domains across a portfolio",
      "Free PositiveSSL certificate included with hosting plans"
    ],
    cons: [
      "Shared hosting performance is below average compared to SiteGround or Hostinger for WordPress sites",
      "Primary support is chat and ticket-based — no phone support option",
      "Advanced hosting features (staging, daily backups) require paid add-ons rather than base plan inclusion"
    ],
    verdict: { summary: "Namecheap is the go-to domain registrar for transparent pricing and free privacy protection — its registrar strengths clearly outpace its hosting quality. Most users benefit from registering domains at Namecheap and hosting elsewhere with a dedicated provider like SiteGround or Kinsta." }
  },
  "bitly": {
    startingPrice: "Free / $8/mo",
    overview: "Bitly is a link management platform that shortens URLs, adds custom branded domains, and tracks click analytics. Marketing teams and social media managers use it to create clean links, measure campaign performance, and manage links by campaign or group. Free plan allows 10 short links/mo; Core ($8/mo) enables a custom domain and 200 links/mo; Growth ($29/mo) scales to 1,500 links with QR codes.",
    pros: [
      "Custom branded domain (yourco.link/slug) increases click-through rates versus generic bit.ly shortlinks",
      "QR code generation tied to each short link serves print and offline campaign tracking",
      "Click analytics by location, device, and referrer source built into the dashboard",
      "API access for bulk link creation and analytics retrieval for development integrations",
      "Bulk link shortening via CSV import for large campaign rollouts"
    ],
    cons: [
      "Free plan cap of 10 links per month is impractical for any active marketing program",
      "Custom branded domain requires the $8/mo Core plan — not available on free tier",
      "Advanced analytics and link expiration controls limited to Growth and higher plans"
    ],
    verdict: { summary: "Bitly is the most recognized link management platform for good reason — branded domains, QR codes, and click analytics in one clean interface. The free plan is too limited for real use; budget at minimum for Core at $8/mo. Performance marketers needing conversion tracking should evaluate ClickMagick or Voluum instead." }
  },
  "voluum": {
    startingPrice: "$69/mo",
    overview: "Voluum is a performance marketing tracking platform built for affiliate marketers, media buyers, and performance agencies managing paid advertising campaigns across multiple traffic sources. It tracks clicks, conversions, and revenue with real-time attribution and ROI reporting. Starter ($69/mo) handles 3M events/mo; Pro ($149/mo) extends to 10M events for high-volume campaigns.",
    pros: [
      "Real-time click and conversion tracking with sub-second latency for high-volume campaign monitoring",
      "Traffic distribution automation enables A/B and multivariate testing across offers, landers, and paths",
      "Anti-fraud detection filters bot and invalid traffic from campaign performance data",
      "70+ traffic source integrations via S2S postback including Facebook, Google, TikTok, and Taboola",
      "Custom conversion funnels track multi-step journeys from ad click to purchase completion"
    ],
    cons: [
      "$69/mo minimum is high for individual affiliates starting paid traffic campaigns",
      "Steep learning curve — requires understanding S2S tracking, postback URLs, and campaign architecture",
      "Event limits on lower plans require upgrade as campaign volume scales beyond 3M monthly events"
    ],
    verdict: { summary: "Voluum is the most feature-complete tracking platform for professional affiliate marketers and media buyers running multi-source paid campaigns. The $69/mo entry point requires active campaign volume to justify. Smaller affiliates get better value starting with ClickMagick or RedTrack before scaling to Voluum." }
  },
  "clickmagick": {
    startingPrice: "$37/mo",
    overview: "ClickMagick is a link tracking and conversion attribution platform for affiliate marketers, digital advertisers, and funnel builders. It tracks every click through a funnel, applies attribution rules, and syncs conversion data back to ad platforms via server-side tracking. Starter ($37/mo) tracks 10K clicks/mo; Standard ($77/mo) scales to 100K clicks; Pro ($197/mo) serves agencies.",
    pros: [
      "Server-side tracking syncs clean conversion data to Facebook and Google Ads, bypassing browser privacy restrictions",
      "Click fraud detection filters invalid traffic before it inflates ad platform costs",
      "Full-funnel tracking from ad click through purchase across multiple pages and steps",
      "TrueTrack technology provides accurate conversion attribution for iOS 14+ privacy-limited campaigns",
      "Postback URL system integrates with any affiliate network for commission tracking"
    ],
    cons: [
      "10K click limit on Starter plan is restrictive for active paid traffic campaigns",
      "Learning curve for server-side tracking setup requires technical comfort with pixels and postbacks",
      "Pro plan ($197/mo) is expensive for individual affiliates running lower volume campaigns"
    ],
    verdict: { summary: "ClickMagick is the strongest tool for funnel builders and affiliate marketers who need server-side conversion tracking to maintain Facebook and Google Ads performance post-iOS 14. The TrueTrack technology is a real differentiator. Media buyers running multi-source traffic at scale should evaluate Voluum for its broader integration set." }
  },
  "redtrack": {
    startingPrice: "$49/mo",
    overview: "RedTrack is a performance marketing analytics platform for affiliate marketers and media buyers tracking campaigns across multiple traffic sources and affiliate networks. It provides real-time reporting, automated campaign rules, and S2S conversion tracking. Solo plan ($49/mo) supports 1 domain and 3M events/mo; Team ($99/mo) adds collaboration features and multiple domains.",
    pros: [
      "Automated rules stop campaigns or adjust bids based on performance thresholds without manual monitoring",
      "Multi-touch attribution models (first click, last click, linear) assign revenue credit accurately",
      "Publisher cost data pulled directly from traffic source APIs eliminates manual spend entry",
      "Custom conversion events track any on-site action as a campaign goal",
      "White-label reporting for agencies managing client campaign performance"
    ],
    cons: [
      "S2S tracking setup is technical — requires understanding of postback URLs and pixel placement",
      "Limited ad platform integrations compared to Voluum's 70+ traffic source connections",
      "Solo plan single domain limit requires upgrade for multi-brand or multi-client operations"
    ],
    verdict: { summary: "RedTrack's automated campaign rules and white-label reporting make it a strong choice for performance agencies managing client campaigns. The automation layer that stops unprofitable campaigns is its clearest differentiator. Individual affiliates doing lower volume get better value from ClickMagick's server-side tracking capabilities." }
  },
  "rebrandly": {
    startingPrice: "Free / $13/mo",
    overview: "Rebrandly is a branded link management platform focused on custom short URLs for brand awareness and marketing campaigns. Marketing teams use it to create memorable branded links (brand.io/campaign) for email, social, and print. Free plan allows 5 custom domains and 25 links/mo; Starter ($13/mo) enables 25K tracked clicks/mo and up to 1,500 managed links.",
    pros: [
      "Multiple custom branded domains manageable in one account — useful for agencies with multiple brands",
      "UTM builder integrated into the link creation workflow for consistent campaign parameter tracking",
      "Team collaboration with link ownership, editing permissions, and shared link libraries",
      "REST API enables programmatic link creation and analytics retrieval for development teams",
      "QR code generation included for each branded link for offline campaign use"
    ],
    cons: [
      "Free plan link and monthly click limits are very restrictive for active marketing programs",
      "Analytics depth is less than performance trackers like Voluum or ClickMagick",
      "No A/B testing or link rotation features for traffic distribution experiments"
    ],
    verdict: { summary: "Rebrandly is the right choice when branded link aesthetics and multi-domain management are priorities over deep conversion tracking. Its agency-friendly multiple domain support and API access make it useful for teams managing brand consistency across campaigns. Performance marketers needing conversion attribution should look at ClickMagick." }
  },
  "tinyurl": {
    startingPrice: "Free / $9.99/mo",
    overview: "TinyURL is one of the original URL shortening services, providing simple link shortening without registration for free. It supports custom aliases (tinyurl.com/your-alias) and a developer API. Pro plan ($9.99/mo) adds branded custom domains, advanced analytics, and a link management dashboard for teams needing more than occasional link shortening.",
    pros: [
      "Free basic shortening without account registration — fastest option for one-off link sharing",
      "Custom alias creation (tinyurl.com/your-term) available without a paid plan",
      "Simple API for developers integrating link shortening into applications",
      "20+ year operating history with reliable uptime and no link expiration",
      "No expiration on created links — long-lived use cases remain stable"
    ],
    cons: [
      "No branded custom domain on free plan — links remain under tinyurl.com",
      "Analytics (click counts, geographic data) require Pro plan at $9.99/mo",
      "Pro plan offers less value than Bitly or Rebrandly at comparable pricing"
    ],
    verdict: { summary: "TinyURL is best suited for occasional, simple link shortening where brand consistency and analytics are not requirements. The free custom alias feature is genuinely useful for one-off use cases. Marketing teams building campaigns should use Bitly or Rebrandly for branded domains and click analytics." }
  },
  "blink": {
    startingPrice: "$12/mo",
    overview: "Blink is a branded link shortening and management tool for marketers managing branded short links at scale. It supports multiple custom domains, link rotation for A/B testing, and team collaboration. Pro plan ($12/mo) covers 1 custom domain and 10K tracked clicks/mo; Team ($32/mo) adds multiple domains and higher click limits for marketing teams.",
    pros: [
      "Link rotation feature sends visitors to different destination URLs for A/B testing without changing the short link",
      "Multiple custom branded domains manageable in one account for multi-brand teams",
      "Team collaboration with shared link libraries and permission management",
      "QR code generation included for each link for print and offline campaign use",
      "Clean analytics dashboard with click breakdown by device and geographic location"
    ],
    cons: [
      "Smaller brand presence and track record than Bitly or Rebrandly for enterprise trust",
      "Click limits on lower plans require upgrade for high-traffic campaign links",
      "Integration ecosystem less developed than established competitors"
    ],
    verdict: { summary: "Blink's link rotation feature for A/B testing is its strongest differentiator over Bitly or Rebrandly. Teams that actively split-test different landing pages from a single campaign link get real value. For straightforward branded link management without A/B testing, Bitly or Rebrandly offer more established track records." }
  },
  "bemob": {
    startingPrice: "$25/mo",
    overview: "Bemob is a cloud-based tracking platform for affiliate marketers monitoring campaign performance across multiple traffic sources and affiliate networks. It provides real-time S2S tracking, automated optimization rules, and performance dashboards for paid advertising campaigns. Basic ($25/mo) covers 1M events/mo; Professional ($75/mo) scales to 10M events for higher-volume campaigns.",
    pros: [
      "Competitive pricing relative to event volume — lower cost per event than Voluum at comparable features",
      "Real-time reporting with automatic data refresh for active campaign monitoring",
      "Traffic distribution rules automate offer and landing page rotation based on performance data",
      "Postback URL system integrates with all major affiliate networks for conversion tracking",
      "Automated bot filtering identifies and excludes non-human traffic from campaign reports"
    ],
    cons: [
      "Documentation less comprehensive than more established tracking platforms",
      "40+ traffic source integrations compared to Voluum's 70+ for broader campaign coverage",
      "Community and support resources limited compared to competitors with larger user bases"
    ],
    verdict: { summary: "Bemob is a cost-effective entry point into performance tracking for affiliate marketers who find Voluum's $69/mo too expensive for their current campaign volume. Real-time tracking and automation rules cover the essentials. Teams with large event volumes or needing broad traffic source integrations should evaluate Voluum or RedTrack." }
  },
  "pretty-links": {
    startingPrice: "$99/yr",
    overview: "Pretty Links is a WordPress plugin for link shortening, link management, and affiliate link cloaking within WordPress sites. Bloggers and affiliate marketers use it to create clean branded links (yoursite.com/go/product) that redirect to affiliate URLs, track clicks, and manage links from the WordPress dashboard. Beginner plan ($99/yr) covers 1 site with link cloaking and basic click tracking.",
    pros: [
      "Works inside the WordPress dashboard — no external platform required for WordPress-native workflows",
      "Affiliate link cloaking protects commission links from being stripped or bypassed by browsers",
      "Click tracking per link identifies which affiliate links generate the most revenue",
      "Automatic keyword linking creates affiliate links from specified keywords throughout content",
      "Product Displays feature adds affiliate product boxes with images and buy buttons to posts"
    ],
    cons: [
      "WordPress-only — not suitable for non-WordPress sites or headless setups",
      "Annual fee ($99/yr) is high relative to SaaS link management tools at comparable pricing",
      "Link redirect speed depends on server response time rather than dedicated redirect infrastructure"
    ],
    verdict: { summary: "Pretty Links is the right choice for WordPress bloggers who want affiliate link cloaking and click tracking without leaving the WordPress dashboard. The automatic keyword linking is a genuine time-saver for content-heavy affiliate sites. Non-WordPress publishers and teams needing cloud-based analytics should use Bitly or Rebrandly instead." }
  },
  "sendowl": {
    startingPrice: "$18/mo",
    overview: "SendOwl is a digital product delivery and checkout platform for selling ebooks, software, courses, and memberships. It automates PDF stamping, license key delivery, drip content release, and affiliate management after purchase. Starter ($18/mo) supports unlimited products; Growth ($37/mo) adds subscription billing and higher bandwidth limits for larger file downloads.",
    pros: [
      "Automatic PDF stamping with buyer name deters unauthorized sharing of digital files",
      "License key generation and delivery for software products built into the checkout flow",
      "Drip content unlocks course modules or files on a defined schedule after purchase",
      "Affiliate management integrated without requiring third-party affiliate software",
      "Integrates with Stripe, PayPal, and most email marketing platforms"
    ],
    cons: [
      "$18/mo for unlimited products is higher than Gumroad's free tier for low-volume sellers",
      "No built-in marketplace — relies entirely on seller-generated traffic without discovery features",
      "EU VAT handling is seller responsibility — not a merchant-of-record like Lemon Squeezy"
    ],
    verdict: { summary: "SendOwl is a strong operational platform for digital product sellers who need PDF stamping, license keys, and drip delivery in one place. The affiliate integration adds significant value for creators with referral programs. Sellers who need EU VAT automation should evaluate Lemon Squeezy as a merchant-of-record alternative." }
  },
  "payhip": {
    startingPrice: "Free (5% fee)",
    overview: "Payhip is a digital product store builder for selling ebooks, courses, software, and coaching sessions. Like Gumroad, it uses a transaction-fee model — free plan charges 5%; Plus ($29/mo) reduces to 2%; Pro ($99/mo) eliminates fees entirely. It handles EU VAT automatically as a merchant of record and provides a hosted storefront with basic customization options.",
    pros: [
      "Free plan with 5% fee validates product ideas before committing to monthly subscription costs",
      "EU VAT handled automatically as merchant of record — no manual tax compliance required",
      "Supports digital downloads, courses, coaching, memberships, and physical products in one platform",
      "Affiliate program included on all plans including the free tier",
      "Custom domain support on all plans including free — brand-consistent checkout experience"
    ],
    cons: [
      "5% fee on free plan becomes expensive at volume — $5,000 monthly revenue costs $250/mo in fees",
      "Storefront design customization is minimal compared to dedicated store builders",
      "Course builder is basic — less functional than Teachable or dedicated LMS platforms"
    ],
    verdict: { summary: "Payhip is the most complete free starting point for digital product sellers who need EU VAT handling without a merchant account. The free tier's custom domain support is a genuine advantage over Gumroad. Volume sellers should upgrade to Pro ($99/mo) to eliminate fees once monthly revenue exceeds $2,000." }
  },
  "samcart": {
    startingPrice: "$79/mo",
    overview: "SamCart is a checkout optimization platform focused on one-page checkout, order bumps, upsells, and subscription billing for digital products and courses. Built around increasing average order value through post-purchase sequences and A/B testing checkout pages. Launch ($79/mo) includes one-page checkout and order bumps; Grow ($159/mo) adds A/B testing and advanced analytics.",
    pros: [
      "One-page checkout design reduces cart abandonment compared to multi-step checkout flows",
      "Order bumps and one-click upsells increase average order value without additional traffic acquisition",
      "A/B testing for checkout pages identifies the highest-converting layout and copy variations",
      "Subscription billing with dunning logic handles failed payments and automatic retry sequences",
      "Cart abandonment email sequences recover lost sales from incomplete checkouts"
    ],
    cons: [
      "$79/mo is expensive for early-stage creators without consistent monthly sales volume",
      "No built-in digital file hosting — file delivery requires integration with third-party storage",
      "Monthly subscription cost is higher than ThriveCart's one-time purchase model for lifetime value"
    ],
    verdict: { summary: "SamCart is justified for established digital product and course businesses where checkout optimization directly increases revenue — order bumps and one-click upsells pay for themselves at meaningful sales volume. Early-stage creators without consistent traffic get more value starting with Gumroad or Payhip until conversion optimization becomes the limiting factor." }
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
