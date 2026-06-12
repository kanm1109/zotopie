import { readFileSync, writeFileSync } from "fs";

const enrichment = {
  "mighty-networks": {
    startingPrice: "$33/mo",
    overview: "Mighty Networks is an all-in-one community, course, and membership platform that positions itself as the alternative to building a following on rented social media. It combines discussion spaces, courses, live events, member profiles, and paid membership tiers in one white-labeled environment. Courses plan ($33/mo) supports community and courses; Business ($99/mo) adds larger member capacity and more community features.",
    pros: [
      "All content and community hosted on your platform — not subject to algorithm changes or social media policy",
      "Native iOS and Android apps under your brand without requiring a separate app development project",
      "Powerful course and community combination — discussions attached directly to each lesson",
      "Member profiles with activity feeds create genuine network effects within the community",
      "Host virtual events and live streaming without needing Zoom or external streaming tools"
    ],
    cons: [
      "$33/mo requires paying members to justify before audience monetization begins",
      "100-member limit on Courses plan — growth requires Business plan at $99/mo",
      "Custom branded apps require Mighty Pro plan at $360/mo, significantly above base pricing"
    ],
    verdict: { summary: "Mighty Networks is the best choice for creators building a community-first business around courses and live events on an owned platform. The branded app option is a genuine differentiator from Circle or Skool. Budget for the Business plan before launch — the 100-member Courses plan limit is hit quickly by any active community." }
  },
  "bettermode": {
    startingPrice: "$49/mo",
    overview: "Bettermode (formerly Tribe) is a community platform for B2B SaaS companies and brands building customer communities, support forums, and product feedback hubs. It offers discussion forums, ideation boards, knowledge bases, and native integrations with Intercom, HubSpot, and Salesforce. Starter ($49/mo) supports up to 1,000 members; Pro ($99/mo) extends capacity to 5,000 members.",
    pros: [
      "Deep CRM integration — sync member activity to HubSpot, Salesforce, and Intercom automatically",
      "Customizable space types (discussion, ideation, knowledge base, Q&A) within one community",
      "White-label with custom domain and brand colors included on all paid plans",
      "SSO integration authenticates members through existing identity providers",
      "API-first architecture enables embedding community widgets directly inside product interfaces"
    ],
    cons: [
      "$49/mo minimum with member limits creates cost pressure as community grows past 1,000 members",
      "Setup and customization requires technical understanding of space type configuration",
      "Limited template library — community structure requires manual design from scratch"
    ],
    verdict: { summary: "Bettermode is the strongest community platform for B2B SaaS products that need deep CRM integration and SSO. It is built for customer communities and support forums rather than creator monetization. Teams building a fan community rather than a customer community should evaluate Circle or Mighty Networks instead." }
  },
  "discourse": {
    startingPrice: "Free (self-hosted)",
    overview: "Discourse is an open-source discussion forum platform used by developer communities, support forums, and online communities. Its thread-based structure, category management, trust levels, and plugin ecosystem power communities ranging from Stack Overflow-style Q&A to product support portals. Self-hosting on any server is free; Discourse Basic hosted plan starts at $50/mo.",
    pros: [
      "Open-source with full self-hosting option — no monthly fee for teams with server administration capacity",
      "Thread-based discussions with rich formatting (code blocks, syntax highlighting, embeds) suit technical communities",
      "Trust level system automatically moderates user permissions as reputation builds over time",
      "Plugin ecosystem extends functionality for voting, polls, chat, and custom user fields",
      "SEO-optimized forum threads index well on Google, generating organic traffic for technical queries"
    ],
    cons: [
      "Self-hosting requires server administration and regular platform update management",
      "Hosted plans ($50/mo) are expensive relative to the community features provided",
      "Real-time chat is secondary to asynchronous threads — not a Slack or Discord replacement"
    ],
    verdict: { summary: "Discourse is the strongest platform for technical communities that value asynchronous, searchable discussion over real-time chat. The self-hosted option makes it uniquely cost-effective for developer communities. Non-technical teams building creator or brand communities will find Circle, Skool, or Discord more approachable." }
  },
  "obsidian": {
    startingPrice: "Free / $8/mo",
    overview: "Obsidian is a local-first knowledge management and note-taking tool that stores all notes as plain Markdown files on your device. Its graph view, bidirectional links, and plugin ecosystem make it popular among researchers, writers, and developers who want full data control. The app is free for personal use; Sync ($8/mo) adds encrypted cross-device sync; Publish ($16/mo) hosts a public knowledge site.",
    pros: [
      "All notes stored as plain Markdown files — portable to any tool and never locked to a proprietary format",
      "Bidirectional links and graph view reveal connections between notes that linear documents miss",
      "1,000+ community plugins for spaced repetition, task management, Kanban, and daily journaling",
      "Local-first means full data privacy — notes never leave your device without explicit sync",
      "Templating and Dataview plugin create dynamic note queries and database-style views"
    ],
    cons: [
      "Cross-device sync requires $8/mo Obsidian Sync or manual setup with iCloud or Dropbox",
      "No real-time collaboration — not suitable for team knowledge bases with concurrent editing",
      "Learning curve for graph-based note-taking is steeper than simpler tools like Notion or Apple Notes"
    ],
    verdict: { summary: "Obsidian is the right tool for individuals who want to build a lasting personal knowledge system with no vendor lock-in. The Markdown-native approach future-proofs notes across any tool changes. Teams needing real-time collaboration or a shared workspace should use Notion or Confluence instead." }
  },
  "todoist": {
    startingPrice: "Free / $4/mo",
    overview: "Todoist is a task management app used by individuals and teams to capture, organize, and prioritize tasks across projects. Natural language input converts plain text like 'every Tuesday at 9am' into scheduled recurring tasks. Free plan covers 5 active projects; Pro ($4/mo) adds unlimited projects, task reminders, and productivity trend analytics.",
    pros: [
      "Natural language date parsing creates scheduled tasks from plain text without date pickers",
      "Karma system gamifies task completion with productivity trends and streak tracking",
      "Quick Capture via keyboard shortcut, mobile widget, or email forwarding captures tasks in seconds",
      "Available natively on iOS, Android, Mac, Windows, and Chrome extension for full-platform coverage",
      "500+ integration templates via Zapier, plus native Slack and Google Calendar connectors"
    ],
    cons: [
      "Project hierarchy limited to 5 levels — complex work breakdown structures require workarounds",
      "Collaboration features require Pro plan at $4/mo per user for shared projects",
      "No native time tracking or workload management for team capacity planning"
    ],
    verdict: { summary: "Todoist is the best personal task manager for individuals who want natural language input, cross-platform availability, and a simple productivity system. It excels at personal GTD workflows. Teams needing shared project management with multiple views, dependencies, or time tracking should use Asana, ClickUp, or Monday.com." }
  },
  "coda": {
    startingPrice: "Free / $10/user/mo",
    overview: "Coda is a document platform that combines the flexibility of word processors, the power of spreadsheets, and the interactivity of lightweight apps in one document format. Teams use Coda for product roadmaps, OKR tracking, meeting notes, and internal wikis where linked tables and automations replace separate tools. Free plan is limited by doc size; Pro ($10/user/mo) removes limits and adds automations.",
    pros: [
      "Tables connected across document sections eliminate copy-paste data silos between spreadsheets",
      "Buttons and automations build lightweight workflow tools — approval forms, daily digests — without code",
      "Sync from external sources (Jira, GitHub, Google Sheets) keeps data live inside the document",
      "Formulas use familiar spreadsheet syntax with added relational capabilities for cross-table lookups",
      "100+ starter templates for product, team, and project management use cases"
    ],
    cons: [
      "Doc size limits on free plan are hit quickly with large tables or embedded assets",
      "Performance degrades with very large documents or deeply nested tables in complex workspaces",
      "Integration Packs ecosystem smaller than Notion's integration library"
    ],
    verdict: { summary: "Coda is the strongest alternative when documents need to act like apps — buttons, automations, and linked tables that Notion lacks. It suits product and operations teams building internal tools within documents. Teams focused on knowledge management and wiki use cases get more from Notion's broader template library." }
  },
  "synthesia": {
    startingPrice: "$29/mo",
    overview: "Synthesia is an AI video generation platform that converts text scripts into video presentations using AI avatars and synthesized voices. Teams use it to produce training videos, product demos, and explainer content without cameras, studios, or video editors. Starter ($29/mo) includes 120 video minutes per year and 60+ AI avatars; Creator ($89/mo) raises limits for high-volume production teams.",
    pros: [
      "Script-to-video pipeline is significantly faster than traditional video production requiring filming and editing",
      "60+ AI avatars in 120+ languages with accurate lip-sync for international content production",
      "Custom avatar creation from a recorded video maintains brand-consistent presenter identity",
      "PowerPoint-like scene editor is familiar to non-video professionals without video editing experience",
      "Automatic closed captioning ensures accessibility compliance without manual transcription"
    ],
    cons: [
      "AI avatars lack human expressiveness — not suitable for emotional or nuanced communication",
      "Starter plan 120 minutes per year is easily exhausted with regular production schedules",
      "Voice quality varies by language — non-English voices noticeably less natural than major language models"
    ],
    verdict: { summary: "Synthesia is the right tool for internal training videos, localized product demos, and explainer content where production speed matters more than emotional connection. The multilingual capability is a genuine differentiator for international teams. High-emotion content — testimonials, brand campaigns — still requires human presenters." }
  },
  "vultr": {
    startingPrice: "$2.50/mo",
    overview: "Vultr is a cloud infrastructure provider offering VPS (Cloud Compute), bare metal servers, and object storage with global server locations and hourly billing. Its competitive pricing, 32 global regions, and NVMe-backed High Frequency plans make it a strong DigitalOcean alternative for developers and hosting providers. Cloud Compute starts at $2.50/mo for 512MB RAM.",
    pros: [
      "32 global data centers — more than double DigitalOcean's 15 locations for regional proximity",
      "Hourly billing with no minimum commitment — suitable for short-lived development environments",
      "High Frequency plans with NVMe storage reduce latency for database-heavy workloads from $6/mo",
      "Bare metal servers available for workloads requiring dedicated hardware without virtualization overhead",
      "Block storage, object storage, load balancers, and DNS managed within the same platform"
    ],
    cons: [
      "Documentation and tutorials less comprehensive than DigitalOcean's industry-leading library",
      "Support is a paid add-on — community forum is the default free support channel",
      "No managed database service — database hosting requires full server self-management"
    ],
    verdict: { summary: "Vultr is the right choice when global region coverage or NVMe storage performance drives infrastructure decisions. Its pricing is competitive with DigitalOcean across most configurations. Teams new to cloud infrastructure benefit more from DigitalOcean's tutorial library and community resources." }
  },
  "wp-engine": {
    startingPrice: "$20/mo",
    overview: "WP Engine is a managed WordPress hosting platform built for businesses, agencies, and enterprises that require performance, security, and reliability without server management. It includes daily automated backups, one-click staging environments, proprietary EverCache caching, Cloudflare CDN, and 24/7 WordPress-expert support. Startup ($20/mo) hosts 1 site; Growth ($115/mo) scales to 25 sites for agencies.",
    pros: [
      "EverCache performance engine consistently delivers fast page loads under traffic spikes",
      "One-click staging environments enable risk-free development, testing, and client preview",
      "24/7 WordPress-expert support resolves issues faster than generic hosting support teams",
      "Genesis framework and 35+ premium themes included free with all plans",
      "Automated daily backups with one-click point-in-time restore for disaster recovery"
    ],
    cons: [
      "$20/mo minimum for one site is expensive compared to SiteGround's $2.99/mo intro pricing",
      "Monthly visit limits on lower plans trigger overage charges during unexpected traffic spikes",
      "Certain plugins are incompatible with WP Engine's managed environment — restricted list applies"
    ],
    verdict: { summary: "WP Engine is the right managed WordPress host when site performance has direct revenue impact and technical support quality matters. The EverCache technology and staging workflow are genuine advantages for agency and ecommerce use cases. Personal sites and low-traffic blogs rarely justify the $20/mo entry point." }
  },
  "bluehost": {
    startingPrice: "$2.95/mo",
    overview: "Bluehost is a web hosting provider that has been the official WordPress.org recommended host for over a decade. It offers shared, VPS, and managed WordPress hosting with a free domain on annual plans, one-click WordPress install, and cPanel control panel. Basic plan ($2.95/mo intro, renews $10.99/mo) is designed for single-site WordPress beginners building their first website.",
    pros: [
      "Official WordPress.org recommendation provides community trust and compatibility assurance",
      "One-click WordPress install with guided setup wizard reduces technical barriers for beginners",
      "Free domain name for the first year reduces initial total cost of website launch",
      "cPanel control panel is industry-standard — most WordPress tutorials assume cPanel familiarity",
      "24/7 phone and live chat support serves non-technical users who need guided help"
    ],
    cons: [
      "Introductory rate ($2.95/mo) renews at $10.99/mo — a significant price increase after the first term",
      "Performance benchmarks below SiteGround and Kinsta for WordPress sites under load",
      "Upsell experience during checkout and inside the dashboard is aggressive and persistent"
    ],
    verdict: { summary: "Bluehost's WordPress.org endorsement and beginner-friendly setup make it a reasonable first hosting choice. Performance and renewal pricing transparency are the weaknesses — SiteGround offers better speed at comparable post-renewal pricing. Businesses with traffic that matters should budget for managed WordPress alternatives." }
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
