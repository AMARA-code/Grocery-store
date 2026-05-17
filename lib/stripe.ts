import Stripe from "stripe";

function assertStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key?.trim() || key.startsWith("your_")) {
    throw new Error("STRIPE_SECRET_KEY is missing or still a placeholder.");
  }
  return key;
}

/** Server-only Stripe SDK (API routes, webhooks, Server Actions). */
export function getStripe(): Stripe {
  return new Stripe(assertStripeSecretKey(), {
    typescript: true,
  });
}
