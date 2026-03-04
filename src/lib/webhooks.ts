import { extractDlContext, computeSecret } from "./dl-context";

function buildUrlEncodedBody(extra?: Record<string, string>): URLSearchParams {
  const ctx = extractDlContext();
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...ctx, ...extra })) {
    params.append(k, v);
  }
  params.append("secret", computeSecret());
  return params;
}

async function postWebhook(url: string | undefined, body: URLSearchParams): Promise<boolean> {
  if (!url) return false;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return true;
  } catch (err) {
    console.warn("[webhook] POST failed:", url, err);
    return false;
  }
}

/** Fires when user provides their email */
export async function postEmailProvided() {
  const url = import.meta.env.VITE_N8N_WEBHOOK_EMAIL;
  return postWebhook(url, buildUrlEncodedBody());
}

/** Fires when user provides their phone (+ name) */
export async function postPhoneCaptured() {
  const url = import.meta.env.VITE_N8N_WEBHOOK_PHONE;
  return postWebhook(url, buildUrlEncodedBody());
}

/** Main lead post — fires on full submission */
export async function postLead() {
  const url = import.meta.env.VITE_N8N_WEBHOOK_LEAD;
  const body = buildUrlEncodedBody();
  const ok = await postWebhook(url, body);

  // Zapier fallback
  if (!ok) {
    const fallback = import.meta.env.VITE_ZAPIER_FALLBACK_URL;
    if (fallback) await postWebhook(fallback, body);
  }
  return ok;
}

/** Fires on click-to-call events */
export async function postCTC(action: "displayed" | "clicked", ctcNumber: string) {
  const url = import.meta.env.VITE_N8N_WEBHOOK_CTC;
  return postWebhook(url, buildUrlEncodedBody({ ctcAction: action, ctcNumber }));
}

/** Fires when funnel is completed or user exits */
export async function postFunnelClosed() {
  const url = import.meta.env.VITE_N8N_WEBHOOK_CLOSE;
  return postWebhook(url, buildUrlEncodedBody());
}
