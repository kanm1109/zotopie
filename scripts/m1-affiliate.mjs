import { readFileSync, writeFileSync } from "fs";

// Affiliate program data: slug -> { url, programNote }
// URLs are affiliate signup/landing pages — user replaces with their ref link
const affiliateData = {
  "convertkit":      { url: "https://convertkit.com?lmref=YOURREF",           note: "30% recurring — join at kit.com/affiliates" },
  "beehiiv":         { url: "https://www.beehiiv.com?via=YOURREF",             note: "50% first year — join at beehiiv.com/affiliates" },
  "kinsta":          { url: "https://kinsta.com?kaid=YOURREF",                  note: "$50-500 + 10% recurring" },
  "wp-engine":       { url: "https://shareasale.com/r.cfm?b=394937&u=YOURID",  note: "$200+ per sale" },
  "hostinger":       { url: "https://www.hostinger.com/affiliates?YOURREF",    note: "$60+ per sale" },
  "siteground":      { url: "https://www.siteground.com/affiliates?YOURREF",   note: "$50-125/sale" },
  "bluehost":        { url: "https://www.bluehost.com/track/YOURREF/",         note: "$65/sale" },
  "hubspot":         { url: "https://app.impact.com/campaign-promo-signup/HubSpot.brand",  note: "$250-1K per sale" },
  "activecampaign":  { url: "https://www.activecampaign.com/partner/",         note: "20-30% recurring" },
  "jasper":          { url: "https://jasper.ai/affiliate-program",             note: "25% recurring" },
  "fathom":          { url: "https://usefathom.com/affiliates/YOURREF",        note: "25% recurring" },
  "circle":          { url: "https://circle.so/affiliate-program",             note: "30% recurring" },
  "skool":           { url: "https://www.skool.com/refer?ref=YOURREF",         note: "40% recurring" },
  "systeme-io":      { url: "https://systeme.io/?sa=YOURREF",                  note: "40% recurring" },
  "clickfunnels":    { url: "https://www.clickfunnels.com/affiliate-program",  note: "40% recurring" },
  "clickup":         { url: "https://clickup.com/affiliate-program",           note: "20% recurring" },
  "lemon-squeezy":   { url: "https://app.impact.com/campaign-promo-signup/LemonSqueezy.brand", note: "via Impact" },
  "getresponse":     { url: "https://www.getresponse.com/affiliate-programs",  note: "33% recurring" },
  "mailchimp":       { url: "https://mailchimp.com/referral/",                 note: "referral credits" },
  "monday":          { url: "https://monday.com/partner/",                     note: "revenue share" },
};

let tools = JSON.parse(readFileSync("./src/data/tools.json","utf8"));
let updated = 0;

tools = tools.map(t => {
  if (affiliateData[t.slug]) {
    updated++;
    return {
      ...t,
      affiliate: true,
      affiliateUrl: affiliateData[t.slug].url,
    };
  }
  return t;
});

writeFileSync("./src/data/tools.json", JSON.stringify(tools, null, 2) + "\n");
console.log("M1: affiliate fields added to", updated, "tools");
console.log("NOTE: Replace YOURREF/YOURID placeholders with your actual affiliate IDs");
