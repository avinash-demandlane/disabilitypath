/** Check if a lead (by phone) already exists within the lookback period */
export async function checkDuplicate(phone: string): Promise<{ exists: boolean }> {
  const url = import.meta.env.VITE_DUPLICATE_CHECK_URL;
  if (!url) return { exists: false };

  try {
    const digits = phone.replace(/\D/g, "");
    const res = await fetch(`${url}?phone=${encodeURIComponent(digits)}&lookbackDays=14`);
    if (!res.ok) return { exists: false };
    const data = await res.json();
    return { exists: !!data.exists };
  } catch {
    return { exists: false };
  }
}
