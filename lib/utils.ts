/** Join class names, skipping falsy entries. */
export function cn(
  ...parts: Array<string | undefined | false | null>
): string {
  return parts.filter((p): p is string => Boolean(p)).join(" ");
}

/** Format a number as USD for display (storefront + admin). */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

/** Clamp a number to an inclusive range. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
