import { addMultipleToDlContext } from "./dl-context";

/** URL parameters captured from ad platforms */
const AD_PARAMS = [
  "ip", "campaign_id", "adset_id", "ad_id", "site_source_name",
  "placement", "gender", "fb_age", "device", "ad_account", "ua",
  "region", "city", "zip", "state", "fbclid", "gclid",
  "ps_state", "ps_state1", "ps_variable", "ps_cta", "ps_region",
  "ip_region",
  // UTM params
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
] as const;

export function captureUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const entries: Record<string, string> = {};

  for (const key of AD_PARAMS) {
    const val = params.get(key);
    if (val) entries[key] = val;
  }

  // Store referrer
  if (document.referrer) {
    entries.referrer = document.referrer;
  }

  // Timestamp
  entries.funnel_loaded_at = new Date().toISOString();
  entries.page_url = window.location.href;

  if (Object.keys(entries).length > 0) {
    addMultipleToDlContext(entries);
  }

  return entries;
}
