import { readFileSync, writeFileSync } from "fs";

const enrichment = {
  "hotjar": {
    startingPrice: "$32/mo",
    overview: "Hotjar is a behavioral analytics platform that records user sessions, generates heatmaps, and collects feedback through on-site surveys and polls. Product and UX teams use it to understand how visitors navigate pages and where they drop off before converting. Observe plan ($32/mo) includes session recordings and heatmaps; Ask plan ($80/mo) adds on-site surveys and user interviews.",
    pros: [
      "Session recordings reveal real user behavior — where users click, scroll, and hesitate — beyond what quantitative data shows",
      "Heatmaps aggregate thousands of sessions into visual click and scroll maps for quick UX diagnosis",
      "On-site surveys and NPS polls collect qualitative feedback at scale without leaving the product",
      "JavaScript snippet deploys in under 5 minutes with Google Tag Manager — no back-end changes required",
      "Integrates with Google Analytics, Mixpanel, and Segment to combine quantitative and qualitative analysis"
    ],
    cons: [
      "Session recordings add JavaScript payload that slightly slows page load speed",
      "GDPR compliance requires careful consent configuration and data retention settings",
      "Free plan limits to 35 daily sessions — insufficient for meaningful analysis on any active site"
    ],
    verdict: { summary: "Hotjar fills the behavioral analytics gap that tools like Google Analytics cannot — it shows the 'why' behind traffic numbers through session recordings and heatmaps. It pairs best with GA4 rather than replacing it. The free plan is too limited for real use; budget for the $32/mo Observe plan as a minimum." }
  },
  "mixpanel": {
    startingPrice: "Free / $28/mo",
    overview: "Mixpanel is a product analytics platform built around event tracking and user cohort analysis. Product teams use it to understand feature adoption, retention, and conversion funnels through user-level analytics rather than aggregate pageview counts. Free plan covers 20M events/mo; Growth ($28/mo) adds unlimited saved reports and cohort exports for larger teams.",
    pros: [
      "User-level event tracking enables cohort analysis — compare behavior of users who performed specific actions",
      "Funnel analysis with conversion rates at each step identifies exact drop-off points in user journeys",
      "Retention analysis shows which product actions predict long-term user engagement",
      "MTU-based pricing (monthly tracked users) rather than event volume is more predictable at scale",
      "Real-time data with sub-second query response for active experiment monitoring"
    ],
    cons: [
      "Requires developer implementation — event taxonomy planning and tracking instrumentation are technical tasks",
      "Analysis capabilities assume a clean, well-structured event schema built before implementation",
      "Not suitable for content or marketing analytics — optimized for product and SaaS behavior tracking"
    ],
    verdict: { summary: "Mixpanel is the right tool when you need to understand user behavior at the individual level — funnels, retention, and cohort comparisons that session-aggregate tools cannot provide. The upfront implementation investment is significant; teams without a developer to build the event schema will not extract full value." }
  },
  "amplitude": {
    startingPrice: "Free / $61/mo",
    overview: "Amplitude is a product analytics platform used by growth and product teams to understand user behavior, run experiments, and optimize conversion funnels. It tracks events at the user level and connects behavior to business outcomes. The free plan includes 10M events/mo; Plus ($61/mo) adds predictive cohorts, advanced segmentation, and data warehouse sync.",
    pros: [
      "Behavioral analysis charts — Funnels, Retention, Stickiness, Revenue — built into a unified UI",
      "User paths reveal the most common sequences users take through a product without manual query writing",
      "Charts Builder with drag-and-drop formulas is approachable for non-SQL analysts on growth teams",
      "Integrates with Optimizely and LaunchDarkly for A/B test result analysis alongside behavioral data",
      "Free plan is genuinely functional for early-stage products before requiring a paid tier"
    ],
    cons: [
      "Full analytical depth requires a dedicated analyst to extract value — not self-serve for business teams",
      "Data warehouse sync (Snowflake, BigQuery) costs extra on lower plans",
      "Complex queries on large datasets can be slow without proper sampling configuration"
    ],
    verdict: { summary: "Amplitude is the stronger product analytics platform for growth teams that run experiments and need predictive cohort analysis. The free plan is a genuine advantage over Mixpanel for early-stage products. Both tools require developer instrumentation investment; Amplitude edges ahead for teams that also run A/B tests." }
  },
  "copy-ai": {
    startingPrice: "Free / $36/mo",
    overview: "Copy.ai is an AI writing tool focused on marketing copy — product descriptions, ad copy, email subject lines, and social posts. Its Workflows feature chains multiple AI prompts to automate multi-step content pipelines, such as inputting a product URL and generating descriptions, headlines, and ad variations in sequence. Free plan produces 2,000 words/mo; Starter ($36/mo) gives unlimited generations and Workflow access.",
    pros: [
      "Marketing-specific templates for Facebook ads, Google ads, product pages, and email sequences",
      "Workflow automation chains multiple AI steps — input a URL, get descriptions and ad copy in sequence",
      "Infobase stores brand voice, product information, and audience details for consistent outputs",
      "Supports 25+ languages for international marketing campaign content",
      "Team collaboration features on Pro plan for shared Workflows and brand assets"
    ],
    cons: [
      "Free plan 2,000 word limit is exhausted quickly for any active marketing program",
      "AI outputs require human editing — drafts serve as starting points, not finished copy",
      "At $36/mo, competes with general-purpose AI tools (Claude, ChatGPT) with broader capabilities"
    ],
    verdict: { summary: "Copy.ai's Workflow automation feature is its strongest differentiator — teams that generate high-volume, multi-format marketing content (ads, descriptions, emails) from the same product input benefit most. For occasional marketing writing, general-purpose AI tools offer comparable output at lower cost." }
  },
  "asana": {
    startingPrice: "Free / $10.99/user/mo",
    overview: "Asana is a project management platform used by teams to organize work into tasks, projects, and portfolios. Timeline, Kanban, list, and calendar views adapt to different team workflows — from engineering sprints to editorial calendars to cross-functional launches. Free plan works for teams up to 10 users; Premium ($10.99/user/mo) unlocks timelines, milestones, and advanced workflow rules.",
    pros: [
      "Timeline view with task dependencies clearly visualizes complex project schedules",
      "Goals feature connects team tasks to company-level OKRs for strategic alignment",
      "Rules automate routine project actions — auto-assign, due date shifts, status changes — without code",
      "300+ integrations including Slack, GitHub, Salesforce, and Microsoft 365",
      "Work management templates cover product launches, marketing campaigns, and hiring pipelines"
    ],
    cons: [
      "Free plan lacks timeline and milestones — core planning features require paid upgrade",
      "Task commenting is unthreaded, creating long conversation chains on complex projects",
      "No native time tracking — requires Harvest, Clockify, or custom integration"
    ],
    verdict: { summary: "Asana is the most balanced project management platform for teams that need both flexibility and structure. The Goals and Timeline features in Premium are genuinely useful for cross-functional launches. Teams that need native time tracking or more custom fields may find ClickUp or Monday.com a better fit." }
  },
  "trello": {
    startingPrice: "Free / $5/user/mo",
    overview: "Trello is a Kanban-based project management tool organized around boards, lists, and cards. Its drag-and-drop interface makes it accessible to non-technical teams for task tracking, editorial calendars, and lightweight project management. Free plan includes unlimited cards and 10 boards; Standard ($5/user/mo) adds custom backgrounds, unlimited boards, and saved search filters.",
    pros: [
      "Lowest onboarding friction of any PM tool — teams reach productive workflows in minutes",
      "Power-Ups connect Trello cards to Google Drive, Slack, GitHub, and Jira without code",
      "Card templates speed up recurring task creation for repetitive workflows",
      "Free plan supports real projects for small teams without time limits",
      "Butler automation rules handle repetitive card actions and board maintenance"
    ],
    cons: [
      "Kanban-only design lacks Gantt, timeline, or workload views without Power-Ups",
      "Scales poorly for complex projects with many dependencies across teams",
      "Reporting and analytics are minimal compared to Monday.com or ClickUp"
    ],
    verdict: { summary: "Trello is the right tool for teams that need visual task tracking without configuration overhead. Its simplicity is a genuine strength for editorial and personal workflows. Teams that outgrow basic Kanban or need timeline views and dependencies should graduate to Asana, ClickUp, or Monday.com." }
  },
  "ghost": {
    startingPrice: "$9/mo",
    overview: "Ghost is a headless CMS and publishing platform built specifically for professional bloggers, journalists, and membership publications. It combines content management, newsletter delivery, and paid membership tiers in one platform. Ghost(Pro) hosted plans start at $9/mo (Starter, 500 members); self-hosting on Node.js is free. Native newsletter delivery is included without requiring Mailchimp or ConvertKit.",
    pros: [
      "Native membership and subscription tiers gate content for paid members without external tools",
      "Built-in newsletter delivery sends directly from Ghost without a separate email platform",
      "Clean Markdown-based editor removes formatting distractions for writing-focused workflows",
      "SEO-optimized structured data (Article JSON-LD) generated automatically for all posts",
      "Open-source — self-hosting on Node.js eliminates monthly platform fees entirely"
    ],
    cons: [
      "Self-hosted Ghost requires Node.js server knowledge — not suitable for non-technical publishers",
      "Theme customization requires Handlebars.js knowledge beyond simple CSS changes",
      "Ghost(Pro) pricing rises steeply with member count — 10K members costs $199/mo"
    ],
    verdict: { summary: "Ghost is the strongest focused alternative to WordPress for writers who want built-in memberships and newsletter delivery without managing plugins. The writing experience and native monetization justify the switch from WordPress for publication-first sites. Self-hosted Ghost requires technical comfort that most non-developers lack." }
  },
  "cloudflare": {
    startingPrice: "Free / $20/mo",
    overview: "Cloudflare is a network infrastructure platform providing CDN, DDoS protection, DNS management, and edge computing services. Its free plan covers CDN and DNS for unlimited sites, making it the default choice for adding performance and security to any web property. Pro ($20/mo) adds Web Application Firewall and image optimization; Business and Enterprise plans serve high-traffic and compliance workloads.",
    pros: [
      "Free CDN with 200+ global PoPs reduces latency for international visitors on any plan",
      "Zero-configuration DDoS protection handles attacks up to terabits per second on all tiers",
      "Cloudflare Workers enables edge-computing functions with 100K free requests per day",
      "Universal SSL certificate provisioned automatically for any domain in minutes",
      "1.1.1.1 DNS resolver is the world's fastest public DNS, integrated with Cloudflare domain management"
    ],
    cons: [
      "Free plan WAF rules are limited — blocks common threats but lacks customizable rulesets",
      "Workers debugging is harder than traditional server-side code with limited local tooling",
      "Enterprise features (Advanced DDoS, custom certificates) require custom contract pricing"
    ],
    verdict: { summary: "Cloudflare's free plan is the easiest high-value addition to any web infrastructure — CDN, DDoS protection, and SSL for zero cost. Pro and Business tiers are worth it when WAF customization or analytics depth matter. Workers is a genuinely powerful edge computing platform for developers comfortable with the debugging tradeoffs." }
  },
  "digitalocean": {
    startingPrice: "$4/mo",
    overview: "DigitalOcean is a cloud infrastructure provider targeting developers and small-to-mid-size businesses with simplified VPS (Droplets), managed databases, Kubernetes, and object storage. Its focus on developer experience — clean API, clear pricing, and extensive tutorials — positions it between raw cloud providers (AWS/GCP) and managed hosting (Kinsta/WP Engine). Droplets start at $4/mo for 512MB RAM.",
    pros: [
      "Transparent hourly billing with monthly cap — no surprise egress fees beyond documented limits",
      "1-click Droplet images for popular stacks (LAMP, LEMP, WordPress, Docker) accelerate deployment",
      "Managed databases (PostgreSQL, MySQL, Redis) eliminate database administration overhead",
      "Spaces object storage is S3-compatible with cheaper egress pricing than AWS",
      "Community tutorial library covers nearly every deployment scenario in depth"
    ],
    cons: [
      "No managed WordPress hosting — requires manual configuration unlike Kinsta or WP Engine",
      "Support is slow on lower tiers — ticket-based response without live chat",
      "Fewer global regions than AWS/GCP — 15 data centers versus 30+ for major cloud providers"
    ],
    verdict: { summary: "DigitalOcean hits the best combination of developer-friendly UX, transparent pricing, and genuine infrastructure capability. It is the natural stepping stone between shared hosting and AWS complexity. Teams needing managed WordPress or without DevOps capacity should look at managed hosting alternatives." }
  },
  "squarespace": {
    startingPrice: "$16/mo",
    overview: "Squarespace is an all-in-one website builder combining hosting, templates, domain management, and basic ecommerce in one subscription. It targets creatives, freelancers, and small businesses needing a professional online presence without technical skills. Personal ($16/mo) covers portfolio and content sites; Business ($23/mo) and Commerce ($28-52/mo) add ecommerce with reduced transaction fees.",
    pros: [
      "Award-winning template designs maintain visual quality without professional design skills",
      "Built-in image optimization and CDN deliver media-heavy portfolio and product sites quickly",
      "Integrated blogging, portfolio, scheduling, and ecommerce reduce the need for separate tools",
      "All plans include SSL, hosting, and 24/7 customer support",
      "Fluid Engine drag-and-drop editor provides layout flexibility beyond template constraints"
    ],
    cons: [
      "Template switching requires rebuilding page layouts — changing creative direction is disruptive",
      "Custom code (CSS/JavaScript injection) requires Business plan or above",
      "ecommerce transaction fees (0-3%) apply on non-Commerce plans, reducing margins"
    ],
    verdict: { summary: "Squarespace is the strongest all-in-one solution for creatives and service businesses who need a professional website without technical overhead. Design quality is its clearest differentiator from Wix. ecommerce merchants with meaningful sales volume should consider Commerce plans to avoid transaction fees." }
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
