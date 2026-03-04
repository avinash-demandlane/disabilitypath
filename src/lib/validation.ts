export function isValidUSPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  // Accept 10-digit US numbers (with or without leading 1)
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const d = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (d.length !== 10) return phone;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
