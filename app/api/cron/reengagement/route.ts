import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendMail } from "@/lib/email/mailer";
import { reengagementTemplate } from "@/lib/email/reengagement-email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron (not a random person)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // Find registered users whose last order was 2+ weeks ago
  // and haven't been sent a re-engagement email in the last 30 days
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, reengagement_sent_at")
    .not("email", "is", null);

  if (error || !users) {
    console.error("[reengagement] Failed to fetch profiles:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;

  for (const user of users) {
    if (!user.email) { skipped++; continue; }

    // Skip if we already sent one in the last 30 days
    if (user.reengagement_sent_at) {
      const lastSent = new Date(user.reengagement_sent_at);
      const daysSinceLastEmail = (Date.now() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastEmail < 30) { skipped++; continue; }
    }

    // Check their most recent order
    const { data: orders } = await supabase
      .from("orders")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const lastOrderDate = orders?.[0]?.created_at
      ? new Date(orders[0].created_at)
      : null;

    // If they have a recent order (within 2 weeks), skip
    if (lastOrderDate && lastOrderDate > twoWeeksAgo) {
      skipped++;
      continue;
    }

    // If they've never ordered OR last order was 2+ weeks ago → send email
    try {
      const name = user.full_name?.trim() || "there";

      await sendMail({
        to: user.email,
        subject: `We miss you, ${name}! 🛒 Your fresh groceries are waiting`,
        html: reengagementTemplate(name),
      });

      // Mark as sent
      await supabase
        .from("profiles")
        .update({ reengagement_sent_at: new Date().toISOString() })
        .eq("id", user.id);

      sent++;
      console.log(`[reengagement] Sent to ${user.email}`);
    } catch (err) {
      console.error(`[reengagement] Failed for ${user.email}:`, err);
      skipped++;
    }
  }

  console.log(`[reengagement] Done — sent: ${sent}, skipped: ${skipped}`);
  return NextResponse.json({ success: true, sent, skipped });
}