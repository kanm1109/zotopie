import { readFileSync, writeFileSync } from "fs";

const enrichment = {
  "discord": {
    startingPrice: "Free / $9.99/mo",
    overview: "Discord is a communication platform originally built for gaming communities that expanded into a general-purpose hub for creators, developers, and brands. It combines text channels, voice rooms, video chat, threads, forums, and stage events in one free workspace. Communities scale from small private servers to public hubs with millions of members. Nitro ($9.99/mo) adds enhanced uploads, custom emojis, and server boosts for supporters.",
    pros: [
      "Free for unlimited members and channels with no seat-based pricing",
      "Voice, text, video, and threads unified in one server without separate tools",
      "Bots and custom integrations via Discord API enable moderation, ticketing, and automation",
      "Stage events support live audio broadcasts with speaker/audience separation",
      "Rich media embeds with link previews, image galleries, and file sharing"
    ],
    cons: [
      "Moderation requires significant bot setup (MEE6, Carl-bot) to manage large communities",
      "No native course or paid content-access control — requires third-party integrations",
      "Member management lacks CRM-style tracking of member activity or purchase history"
    ],
    verdict: { summary: "Discord is the default platform for building engaged communities around games, dev tools, and creator brands. Its free tier is genuinely powerful, but serious community management requires significant bot configuration. Not a replacement for platforms like Circle or Skool that need native content monetization." }
  },
  "slack": {
    startingPrice: "Free / $7.25/user/mo",
    overview: "Slack is a team messaging platform that organizes conversations into channels by topic, project, or team. Direct messages, file sharing, huddles, and 2,600+ integrations make it the default communication layer for remote and hybrid teams. The free plan retains 90 days of message history; Pro ($7.25/user/mo) unlocks unlimited history and integrations; Business+ ($12.50/user/mo) adds SSO and compliance exports.",
    pros: [
      "Channel-based organization keeps conversations separated by project, team, or topic",
      "2,600+ integrations including GitHub, Jira, Salesforce, and PagerDuty",
      "Huddles (quick audio with optional screen share) replace ad-hoc Zoom calls for short discussions",
      "Workflow Builder automates routine notifications and approval workflows without code",
      "Full-text search across all message history (Pro) finds past decisions in seconds"
    ],
    cons: [
      "Free plan caps message history at 90 days — older conversations become inaccessible",
      "Notification volume creates distraction and context-switching for many users",
      "Business+ ($12.50/user/mo) required for SSO and compliance retention policies"
    ],
    verdict: { summary: "Slack is the dominant team communication tool for good reason — its channel model and integration depth match any tech or marketing team's workflow. The 90-day free plan history limit is a real constraint; teams with compliance needs or large history requirements should budget for Business+." }
  },
  "mailchimp": {
    startingPrice: "Free / $13/mo",
    overview: "Mailchimp is an email marketing platform used by small businesses and creators for newsletters, automated sequences, and audience management. It offers a drag-and-drop email builder, audience segmentation, A/B testing, and landing pages. Free plan covers up to 500 contacts; Essentials starts at $13/mo; Standard adds advanced automation; Premium at $350/mo unlocks multivariate testing and advanced segmentation.",
    pros: [
      "Industry-leading deliverability reputation built over 20+ years with major ISPs",
      "Drag-and-drop email builder with 100+ templates requires no HTML knowledge",
      "Audience manager handles contacts, tags, segments, and purchase history in one view",
      "Pre-built automation journeys for welcome, abandoned cart, and re-engagement campaigns",
      "500+ third-party integrations via native connectors and Zapier"
    ],
    cons: [
      "Pricing jumps sharply with list growth — 10K contacts costs $110/mo on Standard",
      "Automation logic is less powerful than ActiveCampaign or Klaviyo at comparable price",
      "Landing page builder produces basic, template-constrained pages without custom code access"
    ],
    verdict: { summary: "Mailchimp is the sensible starting point for most small businesses and creators entering email marketing. Deliverability and ease of use are genuine strengths. As list size grows, the economics shift — users with complex automation needs or large lists often migrate to ActiveCampaign or Klaviyo." }
  },
  "woocommerce": {
    startingPrice: "Free (hosting required)",
    overview: "WooCommerce is an open-source ecommerce plugin for WordPress that powers approximately 30% of all online stores globally. It converts any WordPress site into a fully functional store with product management, payment processing, shipping, and tax calculation. The plugin is free; costs come from hosting, themes, and premium extensions for subscriptions, memberships, advanced shipping, or additional payment gateways.",
    pros: [
      "No monthly platform fee — costs scale with actual usage rather than a fixed subscription",
      "Unlimited customization through 800+ official extensions and thousands of WordPress plugins",
      "Full ownership of store data with no vendor lock-in — export everything at any time",
      "Supports physical, digital, subscription, and variable products natively",
      "Deep WordPress SEO integration with Rank Math and Yoast SEO for search visibility"
    ],
    cons: [
      "Requires WordPress hosting and ongoing technical maintenance — not hands-off like Shopify",
      "Extension costs accumulate quickly — subscriptions plugin alone costs $199/yr",
      "Performance requires caching configuration (WP Rocket, Cloudflare) to handle traffic spikes"
    ],
    verdict: { summary: "WooCommerce is the right choice when you want full control, low platform fees, and the entire WordPress plugin ecosystem at your disposal. The trade-off is hands-on technical management. Merchants wanting a fully managed experience without server concerns are better served by Shopify or BigCommerce." }
  },
  "airtable": {
    startingPrice: "Free / $20/user/mo",
    overview: "Airtable is a cloud-based database and project management tool that combines spreadsheet familiarity with relational database power. Teams use it to track projects, manage content pipelines, build product roadmaps, and run CRM workflows in one customizable workspace. The free plan supports unlimited bases with limited rows; Plus ($20/user/mo) adds more rows, automations, and revision history.",
    pros: [
      "Multiple views — Grid, Gallery, Kanban, Calendar, Gantt — without duplicating data",
      "Linked records create relational database structure across tables without SQL knowledge",
      "750+ integrations plus native Zapier and Make connectors for workflow automation",
      "Automations trigger emails, Slack messages, and Jira tickets based on record changes",
      "Template library covers marketing, product, HR, and CRM use cases with pre-built schemas"
    ],
    cons: [
      "Row limits on free and Plus plans restrict database size without expensive Pro upgrade",
      "Complex relational models require careful schema planning before data entry begins",
      "Performance degrades noticeably with tables exceeding 10,000 rows"
    ],
    verdict: { summary: "Airtable bridges the gap between simple spreadsheets and complex databases for teams that need relational data without writing SQL. The flexible view system and automation layer make it genuinely powerful. Row limits push high-volume use cases toward the expensive Pro plan or alternatives like Notion." }
  },
  "monday": {
    startingPrice: "$9/seat/mo",
    overview: "Monday.com is a work management platform used by teams to plan, track, and collaborate on projects and processes. Its color-coded boards, multiple views, and no-code automation make it accessible to non-technical teams across marketing, HR, operations, and product. Plans start at $9/seat/mo (Basic) with a 3-seat minimum; Pro ($19/seat/mo) adds time tracking, automations, and Gantt views.",
    pros: [
      "Visual board layout reduces onboarding friction — teams reach productive workflows in hours",
      "200+ integrations including Slack, Jira, HubSpot, and Salesforce",
      "Automations handle status changes, deadline alerts, and assignee rotation without code",
      "Dashboards aggregate project data across multiple boards for executive reporting",
      "Gantt and workload views support capacity planning and resource management"
    ],
    cons: [
      "Minimum 3-seat requirement makes it expensive for solo users or small pairs",
      "Automation recipe limits on lower plans force upgrade pressure as usage grows",
      "Reporting lacks depth compared to dedicated analytics tools for complex project metrics"
    ],
    verdict: { summary: "Monday.com offers the most visual and approachable work management experience for non-technical teams. The automation capabilities and integration depth are legitimate. The 3-seat minimum and upgrade pressure on automation limits are the main friction points for small teams." }
  },
  "jasper": {
    startingPrice: "$39/mo",
    overview: "Jasper is an AI writing assistant built for marketing teams to produce blogs, ads, emails, and social content at scale. Its Brand Voice feature trains outputs on uploaded company guidelines, ensuring consistent tone across campaigns. Jasper uses multiple underlying LLMs (GPT-4, Claude, Gemini). Creator ($39/mo) is for individuals; Pro ($59/mo) adds team collaboration and campaigns features.",
    pros: [
      "Brand Voice maintains consistent tone and style across all AI-generated content",
      "50+ templates for specific content types including ads, product descriptions, and cold emails",
      "Jasper Chat handles conversational content generation alongside template workflows",
      "Multi-language support for 25+ languages serves international marketing teams",
      "Native Surfer SEO integration for combined writing and on-page optimization"
    ],
    cons: [
      "$39-59/mo premium over general AI tools (ChatGPT, Claude) for specialized marketing features",
      "AI outputs require human editing — drafts need refinement before publication",
      "Quality depends on underlying LLM — results fluctuate with model updates"
    ],
    verdict: { summary: "Jasper is worth the premium over general AI tools specifically when Brand Voice consistency and marketing-template structure matter. Individual content creators rarely justify the $39/mo over ChatGPT Plus; marketing teams producing high-volume branded content get the clearest value." }
  },
  "hostinger": {
    startingPrice: "$2.99/mo",
    overview: "Hostinger is a web hosting provider known for aggressive pricing across shared, cloud, VPS, and WordPress hosting. Its custom hPanel control panel, free domain for the first year, and LiteSpeed server stack make it competitive for price-conscious users. Premium shared hosting starts at $2.99/mo intro (renews $8.99/mo); WordPress hosting from $2.99/mo; VPS from $4.99/mo for developers needing root access.",
    pros: [
      "Among the lowest prices in shared hosting without sacrificing LiteSpeed server performance",
      "Free domain name included for the first year on most hosting plans",
      "hPanel is cleaner and faster than legacy cPanel with a more intuitive dashboard",
      "LiteSpeed web server with built-in object caching outperforms Apache-based competitors",
      "24/7 live chat support with short queue times for technical issues"
    ],
    cons: [
      "Introductory price ($2.99/mo) renews at $8.99/mo after the initial term — significant increase",
      "Storage limits on entry-level plans are restrictive for media-heavy sites",
      "VPS plans require Linux server knowledge — no managed service option available"
    ],
    verdict: { summary: "Hostinger is the best value entry point for new websites and WordPress blogs that prioritize low cost and reasonable performance. The LiteSpeed advantage is real. Renewal pricing transparency and storage limits are the main caveats — budget for the renewal rate, not the intro rate." }
  },
  "fathom": {
    startingPrice: "$14/mo",
    overview: "Fathom Analytics is a privacy-focused web analytics platform built as a GDPR-compliant alternative to Google Analytics. It tracks pageviews, unique visitors, referral sources, and event conversions without cookies or personal data collection. A single-page dashboard eliminates GA4's navigation complexity. Pricing is based on monthly pageviews (not seats): $14/mo for up to 100K pageviews; $24/mo for 200K.",
    pros: [
      "GDPR, CCPA, and PECR compliant by design — no cookie consent banner required",
      "Single-page dashboard shows all key metrics without multi-screen navigation",
      "Cookieless tracking is unaffected by ITP and browser privacy changes",
      "EU isolation routing bypasses most ad blockers for accurate traffic counts",
      "Flat per-site pricing suits agencies managing multiple client sites"
    ],
    cons: [
      "Event tracking is simpler than GA4 — no funnel analysis, cohort analysis, or multi-touch attribution",
      "No heatmaps or session recordings — requires pairing with Hotjar or Microsoft Clarity",
      "No free plan — $14/mo minimum for 100K pageviews"
    ],
    verdict: { summary: "Fathom is the right choice when GDPR compliance, simplicity, and accurate traffic numbers matter more than deep funnel analysis. The single-dashboard approach is genuinely faster than GA4 for answering basic traffic questions. Teams needing behavioral analytics or conversion funnels need to add a second tool." }
  },
  "systeme-io": {
    startingPrice: "Free / $27/mo",
    overview: "Systeme.io is an all-in-one marketing platform that combines funnel building, email marketing, course hosting, membership sites, affiliate management, and blogging in one subscription. Its free plan — supporting up to 2,000 contacts, 3 funnels, and 1 course — is the most generous free tier in its category. Startup plan ($27/mo) adds 5,000 contacts and unlimited funnels; Webinar ($47/mo) includes evergreen webinars.",
    pros: [
      "Free plan supports 2,000 contacts and 3 funnels — functional for early-stage validation without cost",
      "Combines 6+ marketing tools in one dashboard, eliminating integration complexity",
      "Built-in affiliate program management handles commission tracking and payouts",
      "Course and membership site features included without additional LMS subscription",
      "No transaction fees on any plan including the free tier"
    ],
    cons: [
      "Email deliverability reputation less established than dedicated platforms like Mailchimp or ConvertKit",
      "Template library less polished than ClickFunnels or Kartra design-wise",
      "Limited third-party integrations — relies on native stack rather than connecting existing tools"
    ],
    verdict: { summary: "Systeme.io offers the most compelling free plan for creators and solo entrepreneurs testing a business model. The all-in-one stack eliminates the Zapier complexity of stitching separate tools together. Established businesses with existing email platforms may find the deliverability and integration limitations restrictive." }
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
