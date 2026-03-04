const DL_KEY = "dl_context";

export function getDlContext(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(DL_KEY) || "{}");
  } catch {
    return {};
  }
}

export function addToDlContext(key: string, value: string) {
  const ctx = getDlContext();
  ctx[key] = value;
  localStorage.setItem(DL_KEY, JSON.stringify(ctx));
}

export function addMultipleToDlContext(entries: Record<string, string>) {
  const ctx = getDlContext();
  Object.assign(ctx, entries);
  localStorage.setItem(DL_KEY, JSON.stringify(ctx));
}

export function extractDlContext(): Record<string, string> {
  return getDlContext();
}

export function clearDlContext() {
  localStorage.removeItem(DL_KEY);
}

/** Compute a simple secret for webhook auth */
export function computeSecret(): string {
  const ctx = getDlContext();
  const seed = (ctx.email || "") + (ctx.phone || "") + (ctx.ip || "");
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return String(Math.abs(hash));
}
