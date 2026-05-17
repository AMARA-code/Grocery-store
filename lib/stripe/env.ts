export function isStripeConfigured(): boolean {
  const secret = process.env.STRIPE_SECRET_KEY;
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!secret?.trim() || secret.startsWith("your_")) return false;
  if (!publishable?.trim() || publishable.startsWith("your_")) return false;
  return true;
}

export function isStripeWebhookConfigured(): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  return Boolean(secret?.trim() && !secret.startsWith("your_"));
}
