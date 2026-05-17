const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Maps cart id to Supabase `products.id` when it is a UUID; otherwise null. */
export function parseProductUuid(id: string): string | null {
  return UUID_RE.test(id) ? id : null;
}
